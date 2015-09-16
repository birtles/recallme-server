'use strict';

const nconf = require('nconf'),
      path = require('path'),
      Server = require('./app.js');

nconf.env().argv();

let configFile = nconf.get('config') ||
                 path.join(__dirname, 'config.json');
try {
  console.log('Loading ' + configFile + '...');
  nconf.file(configFile);
} catch (e) {
  console.warn('Failed to load configuration file');
  console.log(e);
}

nconf.defaults({
  'connection': { 'port': '443' }
});

var server = new Server(nconf);
