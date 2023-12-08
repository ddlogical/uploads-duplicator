'use strict';
const { google } = require('googleapis');
const {uploadFilesOnGDrive, getFilesFromGDrive, removeFilesInDirectory} = require('../helpers');
const rootDir = process.cwd();

module.exports = ({strapi}) => ({
  async uploadData(ctx) {
    try {
        const drive = google.drive({
            version: 'v3',
            auth: ctx.oauth2Client
          });
          const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
          await uploadFilesOnGDrive({gDriveDirName: data.g_drive_dir_name, dirName: 'uploads', dirPath: `${rootDir}/public/uploads`, drive});
          ctx.response.body = {message: 'Data successfully stored', success: true, rateLimitExceeded: false};
          ctx.status = 200;
    } catch(err) {
        console.error(err);
        ctx.response.body = {message: `Error: ${err}`, success: false, rateLimitExceeded: false};
        ctx.status = 500;
    }
  },
  async getData(ctx) {
    try {
        const drive = google.drive({
            version: 'v3',
            auth: ctx.oauth2Client
          });
          const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
          await getFilesFromGDrive(data.g_drive_dir_name, 'uploads', `${rootDir}/public/uploads`, drive);
          ctx.response.body = {message: 'Credentials successfully stored', success: true};
          ctx.status = 200;
    } catch(err) {
        ctx.response.body = {message: `Error: ${err}`, success: false};
        ctx.status = 500;
    }
  },
  async deleteData(ctx) {
    try {
          await removeFilesInDirectory(`${rootDir}/public/uploads`);
          ctx.response.body = {message: 'Credentials successfully stored', success: true};
          ctx.status = 200;
    } catch(err) {
      console.log(err);
        ctx.response.body = {message: `Error: ${err}`, success: false};
        ctx.status = 500;
    }
  },
});