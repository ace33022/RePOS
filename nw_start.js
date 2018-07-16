/**
 *
 * NW.js inject_js_start
 *  
 * @description
 *
 * @author ace
 * 
 * @version 2017/09/29 初始版本。
 *
 * @see <a href="http://nwjs.io/">NW.js</a>
 * @see <a href="https://github.com/nwjs/nw.js">nwjs/nw.js: Call all Node.js modules directly from DOM/WebWorker and enable a new way of writing applications with all Web technologies.</a>
 * @see <a href="http://docs.nwjs.io/">NW.js Documentation</a>
 * @see <a href="http://docs.nwjs.io/en/latest/For%20Users/Migration/From%200.12%20to%200.13/">From 0.12 to 0.13 - NW.js Documentation</a>
 *
 * @see <a href="https://github.com/nwjs/nw.js/wiki">Home · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/Manifest-format">Manifest format · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/Differences-of-JavaScript-contexts">Differences of JavaScript contexts · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/Using-Node-modules">Using Node modules · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/Changes-related-to-node">Changes related to node · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/About-Node.js-server-side-script-in-nw.js">About Node.js server side script in nw.js · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/faq-name-conflict">Faq name conflict · nwjs/nw.js Wiki</a>
 * @see <a href="https://github.com/nwjs/nw.js/wiki/window">Window · nwjs/nw.js Wiki</a>
 *
 * @see <a href="https://www.packtpub.com/books/content/using-nodejs-dependencies-nwjs">Using Node.js dependencies in NW.js | PACKT Books</a>
 * @see <a href="https://github.com/nwjs/nw.js/issues/4516">nwjs: v0.13.0-rc1: "AssertionError: path must be string" when importing requirejs · Issue #4516 · nwjs/nw.js</a>
 *
 * @comment
 *
 * @todo
 * 
 */

process.env.ConfigurationsFile = 'K:/nwJS/Videojs/javascripts/Configurations.js';
process.env.NODE_PATH = 'W:/Tool/Package/LangEnv/JavaScript/nodeJS/node_modules';

var Configurations = require(process.env.ConfigurationsFile);

var nwrequirejs = require(process.env.NODE_PATH + '/' + 'requirejs/bin/r.js');  // require.js

nwrequirejs.config(require(process.env.NODE_PATH + '/' + 'tw/ace33022/RequireJSConfig.js'));

nwrequirejs(["tw.ace33022.util.StringUtils"], function(StringUtils) {

});