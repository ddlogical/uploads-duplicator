'use strict';

module.exports = ({ strapi }) => ({
  async checkState(ctx) {
    const [data] = await strapi.db.query('plugin::uploads-duplicator.state').findMany();
    ctx.response.body = {filesProcessing: data.files_processing, processedFiles: data.processed_files, totalFiles: data.total_files}
    ctx.status = 200;
  },
});