# Electrogram

A simple photo editor built with Angular 2 and electron. It allows you to upload/drag-and-drop images, apply filters to them, and save them to your desktop.

## Prerequisites
You will need to have [Git](https://git-scm.com/) and [Node.js + NPM](http://nodejs.org) installed on your machine. Once those are installed, you will need to install the `typings` NPM package globally. `Typings` handles the typescript definition files for our application.

## Getting started

First you will need to clone the repo; then you can install the necessary NPM packages and run the app.

```bash
# Clone the repo and enter it
git clone https://github.com/onehungrymind/electrogram.git
cd electrogram

# Install dependencies
npm i

# Install type definitions
typings install

# To build only
npm run build

# To build and watch for changes
npm run watch

# Start the Electron app
npm start # runs "electron src"
```

## Distributing the app
We've included an NPM script that will build a distrubtion version of the app for OSX. To use it, execute `npm run distribute`; this will create an OSX app in `releases/Electrogram-darwin-x64` that you can run from your Finder. For more info, check out https://github.com/electron-userland/electron-packager.

## The code
Here is a quick overview of the project structure:
```
electrogram/
 ├──src/                       * contains the electron app script, html file, and all Angular code
 │   │
 │   ├──customDefinitions.d.ts * any TypeScript definitions that we need to provide
 │   ├──index.html             * parent HTML page where we include our built javascript files
 │   ├──main.js                * NodeJS script that bootstraps the Electron app
 │   ├──menuTemplate.js        * javascript config for the application menu
 │   │   
 │   ├──app/                   * our Angular app has one "app" component, and this holds all the related code
 │   │   ├──app.css            * app component styles
 │   │   ├──app.html           * app component template
 │   │   ├──app.ts             * app component functionality
 │   │   └──canvasService.ts   * Angular service that aids with Canvas creation and modification
 │   │
 │   └──assets/                * static assets are served here
 │       ├──css/               * global styles
 │       ├──data/              * a list of available photo filters in JSON format
 │       └──images/            * app logo and icon
 │
 ├──webpack.config.js          * configuration file that Webpack uses to build the app
 ├──tsconfig.json              * config that webpack uses for typescript
 ├──typings.json               * our typings manager
 └──package.json               * what npm uses to manage it's dependencies and scripts
 ```

## Author
<img width="50px" src="https://pbs.twimg.com/profile_images/505753644004687872/_5-AcJkD_400x400.jpeg" alt="Luke Ruebbelke">
Luke Ruebbelke
| <a href="http://www.twitter.com/simpulton"><img src="https://camo.githubusercontent.com/0dccb70faac21bb33652c53cd5ee4ecb5822ef90/687474703a2f2f692e696d6775722e636f6d2f77577a583975422e706e67" alt="alt text" title="twitter icon without padding" data-canonical-src="http://i.imgur.com/wWzX9uB.png" style="max-width:100%;"></a>
| <a href="http://www.github.com/simpulton"><img src="https://camo.githubusercontent.com/2b231c1177422557ea928991fce1ff10ec636371/687474703a2f2f692e696d6775722e636f6d2f3949364e52556d2e706e67" alt="alt text" title="github icon without padding" data-canonical-src="http://i.imgur.com/9I6NRUm.png" style="max-width:100%;"></a>
| http://onehungrymind.com
