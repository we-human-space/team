const fs = require('fs-extra');
const md5 = require('md5');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const project_config = require('../config/project.config.js');
const webpack_config = require('../config/webpack.config.js');

const __PROD__ = project_config.globals.__PROD__;

let revisionedAssetManifest =
  fs.readJsonSync(project_config.paths.public(project_config.manifestFileName), {throws: false}) || {};

const configurePlugins = (opts = {}) => {
  const plugins = [
    // Give modules a deterministic name for better long-term caching:
    // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
    new webpack.NamedModulesPlugin(),

    // Give dynamically `import()`-ed scripts a deterministic name for better
    // long-term caching. Solution adapted from:
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new webpack.NamedChunksPlugin((chunk) => chunk.name ? chunk.name
      : md5(chunk.mapModules((m) => m.identifier()).join()).slice(0, 10)),

    // Extract runtime code so updates don't affect app-code caching:
    // https://webpack.js.org/guides/caching/
    new webpack.optimize.CommonsChunkPlugin({
      name: opts.runtimeName || 'runtime'
    }),

    new webpack.DefinePlugin(project_config.globals),

    // Give deterministic names to all webpacks non-"normal" modules
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new NameAllModulesPlugin(),

    new ManifestPlugin({
      fileName: project_config.manifestFileName,
      seed: revisionedAssetManifest
    })
  ];

  if(__PROD__) {
    plugins.push(new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          // Works around a Safari 10 bug:
          // https://github.com/mishoo/UglifyJS2/issues/1753
          safari10: true
        }
      }
    }));
  }

  return plugins;
};

const configureBabelLoader = (browserlist) => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            debug: true,
            modules: false,
            useBuiltIns: true,
            targets: {
              browsers: browserlist
            }
          }]
        ],
        plugins: ['syntax-dynamic-import']
      }
    }
  };
};

const modernConfig = Object.assign({}, webpack_config, {
  entry: {
    'index': project_config.paths.src('index.js')
  },
  plugins: configurePlugins({runtimeName: 'runtime'}),
  module: {
    rules: [
      configureBabelLoader([
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">.
        'last 2 Chrome versions', 'not Chrome < 60',
        'last 2 Safari versions', 'not Safari < 10.1',
        'last 2 iOS versions', 'not iOS < 10.3',
        'last 2 Firefox versions', 'not Firefox < 54',
        'last 2 Edge versions', 'not Edge < 15'
      ])
    ]
  }
});

const legacyConfig = Object.assign({}, webpack_config, {
  entry: {
    'index.legacy': project_config.paths.src('index.legacy.js')
  },
  plugins: configurePlugins({runtimeName: 'runtime-legacy'}),
  module: {
    rules: [
      configureBabelLoader([
        '> 1%',
        'last 2 versions',
        'Firefox ESR'
      ])
    ]
  }
});

const createCompiler = (config) => {
  const compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if(err) return reject(err);
        console.log(stats.toString({colors: true}) + '\n');
        resolve();
      });
    });
  };
};

const compileModernBundle = createCompiler(modernConfig);
const compileLegacyBundle = createCompiler(legacyConfig);

module.exports = async () => {
  revisionedAssetManifest = {};
  await compileModernBundle();
  await compileLegacyBundle();
};
