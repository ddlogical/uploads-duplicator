'use strict';

module.exports = ({ strapi }) => ({
  async auth(ctx) {
    const url = ctx.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive']
    });
    ctx.redirect(url);
  },
});
