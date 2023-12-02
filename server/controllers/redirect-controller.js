'use strict';
const fs = require('fs');
const rootDir = process.cwd();

module.exports = ({strapi}) => ({
  async redirect(ctx) {
    try {
    const { code } = ctx.request.query;
    if (!code) throw new Error('Invalid request');
    const {tokens} = await ctx.oauth2Client.getToken(code);
    if (!tokens) throw new Error('Invalid request');
    ctx.oauth2Client.setCredentials(tokens);
    await fs.promises.writeFile(`${rootDir}/uploadDuplicatorCreds.json`, JSON.stringify(tokens));
    const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
    await strapi.db.query('plugin::uploads-duplicator.credentials').update({
      where: { id: data.id },
      data: {
        next_clicked: true,
      },
    });
    ctx.redirect('/admin/plugins/uploads-duplicator');
    } catch (err) {
      ctx.request.body = {message: 'Something went wrong', success: false};
      ctx.status = 500;
    }
  },
});