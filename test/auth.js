'use strict';

const request = require('supertest')
    , fs = require('fs')
    , nconf = require('nconf')
    , path = require('path');

// FIXME: Allow this to be overridden from command-line?
nconf.file(path.join(__dirname, 'config.json'));

// FIXME: Get connection details from command-line / config
const api = request('https://localhost:8443')
            // .ca(fs.readFileSync('cert/test.crt'));

// FIXME: Remove this
// (Note, if you just remove it you'll get a cryptic error from inside supertest
// where the 'res' object is undefined. That's because supertest is stupid and
// ignores the fact it has a resError before then. If you comment out the
// 'expect' lines it won't try to check the undefined res object and you'll
// get the actual error: 'self-signed certificate'. It might be that once you
// use mocha + chai then you'll end up with better errors because it checks the
// assertions later, not sure.)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

api.get('/sync/hostKey')
   .expect('Content-Type', /json/)
   .expect(200)
   .end(function(err, res){
     if (err) throw err;
   });
