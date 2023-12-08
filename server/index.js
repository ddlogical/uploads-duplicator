'use strict';

const contentTypes = require('./content-types');
const controllers = require('./controllers');
const routes = require('./routes');
const services = require('./services');
const {changeStatus} = require('./helpers');

process.on('SIGINT', async () => {
  await changeStatus(false, 0);
  process.exit();
});

process.on('SIGTERM', async () => {
  await changeStatus(false, 0);
  process.exit();
});

module.exports = {
  controllers,
  routes,
  services,
  contentTypes,
};
