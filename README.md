ASP.NET Core Starter Kit 2.0
==================

This project is just a mix of [ASP.NET Core Starter Kit](https://github.com/kriasoft/aspnet-starter-kit) and Microsoft [ASP.NET Core React/Redux template](https://docs.microsoft.com/en-us/aspnet/core/spa/react?tabs=visual-studio).

## Why ?
I like original ASP.NET Core Starter Kit because it embraces [Node.js](https://nodejs.org/) and allows you to run on top of Kestrel web server but unfortunatelly it wasn't updated to [.NET Core SDK 2.0](https://www.microsoft.com/net/download/).

I like Microsoft ASP.NET Core React/Redux template but I don't like how it integrates with [Node.js](https://nodejs.org/) using node commands inside `.csproj` file:  

&nbsp; &nbsp; ✓ is less flexible than npm scripts and also less familiar to front-end developers  
&nbsp; &nbsp; ✓ Node.js commands are embedded inside the `.csproj` project file which is great if you are just using Visual Studio to compile .NET Core but is quite annoying if you like to work with npm scripts and CLI.

This projects takes **the best** in ASP.NET Core Starter Kit and ASP.NET Core React/Redux template to create a new template **levaraging the full power of Node.js and .NET Core 2.0 SDK with Kestrel** as a web server. [TypeScript](https://www.typescriptlang.org) as also added to the mix.

## Features

&nbsp; &nbsp; ✓ Component-based front-end development via [Webpack](https://webpack.github.io/) and [React](https://facebook.github.io/react) (see [`webpack.config.js`](webpack.config.js))  
&nbsp; &nbsp; ✓ Static type checking with [TypeScript](https://www.typescriptlang.org)  
&nbsp; &nbsp; ✓ Application state management via [Redux](http://redux.js.org/)  
&nbsp; &nbsp; ✓ Universal cross-stack routing and navigation [`history`](https://github.com/ReactJSTraining/history) (see [`client/routes.tsx`](client/routes.tsx))  
&nbsp; &nbsp; ✓ Hot Module Replacement ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) /w [React Hot Loader](http://gaearon.github.io/react-hot-loader/)  
&nbsp; &nbsp; ✓ Lightweight build automation with plain JavaScript (see [`run.js`](run.js))  
&nbsp; &nbsp; ✓ Cross-device testing with [Browsersync](https://browsersync.io/)
