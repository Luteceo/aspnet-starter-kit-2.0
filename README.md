ASP.NET Core Starter Kit 2.0
==================

This project is a mix of [ASP.NET Core Starter Kit](https://github.com/kriasoft/aspnet-starter-kit) and Microsoft [ASP.NET Core React/Redux template](https://docs.microsoft.com/en-us/aspnet/core/spa/react?tabs=visual-studio).

## Why ?
I like original ASP.NET Core Starter Kit because it embraces [Node.js](https://nodejs.org/) and allows you to run on top of Kestrel web server but unfortunatelly it wasn't updated to support [.NET Core SDK 2.1](https://www.microsoft.com/net/download/).

I like Microsoft ASP.NET Core React/Redux template but I don't like how it integrates with [Node.js](https://nodejs.org/) using node commands from inside `.csproj` file:  

&nbsp; &nbsp; ✓ It is less flexible than npm scripts and also is less familiar to front-end developers  
&nbsp; &nbsp; ✓ Node.js commands are embedded inside the `.csproj` project file which is great if you are just using Visual Studio to compile .NET Core but is quite annoying if you like to work with npm scripts and CLI.

This projects takes **the best** parts from ASP.NET Core Starter Kit and ASP.NET Core React/Redux template to create a new template **levaraging the full power of Node.js and .NET Core 2.1 SDK with Kestrel** as a web server. [TypeScript](https://www.typescriptlang.org) was also added to the mix.

## Features

&nbsp; &nbsp; ✓ Component-based front-end development via [Webpack](https://webpack.github.io/) and [React](https://facebook.github.io/react) (see [`webpack.config.js`](webpack.config.js))  
&nbsp; &nbsp; ✓ Static type checking with [TypeScript](https://www.typescriptlang.org)  
&nbsp; &nbsp; ✓ Application state management via [Redux](http://redux.js.org/)  
&nbsp; &nbsp; ✓ Universal cross-stack routing and navigation [`history`](https://github.com/ReactJSTraining/history) (see [`client/routes.tsx`](client/routes.tsx))  
&nbsp; &nbsp; ✓ Hot Module Replacement ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) /w [React Hot Loader](http://gaearon.github.io/react-hot-loader/)  
&nbsp; &nbsp; ✓ Lightweight build automation with plain JavaScript (see [`run.js`](run.js))  
&nbsp; &nbsp; ✓ Cross-device testing with [Browsersync](https://browsersync.io/)

## Styling
The project is framework agnostic so you can easily add your preferred styling framework. 
   
&nbsp; &nbsp; [Bootstrap 4 components](https://reactstrap.github.io/)   
&nbsp; &nbsp; [Ant design components](https://ant.design/)   
&nbsp; &nbsp; [Material UI components](https://material-ui.com/)   
   
Or extend the loaders in webpack.config.js to compile your own [SASS](https://github.com/webpack-contrib/sass-loader) or [LESS](https://github.com/webpack-contrib/less-loader) styles.

Another option instead of css could be to use css-in-js. Your can see a list of frameworks at MicheleBertoli's great repo [here](https://github.com/MicheleBertoli/css-in-js). [Emotion](https://github.com/emotion-js/emotion) has worked in a few test projects but feedback on a good library that plays well with typescript are appreciated. 

## Prerequisites

* OS X, Windows or Linux
* [Node.js](https://nodejs.org) v6 or newer
* [.NET Core](https://www.microsoft.com/net/core) and [.NET Core SDK](https://www.microsoft.com/net/core)
* [Visual Studio Code](https://code.visualstudio.com/) or your prefered IDE.

### Getting Started

**Step 1**. Clone the latest version of **ASP.NET Core Starter Kit 2.0** on your local machine by running:

```shell
$ git clone -o aspnet-starter-kit -b master --single-branch \
      https://github.com/Luteceo/aspnet-starter-kit-2.0 MyApp
$ cd MyApp
```

**Step 2**. Install project dependencies listed in [`project.json`](server/project.json) and
[`package.json`](package.json) files: 

```shell
$ npm install                   # Install both Node.js and .NET Core dependencies
```

or using Yarn:

```shell
$ yarn install                   # Install both Node.js and .NET Core dependencies
```

**Step 3**. Finally, launch your web app:

```shell
$ node run start                      # Compile and lanch the app, same as running: npm start
```

The app should become available at [http://localhost:5000/](http://localhost:5000/).
See [`run.js`](run.js) for other available commands such as `node run build` etc.
You can also run your app in a release (production) mode by running `node run --release`, or without
Hot Module Replacement (HMR) by running `node run --no-hmr`.

## How to Deploy

TODO

## How to Update

You can always fetch and merge
the latest changes from this (upstream) repo back into your project by running:

```shell
$ git checkout master
$ git fetch aspnet-starter-kit-2.0
$ git merge aspnet-starter-kit-2.0/master 
```

## How to Contribute

Anyone and everyone is welcome to contribute. The best way to
start is by checking our [open issues](https://github.com/Luteceo/aspnet-starter-kit-2.0/issues),
[submit a new issues](https://github.com/Luteceo/aspnet-starter-kit-2.0/issues/new?labels=bug) or
[feature request](https://github.com/Luteceo/aspnet-starter-kit-2.0/issues/new?labels=enhancement),
participate in discussions, upvote or downvote the issues you like or dislike, send pull
requests.

## Get in Touch

* [@luteceo_fr](https://twitter.com/luteceo_fr)
* [@tjaskula](https://twitter.com/tjaskula)

## License

Copyright © 2018-present [Luteceo](http://luteceo.com). This source code is licensed under the MIT

---
Made by Tomasz Jaskula [@tjaskula](https://twitter.com/tjaskula)
