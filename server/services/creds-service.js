'use strict';
const rootDir = process.cwd();
const { checkFile, deleteFile } = require('../helpers');

module.exports = ({ strapi }) => ({
  async storeCreds(clientId, clientSecret, redirectURI, gDriveDirName) {
    const fileExists = await checkFile(`${rootDir}/uploadDuplicatorCreds.json`);
    const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
    if(data) {
      await strapi.db.query('plugin::uploads-duplicator.credentials').deleteMany();
    }
    if(fileExists) {
        await deleteFile(`${rootDir}/uploadDuplicatorCreds.json`);
    }
    await strapi.entityService.create('plugin::uploads-duplicator.credentials', { data: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectURI,
      g_drive_dir_name: gDriveDirName,
      next_clicked: false,
    }});
    return {message: 'Credentials successfully stored', success: true};
  },
});