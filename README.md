ASP.NET Core Starter Kit 2.0
==================

This project is just a mix of [ASP.NET Core Starter Kit](https://github.com/kriasoft/aspnet-starter-kit) and Microsoft [ASP.NET Core React/Redux template](https://docs.microsoft.com/en-us/aspnet/core/spa/react?tabs=visual-studio).

## Why ?
I like original ASP.NET Core Starter Kit because it embraces [Node.js](https://nodejs.org/) and allows you to run on top of Kestrel web server but unfortunatelly it wasn't updated to [.NET Core SDK 2.0](https://www.microsoft.com/net/download/).

I like Microsoft ASP.NET Core React/Redux template but I don't like how it integrates with [Node.js](https://nodejs.org/) using node commands inside `.csproj` file:  

- is less flexible than npm scripts and also less familiar to front-end developers
- Node.js commands are embedded inside the `.csproj` project file which is great when you are just using Visual Studio to compile .NET Core but which is quite annoying when you like to work with npm scripts and CLI.