'use strict';

const credsController = require('./creds-controller');
const authController = require('./auth-controller');
const dataController = require('./data-controller');
const redirectController = require('./redirect-controller');
const stateController = require('./state-controller');

module.exports = {
  credsController,
  authController,
  redirectController,
  dataController,
  stateController
};
