const fs = require('fs');
const del = require('del');
const cpy = require('cpy');
const path = require('path');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const cp = require('child_process');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

//
// build vendor webpack if needed
// -----------------------------------------------------------------------------
tasks.set('buildVendor', () => new Promise((resolve, reject) => {
  if (!fs.existsSync('wwwroot/dist')) {
    const webpackConfig = require('./webpack.config.vendor');
    const compiler = webpack(webpackConfig);

    // Callback to be executed after run is complete
    const callback = (err, stats) => {
      if (err) {
        reject(err);
      }
      console.log(stats.toString({colors: true}));
      resolve();
    };

    // call run on the compiler along with the callback
    compiler.run(callback);
  }
  else
  {
    console.log('Nothing to do. If you want to regenerate "vendor" assets please delete "wwwroot/dist" folder');
    resolve();
  }
}));

//
// Build website and launch it in a browser for testing in watch mode
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  return Promise.resolve()
    //.then(() => run('clean'))
    //.then(() => run('appsettings'))
    .then(() => run('buildVendor'))
    .then(() => new Promise(resolve => {
      let count = 0;
      const webpackConfig = require('./webpack.config');
      const compiler = webpack(webpackConfig);
      // Node.js middleware that compiles application in watch mode with HMR support
      // http://webpack.github.io/docs/webpack-dev-middleware.html
      const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig[0].output.publicPath,
        stats: webpackConfig[0].stats
      });
      compiler.plugin('done', () => {
        // Launch ASP.NET Core server after the initial bundling is complete
        if (++count === 1) {
          const options = {
            cwd: path.resolve(__dirname, ''),
            stdio: ['ignore', 'pipe', 'inherit'],
            env: Object.assign({}, process.env, {
              ASPNETCORE_ENVIRONMENT: 'Development',
            }),
          };
          cp.spawn('dotnet', ['watch', 'run'], options).stdout.on('data', data => {
            process.stdout.write(data);
          });
        }
      });
    }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
