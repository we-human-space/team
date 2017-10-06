const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const config = require('../config/project.config.js');

let revisionedAssetManifest = {};

const env = nunjucks.configure(config.paths.templates(), {
  autoescape: false,
  watch: false
});

env.addFilter('revision', (filename) => revisionedAssetManifest[filename]);

module.exports = async () => {
  revisionedAssetManifest =
    await fs.readJson(config.paths.public(config.manifestFileName), {throws: false}) || {};

  await fs.outputFile(config.paths.public('index.html'), nunjucks.render('index.html'));

  console.log('Built template: index.html\n');
};
