import fetch from 'node-fetch';
import fs from 'fs';
import pathUtil from 'path';

require('dotenv').config()

async function doIt() {
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
          break;
        }
      }
      break;
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

doIt();

function doClean() {
  const dataFile = pathUtil.join(__dirname, '../data/projects.json');
  // const data = fs.readFileSync(dataFile);
  const projects = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  // const projects = data.toJSON();
  // const projects = JSON.parse(data.toString())
  // console.log(projects)
  const cleanData = clean(projects);
  const cleanFile = pathUtil.join(__dirname, '../data/projects-clean.json');

  const flat = flatten(cleanData);

  fs.writeFileSync(cleanFile, JSON.stringify(flat));
}

// doClean();

function flatten(data) {
  const events = [];
  for (const project of data) {
    for (const column of project.columns) {
      for (const card of column.cards) {
        // for (const event of card.events) {
        //   event.issue = card.content_url;
        //   event.card_created = card.created_at;
        //   event.card_updated = card.updated_at;
        //   event.status = column.name;
        //   event.project = project.name;
        //   events.push(event);
        // }
        if (card.events && card.events.length) {
          // only use the most recent event - sort by date first?
          const event = card.events[card.events.length - 1];
          event.issue = card.content_url;
          event.card_created = card.created_at;
          event.card_updated = card.updated_at;
          event.status = column.name;
          event.project = project.name;

          event.effort = card.effort;
          event.started = card.started;
          event.count = 1;
          event.title = card.title;
          events.push(event);
        }
      }
    }
  }
  return events;
}

function clean(data) {
  const projects = data;
  for (const project of projects) {
    for (const col of project.columns) {
      delete col.url;
      delete col.project_url;
      delete col.cards_url;
      delete col.node_id;
      delete col.created_at;
      delete col.updated_at;
      delete col.id;
      for (const card of col.cards) {
        delete card.creator;
        delete card.url;
        delete card.project_url;
        delete card.node_id;
        delete card.column_url;
        let events = card.events || [];
        for (const event of events) {
          event.actor = event.actor || {login: ''};
          event.assignee = event.assignee || {login: ''};
          event.author = event.author || {name: ''};
          event.committer = event.committer || {name: ''};
          event.actor = event.actor.login;
          event.assignee = event.assignee.login;
          event.author = event.author.name;
          event.committer = event.committer.name;
          delete event.user;
          delete event.source;
          delete event.review_requester;
          delete event.requested_reviewer;
          delete event.verification;
          delete event.tree;
          delete event.parents;
          delete event.node_id;
          delete event.url;
          delete event.commit_id;
          delete event.commit_url;
          delete event._links;
          delete event.html_url;
          delete event.pull_request_url;
          delete event.author_association;
          delete event.body;
          delete event.submitted_at;
          delete event.milestone;

          if (event.label && event.label.name.includes('effort')) {
            const effort = event.label.name.split('/');
            card.effort = effort[1];
          } else if (card.effort === undefined) {
            card.effort = "";
          }

          if (card.started === undefined) {
            card.started = null;
          }

          if (event.event === 'moved_columns_in_project') {
            if (event.project_card && event.project_card.column_name === "In progress") {
              event.started = event.created_at;
              card.started = event.started;
            }
          }

          delete event.project_card;

          // card.title = 
        }
        const ignore = [
          'moved_columns_in_project', 
          'cross-referenced', 
          'labeled', 
          'unlabeled', 
          'renamed', 
          'referenced', 
          'commented', 
          'mentioned', 
          'subscribed',
          'head_ref_force_pushed',
          'head_ref_deleted',
          'committed'
        ];
        events = events.filter(e => !ignore.includes(e.event));
        card.events = events;
      }
    }
  }
  return projects;
}