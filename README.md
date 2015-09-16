Installation
==================

> npm install

Running the server
==================

If you're really lucky, the following might work (but probably won't):

> npm start

By default the server will look for a `config.json` file in the same directory as
`index.js`. It will also look for an environment variable called `config`,
which, really, is much too generic. Probably should fix that.

Alternatively, just do:

> npm start -- --config <path-to-config-file>

Running tests
=============

> npm install-dev
> npm test
