const chokidar = require('chokidar');
const connect = require('connect');
const debounce = require('lodash.debounce');
const serveStatic = require('serve-static');
const compile = require('./compile');
const config = require('../config/project.config.js');

(async () => {
  await compile();

  console.log('Watching source files for changes...');
  chokidar
    .watch([config.paths.bin(), config.paths.config(), config.paths.src()], {ignoreInitial: true})
    .on('all', debounce(compile, 100));

  console.log(`Serving files from http://localhost:${config.port}`);
  connect().use(serveStatic(config.paths.public())).listen(config.port);
})();
