/* eslint-disable */
const fs = require('fs');
const del = require('del');
const cpy = require('cpy');
const path = require('path');
const webpack = require('webpack');
const cp = require('child_process');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => {
    console.error(err.stack);
    if (!global.DEBUG) {
      process.exit(1);
    }
  });
}

//
// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => Promise.resolve()
  .then(() => del(['coverage/*', 'wwwroot/dist', 'server/bin/*'], { dot: true }))
);

//
// Build vendor webpack if needed
// -----------------------------------------------------------------------------
tasks.set('bundleVendor', () => new Promise((resolve, reject) => {
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
    console.log('Nothing to do. If you want to regenerate "vendor" assets please delete "wwwroot/dist" folder or run "npm run clean" command');
    resolve();
  }
}));

//
// Copy ASP.NET application config file for production and development environments
// -----------------------------------------------------------------------------
tasks.set('appsettings', () => new Promise(resolve => {
  const environments = ['Production', 'Development'];
  let count = environments.length;
  const source = require('./server/appsettings.json');
  delete source.Logging;
  environments.forEach(env => {
    const filename = path.resolve(__dirname, `./server/appsettings.${env}.json`);
    try {
      fs.writeFileSync(filename, JSON.stringify(source, null, '  '), { flag: 'wx' });
    } catch (err) {}
    if (--count === 0) resolve();
  });
}));

//
// Build server and client application
// -----------------------------------------------------------------------------
tasks.set('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false;
  return Promise.resolve()
    .then(() => run('bundleVendor'))
    .then(() => run('appsettings'))
    .then(() => new Promise((resolve, reject) => {
      const options = { stdio: ['ignore', 'inherit', 'inherit'] };
      const config = global.DEBUG ? 'Debug' : 'Release';
      let args = ['publish', 'server', '-o', '../build', '-c', config];
      if (global.DEBUG) args = ['build', 'server', '-c', config];
      cp.spawn('dotnet', args, options).on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`dotnet ${args.join(' ')} => ${code} (error)`));
        }
      });
    }));
});


//
// Run tests
// -----------------------------------------------------------------------------
tasks.set('test', () => {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';
  process.env.PUBLIC_URL = '';
  return Promise.resolve()
    .then(() => run('bundleVendor'))
    .then(() => run('appsettings'))
    .then(() => new Promise((resolve, reject) => {
      // Makes the script crash on unhandled rejections instead of silently
      // ignoring them. In the future, promise rejections that are not handled will
      // terminate the Node.js process with a non-zero exit code.
      process.on('unhandledRejection', err => {
        throw err;
      });

      // Ensure environment variables are read.
      // require('../config/env');

      const jest = require('jest');
      const argv = process.argv.slice(2);

      // Watch unless on CI or in coverage mode
      if (!process.env.CI && argv.indexOf('--coverage') < 0) {
        argv.push('--watch');
      }

      jest.run(argv);
    }));
});

//
// Bundles all scripts in release mode
// -----------------------------------------------------------------------------
tasks.set('bundleAll', () => {
  global.DEBUG = process.argv.includes('--debug') || false;
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('appsettings'))
    .then(() => run('build'))
    .then(() => run('bundleVendor'))
    .then(() => new Promise(resolve => {
      const webpackConfig = require('./webpack.config');
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
    }));
});

//
// Publishes bundled files
// -----------------------------------------------------------------------------
tasks.set('publish', () => {
  return Promise.resolve()
    .then(() => run('bundleAll'))
    .then(() => new Promise(resolve => {
      cpy(['wwwroot/**/*.*'], 'build', { parents: true })
    }));
});

//
// Build website and launch it in a browser for testing in watch mode
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('appsettings'))
    .then(() => run('build'))
    .then(() => run('bundleVendor'))
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
      compiler.hooks.done.tap('done', () => {
        // Launch ASP.NET Core server after the initial bundling is complete
        if (++count === 1) {
          const options = {
            cwd: path.resolve(__dirname, './server/'),
            stdio: ['ignore', 'pipe', 'inherit'],
            env: Object.assign({}, process.env, {
              ASPNETCORE_ENVIRONMENT: 'Development',
              NODE_PATH: '../node_modules/'
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
