/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const app = require('./dist/app');
const serverless = require('serverless-http');

module.exports.serverAPI = serverless(app.default);
