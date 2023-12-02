'use strict';

module.exports = ({ strapi }) => ({
  async creds(ctx) {
    const {clientId, clientSecret, redirectURI, gDriveDirName} = ctx.request.body;
    ctx.response.body = await strapi.plugin('uploads-duplicator').service('credsService').storeCreds(clientId, clientSecret, redirectURI, gDriveDirName);
    ctx.status = 200;
  },
  async checkCreds(ctx) {
    const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
    if(!data || !data.client_id || !data.client_secret || !data.redirect_uri || !data.g_drive_dir_name) {
        ctx.response.body = {message: 'Credentials not found', success: false};
    } else {
        if(!data.next_clicked) {
          ctx.response.body = {message: 'Next don\'t clicked', nextClicked: false, success: true};
        } else {
          ctx.response.body = {message: 'Credentials successfully stored', nextClicked: true, success: true};
        }
    }
    ctx.status = 200;
  },
});