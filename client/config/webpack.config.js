const project = require('./project.config.js');

const webpack_config = {
  /* BASE CONFIG */
  entry: [project.paths.src()],
  output: {
    path: project.paths.public(),
    publicPath: '/',
    filename: '[name]-[chunkhash:10].js'
  },
  resolve: {
    alias: {
      'dat.gui': 'dat.gui/build/dat.gui.min.js'
    }
  },
  cache: {},
  /* DEV TOOLS */
  devtool: '#source-map'
};

module.exports = webpack_config;
