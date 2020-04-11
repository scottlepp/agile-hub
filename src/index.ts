import { fetchData } from './fetch';
import { analyze } from './sprint';
import { doClean } from './clean';

require('dotenv').config()

const args = process.argv.slice(2);

if (args.length && args[0] === "fetch") {
  fetchData();
}

if (args.length && args[0] === "clean") {
  doClean();
}

if (args.length && args[0] === "analyze") {
  analyze();
}
