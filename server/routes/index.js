const fs = require('fs');
const { google } = require('googleapis');
const rootDir = process.cwd();

const oauth2ClientMiddleware = async (ctx, next) => {    
  const [ data ] = await strapi.db.query('plugin::uploads-duplicator.credentials').findMany();
    if(!data || !data.client_id || !data.client_secret || !data.redirect_uri) {
      ctx.response.body = {message: 'Credentials not found', success: false};
      return;
  } else {  
    const oauth2Client = new google.auth.OAuth2(
      data.client_id,
      data.client_secret,
      data.redirect_uri
   );
  try {
    const creds = await fs.promises.readFile(`${rootDir}/uploadDuplicatorCreds.json`);
    oauth2Client.setCredentials(JSON.parse(creds));
  } catch(err) {
    console.log('No creds found');
  }
  ctx.oauth2Client = oauth2Client;
  return next();
  }
}

module.exports = [
  {
    method: 'POST',
    path: '/store-creds',
    handler: 'credsController.creds',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/check-creds',
    handler: 'credsController.checkCreds',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/auth',
    handler: 'authController.auth',
    config: {
      policies: [],
      middlewares: [oauth2ClientMiddleware],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/google/redirect',
    handler: 'redirectController.redirect',
    config: {
      policies: [],
      middlewares: [oauth2ClientMiddleware],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/upload-data',
    handler: 'dataController.uploadData',
    config: {
      policies: [],
      middlewares: [oauth2ClientMiddleware],
    },
  },
  {
    method: 'GET',
    path: '/get-data',
    handler: 'dataController.getData',
    config: {
      policies: [],
      middlewares: [oauth2ClientMiddleware],
    },
  },
  {
    method: 'GET',
    path: '/delete-data',
    handler: 'dataController.deleteData',
    config: {
      policies: [],
      middlewares: [oauth2ClientMiddleware],
    },
  },
];
