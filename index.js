'use strict';

const express = require('express'),
      fs = require('fs'),
      morgan = require('morgan'),
      nconf = require('nconf'),
      path = require('path'),
      https = require('https');

// Load configuration
// -------------------------

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

// Setup server
// -------------------------

const app = express();

app.use(morgan('dev'));

// XXX This should return 403 for Auth-failed
app.get('/sync/hostKey', function (req, res) {
  res.status(200).json({ 'key': 'test' });
});

let sslOptions = {
  key: fs.readFileSync(nconf.get('connection:key')),
  cert: fs.readFileSync(nconf.get('connection:cert')),
  passphrase: nconf.get('connection:passphrase')
};

const server = https.createServer(sslOptions, app)
                    .listen(nconf.get('connection:port'), function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
