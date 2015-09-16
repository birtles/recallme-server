'use strict';

const express = require('express'),
      fs = require('fs'),
      morgan = require('morgan'),
      path = require('path'),
      https = require('https');

// Create a new server with the given configuration.
//
// @param {nconf} configuration object
// @return {https.Server}
// @api public

module.exports = function(conf) {
  const app = express();
  app.use(morgan('dev'));

  // XXX This should return 403 for Auth-failed
  app.get('/sync/hostKey', function (req, res) {
    res.status(200).json({ 'key': 'test' });
  });

  let sslOptions = {
    key: fs.readFileSync(conf.get('connection:key')),
    cert: fs.readFileSync(conf.get('connection:cert')),
    passphrase: conf.get('connection:passphrase')
  };

  const server = https.createServer(sslOptions, app)
                      .listen(conf.get('connection:port'), function() {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
  });

  return server;
}
