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
// Build website and launch it in a browser for testing in watch mode
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  return Promise.resolve()
    //.then(() => run('clean'))
    //.then(() => run('appsettings'))
    .then(() => new Promise(resolve => {
      let count = 0;
      const env = {prod: false};
      const webpackConfig = require('./webpack.config')(env)[1];
      //console.log(webpackConfig);
      const compiler = webpack(webpackConfig);
      // Node.js middleware that compiles application in watch mode with HMR support
      // http://webpack.github.io/docs/webpack-dev-middleware.html
      const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: webpackConfig.stats,
      });
      compiler.plugin('done', () => {
        // Launch ASP.NET Core server after the initial bundling is complete
        if (++count === 1) {
          const options = {
            cwd: path.resolve(__dirname, './wwwroot/'),
            stdio: ['ignore', 'pipe', 'inherit'],
            env: Object.assign({}, process.env, {
              ASPNETCORE_ENVIRONMENT: 'Development',
            }),
          };
          cp.spawn('dotnet', ['watch', 'run'], options).stdout.on('data', data => {
            process.stdout.write(data);
            if (data.indexOf('Application started.') !== -1) {
              // Launch Browsersync after the initial bundling is complete
              // For more information visit https://browsersync.io/docs/options
              require('browser-sync').create().init({
                proxy: {
                  target: 'localhost:5000',
                  middleware: [
                    webpackDevMiddleware,
                    require('webpack-hot-middleware')(compiler),
                  ],
                },
              }, resolve);
            }
          });
        }
      });
    }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
