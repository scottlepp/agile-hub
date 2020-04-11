import fetch from 'node-fetch';
import fs from 'fs';
import pathUtil from 'path';

require('dotenv').config()

export async function fetchData() {
  // let res = await fetch("https://api.github.com/orgs/grafana/projects", options);
  // const projects = await res.json();
  // console.log(projects);

  const projects = [];
  const project = {id: 3545663, name: 'Plugins/Integrations Team', columns: []};

  const columns = await get("https://api.github.com/projects/3545663/columns");
  project.columns = columns

  // console.log(columns);
  for (const col of columns) {
    console.log("Getting cards for Column " + col.name);
    // if (col.name === "In progress") {
      const cards = await get(`https://api.github.com/projects/columns/${col.id}/cards`);
      col.cards = cards;
      for (const card of cards) {
        if (card.content_url) {
          const path = card.content_url.split('/');
          const issueId = path[path.length - 1];
          // const issue = await get(card.content_url);
          const repo = path[path.length - 3];
          // console.log(card);

          console.log("Getting issue " + issueId);
          const issue = await get(card.content_url);
          card.title = issue.title;
          card.issue = issue;

          console.log("Getting events for " + issueId);
          const eventUrl = `https://api.github.com/repos/grafana/${repo}/issues/${issueId}/timeline`;
          // console.log(eventUrl);
          const opts = {
            headers: {
              'Accept':'application/vnd.github.mockingbird-preview, application/vnd.github.starfox-preview'
            }
          }
          const events = await get(eventUrl, opts);
          // console.log(events);
          card.events = events;
          // break;
        }
      }
      // break;
    // }
  }

  projects.push(project);

  const dataFile = pathUtil.join(__dirname, '../data/projects.json');
  fs.writeFileSync(dataFile, JSON.stringify(projects));
}

async function get(url: string, opts?) {
  let options = {headers: 
    {'Accept':'application/vnd.github.inertia-preview+json',
    'Authorization':`Basic ${process.env.KEY}`}
  }
  
  if (opts !== undefined) {
    options.headers = {...options.headers, ...opts.headers}
  }

  const res = await fetch(url, options);
  return res.json();
}
