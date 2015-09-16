'use strict';

global.chai = require('chai');
global.assert = global.chai.assert;
global.expect = global.chai.expect;
global.chai.config.includeStack = true;

process.env.NODE_ENV = 'test';
