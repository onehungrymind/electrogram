# Electrogram (01-hello-electron)

A basic electron app that just displays some styled text in a window.

## Prerequisites
You will need to have [Git](https://git-scm.com/) and [Node.js (5.x and above) + NPM (3.x and above)](http://nodejs.org). We generally suggest installing [`NVM`](https://github.com/creationix/nvm) to manage Node versions. Once those are installed, you will need to install the `typings` NPM package globally. `Typings` handles the typescript definition files for our application.

## Getting started

First you will need to clone the repo; then you can install the necessary NPM packages and run the app.

```bash
# Clone the repo and enter it
git clone https://github.com/onehungrymind/electrogram.git
cd electrogram

# Install dependencies
npm i

# Start the Electron app
npm start # runs "electron main.js"
```

## The code
Here is a quick overview of the project structure:
```
electrogram/
 │
 ├──assets/                    * static assets are served here
 │   ├──css/                   * global styles
 │   └──images/                * app logo
 │
 ├──index.html                 * parent HTML page where we include our built javascript files
 │
 ├──main.js                    * NodeJS script that bootstraps the Electron app
 │
 └──package.json               * what npm uses to manage it's dependencies and scripts
 ```

## Author
<img width="50px" src="https://pbs.twimg.com/profile_images/505753644004687872/_5-AcJkD_400x400.jpeg" alt="Luke Ruebbelke">
Luke Ruebbelke
| <a href="http://www.twitter.com/simpulton"><img src="https://camo.githubusercontent.com/0dccb70faac21bb33652c53cd5ee4ecb5822ef90/687474703a2f2f692e696d6775722e636f6d2f77577a583975422e706e67" alt="alt text" title="twitter icon without padding" data-canonical-src="http://i.imgur.com/wWzX9uB.png" style="max-width:100%;"></a>
| <a href="http://www.github.com/simpulton"><img src="https://camo.githubusercontent.com/2b231c1177422557ea928991fce1ff10ec636371/687474703a2f2f692e696d6775722e636f6d2f3949364e52556d2e706e67" alt="alt text" title="github icon without padding" data-canonical-src="http://i.imgur.com/9I6NRUm.png" style="max-width:100%;"></a>
| http://onehungrymind.com
