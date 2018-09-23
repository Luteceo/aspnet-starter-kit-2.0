/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');

const config = (isDebug) => {
    const isDevBuild = isDebug;

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.tsx?$/, include: /client/,
                  use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        babelrc: false,
                        plugins: ['react-hot-loader/babel'],
                      },
                    },
                    'awesome-typescript-loader?silent=true', // (or awesome-typescript-loader)
                  ]},
                {
                  test: /\.js$/,
                  use: ["source-map-loader"],
                  enforce: "pre"
                },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [new CheckerPlugin()]
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './client/boot-client.tsx' },
        module: {
          rules: [
            { test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    minimize: isDevBuild,
                    sourceMap: isDevBuild
                  }
                }
              ]
            }
          ]
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
          new MiniCssExtractPlugin({filename : 'site.css'}),
          new webpack.DllReferencePlugin({
              context: __dirname,
              manifest: require('./wwwroot/dist/vendor-manifest.json')
          })
        ],
        optimization: {
          minimize: !isDevBuild
        },
        devtool: isDevBuild ? 'inline-source-map' : 'source-map'
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './client/boot-server.tsx' },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/server/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, 'wwwroot', 'dist', 'server')
        },
        target: 'node',
        devtool: isDevBuild ? 'inline-source-map' : 'source-map'
    });

    return [clientBundleConfig, serverBundleConfig];
};

module.exports = config(isDebug);
