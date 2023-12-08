'use strict';
const rootDir = process.cwd();
const { checkFile, deleteFile } = require('../helpers');

module.exports = ({ strapi }) => ({
  async storeCreds(clientId, clientSecret, redirectURI, gDriveDirName) {
    const fileExists = await checkFile(`${rootDir}/uploadDuplicatorCreds.json`);
    const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
    const [ state ] = await strapi.db.query('plugin::uploads-duplicator.state').findMany();
    if(data) {
      await strapi.db.query('plugin::uploads-duplicator.credentials').deleteMany();
    }
    if(fileExists) {
        await deleteFile(`${rootDir}/uploadDuplicatorCreds.json`);
    }
    if(state) {
      await strapi.db.query('plugin::uploads-duplicator.state').deleteMany();
    }
    await strapi.entityService.create('plugin::uploads-duplicator.credentials', { data: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectURI,
      g_drive_dir_name: gDriveDirName,
      next_clicked: false,
    }});
    await strapi.entityService.create('plugin::uploads-duplicator.state', { data: {
      files_processing: false,
      processed_files: 0,  
      total_files: 0
    }});
    return {message: 'Credentials successfully stored', success: true};
  },
});