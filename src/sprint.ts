import fs from 'fs';
import pathUtil from 'path';

export function analyze() {
  const dataFile = pathUtil.join(__dirname, '../data/projects.json');
  const projects = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  let count = 0;

  const sprintItems = [];
  const addedItems = [];
  const startedItems = [];
  const completedItems = [];
  let forecastItems = [];
  let inProgressItems = [];

  const start = new Date('2020-04-01T00:00:00Z');
  const end = new Date('2020-04-15T00:00:00Z');

  // TODO - what is currently in sprint


  for (const project of projects) {
    // console.log('columns ' + project.columns.length);
    for (const column of project.columns) {

      // console.log('cards ' + column.cards.length);
      let priority = 1;
      for (const card of column.cards) {
        card.priority = priority;
        const events = card.events || [];
        // console.log('events ' + events.length);
        const clean = cleanCard(card);
        for (const event of events) {

          card.status = column.name;

          if (event.event === 'moved_columns_in_project') {
            if (event.project_card && event.project_card.column_name === "In progress") {
              event.started = event.created_at;
              card.started = event.started;
            }
            card.moved_at = event.created_at;
            card.moved = new Date(event.created_at).getTime();
          }

          if (event.label && event.label.name.includes('effort')) {
            const effort = event.label.name.split('/');
            card.effort = effort[1];
          } else if (card.effort === undefined) {
            card.effort = "";
          }

          if (event.project_card) {
            const cols = ['Sprint Commitments', 'Sprint Forecast'];
            if (cols.includes(event.project_card.column_name)) {
              cleanEvent(event);
              if (event.created >= start && event.created <= end) {
                sprintItems.push(clean);
                addedItems.push(clean);
              }
            }

            // moved from 
            if (cols.includes(event.project_card.previous_column_name)) {
              cleanEvent(event);
              if (event.created >= start && event.created <= end) {
                sprintItems.push(clean);
              }
            }

            // started
            if (event.project_card.column_name === 'In progress') {
              card.started_at = event.created_at;
              cleanEvent(event);
              card.started = event.created;
              if (event.created >= start && event.created <= end) {
                sprintItems.push(clean);
                startedItems.push(clean);
              }
            }
            // TODO - may have been moved after started
            // look for events after this
          }
        }
        priority += 1;
      }

      if (column.name === 'Sprint Forecast') {
        forecastItems = forecastItems.concat(column.cards);
      }

      if (column.name === 'In progress') {
        inProgressItems = inProgressItems.concat(column.cards);
      }
    }
  }

  // for (const item of sprintItems) {
  //   console.log(item);
  // }

  // console.log('count ' + sprintItems.length);
  console.log('added ' + addedItems.length);
  console.log('started ' + startedItems.length);
  console.log('forecast ' + forecastItems.length);
  console.log('in progress ' + inProgressItems.length);

  inProgressItems = inProgressItems.map(item => cleanCard(item));


  // see what carried over
  const carriedOver = inProgressItems.filter(item => item.started < start);

  console.log('IN PROGRESS', inProgressItems);
  console.log('CARRIED OVER', carriedOver);
}

function cleanEvent(event) {
  if (event.actor) {
    event.actor = event.actor.login;
  }
  delete event.id;
  delete event.node_id;
  delete event.url;
  delete event.commit_id;
  delete event.commit_url;

  event.created = new Date(event.created_at).getTime();
}

function cleanCard(card) {
  const clone = JSON.parse(JSON.stringify(card));
  if (card.issue && card.issue.assignee) {
    card.assignee = card.issue.assignee.login;
    const repoPath = card.issue.repository_url.split('/');
    card.repo = repoPath[repoPath.length -1];
  }
  const remove = ['id', 'node_id', 'url', 'commit_id', "commit_url", 'column_url', 'content_url', 'issue', 'project_url', 'events'];
  for (const item of remove) {
    delete clone[item];
  }
  if (clone.creator) {
    clone.creator = clone.creator.login;
  }
  return clone;
}


// What is after In Progress (Review/Release) that is not in this Sprint?
// -----------------------------------------------------

// look at columns after In Progress
// check the moved event date

// ***

// Track Sprint overflow
// ---------------------

// add sprints array to card

// look at 2 week intervals from when the item was put into "Sprint Forecast"

// ***

// Check effort/estimates
// ----------------------

// convert effort tshirt size to days

// is the effort correct?  days / devs = 14

// actual time vs estimates

// how far over/under estimating

// Priority
// --------

// Items should be ordered by priority within columns

// Show high priority items (top 3?)