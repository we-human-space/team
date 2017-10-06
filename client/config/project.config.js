/*
 * Inspired from davezuko's React Redux Starter Kit, available at
 * https://github.com/davezuko/react-redux-starter-kit/tree/1a4a71b182782bc12109f98106d3a65519003447
*/

const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'development',
  path_base: path.resolve(__dirname, '..'),
  port: 3000,
  dir_bin: 'bin',
  dir_config: 'config',
  dir_src: 'src',
  dir_public: 'public',
  dir_test: 'tests',
  dir_templates: 'src/templates',
  manifestFileName: 'revisioned-asset-manifest.json'
};

config.paths = {
  base: base,
  bin: base.bind(null, config.dir_bin),
  config: base.bind(null, config.dir_config),
  src: base.bind(null, config.dir_src),
  public: base.bind(null, config.dir_public),
  templates: base.bind(null, config.dir_templates)
};

config.globals = {
  '__ENV__': JSON.stringify(config.env),
  '__DEV__': JSON.stringify(config.env === 'development'),
  '__PROD__': JSON.stringify(config.env === 'production'),
  '__TEST__': JSON.stringify(config.env === 'test')
};

function base () {
  const args = [config.path_base].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
}

module.exports = config;
