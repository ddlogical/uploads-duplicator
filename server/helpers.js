const fs = require('fs');
const mimeTypes = require('./mimeTypes.json');
const path = require('path');

async function uploadFilesOnGDrive({gDriveDirName, dirName, dirPath, drive}) {
  await changeStatus(true, 0);
  const currentFilesData = await getDirectoryData(dirPath);
  await changeStatus(true, 0, currentFilesData.length);
  const gDrivePath = await new Promise((resolve) => {
      const dirPathArr =  dirPath.split('/');
      const uploadsIndex = dirPathArr.findIndex(elem => elem === 'uploads');
      resolve(['', gDriveDirName, ...dirPathArr.slice(uploadsIndex)].join('/'));
    });
  const folder = await getGDriveDirectory(dirName, gDrivePath, drive);
  await writeFilesInBatches(drive, currentFilesData, folder);
  await changeStatus(false, 0);
  
async function getDirectoryData(dirPath) {
    const currentFilesNames = await fs.promises.readdir(dirPath);
    return await Promise.all(currentFilesNames.map(async name => {
        try {
          const fileMeta = await fs.promises.stat(`${dirPath}/${name}`);
          const isDirectory = fileMeta.isDirectory();
          const directoryData = isDirectory ? await getDirectoryData(`${dirPath}/${name}`) : null;
          return {
              name,
              modTime: fileMeta.mtime,
              isDirectory,
              directoryData,
              isError: false
          }
        } catch(error) {
          return {
            isError: true,
            error
          }
        }
    }));  
}

async function writeFilesInBatches(drive, files, folder, batchSize = 10) {
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      if(batchSize !== 1) {
        await changeStatus(true, i);
      }
      await Promise.all(batch.map(async (file) => {
        try {
        if(!file.isError) {
          const resp = await drive.files.list({q: `name='${file.name}' and trashed=false`, fields: 'files(id, name, appProperties)'});
          const fileFromUploads = resp.data.files ? resp.data.files[0] : null;
          const fileData = file.name.split('.');
          const fileFormat = fileData[fileData.length - 1];
          const mimeTypeData = mimeTypes[fileFormat];
          const media = {mimeType: mimeTypeData, body: await fs.createReadStream(`${dirPath}/${file.name}`)};
          const requestBodyData = {name: file.name, mimeType: mimeTypeData, appProperties: {version: file.modTime}};
          if(!fileFromUploads) {
            if(mimeTypeData) {
                await drive.files.create({requestBody: {...requestBodyData, parents: [folder.id]}, media});
            }
          } else {
               if(file.modTime.toISOString() !== fileFromUploads.appProperties.version) {
                 await drive.files.update({fileId: fileFromUploads.id, requestBody: requestBodyData, media});
             }
          }
        }
        } catch (error) {
          console.error('Error uploading file:', error.message);
          if (error?.status && (error.status === 429 || error.status === 403)) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return writeFilesInBatches(drive, [file], folder, 1); 
          } else {
            throw error;
          }
        }
      }));
    }
  }
}

async function getGDriveDirectory(dirName, dirPath, drive) {
    const folderListResp = await drive.files.list({q: 'mimeType = \'application/vnd.google-apps.folder\' and trashed=false'});
    const folderList = folderListResp?.data?.files ?? [];
    let folder = await new Promise((resolve) => resolve(folderList.find(folder => folder.name === dirName)));
    const pathArr = dirPath.split('/');
    const parentData = [];
    if (pathArr.length > 2) {
        const parent = await getGDriveDirectory(pathArr[pathArr.length - 2], pathArr.slice(0, pathArr.length - 2).join('/'), drive);
        parentData.push(parent.id);
    }
    if(!folder) {
        const { data } = await drive.files.create({
            requestBody: {
              name: dirName,
              mimeType: 'application/vnd.google-apps.folder',
              parents: parentData
            },
        });
        folder = data;
    }
    return folder;
}

async function getFilesFromGDrive(gDriveDirName, dirName, dirPath, drive) {
    await changeStatus(true, 0);
    await removeFilesInDirectory(dirPath);
    const gDrivePath = await new Promise((resolve) => {
        const dirPathArr =  dirPath.split('/');
        const uploadsIndex = dirPathArr.findIndex(elem => elem === 'uploads');
        resolve(['', gDriveDirName, ...dirPathArr.slice(uploadsIndex)].join('/'));
    });
    const folder = await getGDriveDirectory(dirName, gDrivePath, drive);
    const allFilesOnGDrive = await listFiles(drive, folder);
    await changeStatus(true, 0, allFilesOnGDrive.length);
    await getFilesInBatches(drive, allFilesOnGDrive);
    await changeStatus(false, 0);

    async function getFilesInBatches(drive, files, batchSize = 10) {
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        if(batchSize !== 1) {
          await changeStatus(true, i);
        }
        await Promise.all(batch.map(async (file) => {
          try {
            const resp = await drive.files.get({fileId: file.id, alt: 'media'});
            if(resp?.data) {
                  const buffer = await resp.data.arrayBuffer();
                 const convertedData = Buffer.from(buffer);
                 await fs.promises.writeFile(`${dirPath}/${file.name}`, convertedData);
            }
          } catch (error) {
            console.error('Error uploading file:', error.message);
            if (error?.status && (error.status === 429 || error.status === 403)) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return getFilesInBatches(drive, [file], 1); 
            } else {
              throw error;
            }
          }
        }));
      }
    }
}


async function changeStatus(filesProcessing, processedFiles, totalFiles = 0) {
  try {
    const [data] = await strapi.db.query('plugin::uploads-duplicator.state').findMany();
    await strapi.db.query('plugin::uploads-duplicator.state').update({
      where: { id: data.id },
      data: {
        files_processing: filesProcessing,
        processed_files: processedFiles, 
        total_files: totalFiles > 0 ? totalFiles : data.total_files 
    }});
  } catch(err) {
    console.log('Error in changeStatus function');
    throw err;
  }
}



async function removeFilesInDirectory(dirPath) {
    try {
      const files = await fs.promises.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

async function checkFile(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
      } catch (error) {
          return false;
      }
}

async function deleteFile(filePath) {
    try {
          await fs.promises.unlink(filePath);
      } catch (err) {
        console.error('Error:', err);
      }
}

async function listFiles(drive, folder, pageToken) {
  try {
    const resp = await drive.files.list({ q: `'${folder.id}' in parents and trashed=false`, fields: 'nextPageToken, files(id, name)', pageToken: pageToken});
    if(resp?.data?.nextPageToken) {
      const nextData = await listFiles(drive, folder, resp.data.nextPageToken);
      return resp?.data?.files ? [...resp?.data?.files, ...nextData] : [...nextData];
    } else {
      return resp?.data?.files ? resp?.data?.files : [];
    }
  } catch(error) {
    console.error(error);
    return [];
  }
}

module.exports = {
    uploadFilesOnGDrive,
    getFilesFromGDrive,
    removeFilesInDirectory,
    changeStatus,
    checkFile, 
    deleteFile
};