'use strict';

const request = require('supertest')
    , fs = require('fs')
    , nconf = require('nconf')
    , path = require('path');

// Test configuation
// -------------------------

let agent;

before(() => {
  nconf.file(path.join(__dirname, 'config.json'));

  let host = 'https://localhost';
  if (nconf.get('connection:port')) {
    host += `:${nconf.get('connection:port')}`;
  }
  let ca = fs.readFileSync(nconf.get('connection:cert'));

  // We need to use |request.agent| instead of just |request| here as
  // otherwise supertest doesn't pass along the options argument.
  agent = request.agent(host, { ca: ca });
});

// Tests
// -------------------------

// If you're seeing random errors about the 'res' object being undefined, it's
// probably an SSL error being masked by supertest's woeful error handling.
// You can comment out 'expect' statements and the like until you see the real
// error but if you're not having much luck, you can also just turn off
// certificate validation like so:
//
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('GET /sync/hostKey', () => {
  it('responds with json', done => {
    agent
      .get('/sync/hostKey')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });
});
