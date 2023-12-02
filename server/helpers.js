const fs = require('fs');
const mimeTypes = require('./mimeTypes.json');
const path = require('path');

async function uploadFilesOnGDrive(gDriveDirName, dirName, dirPath, drive) {
    const currentFilesData = await getDirectoryData(dirPath);
    const gDrivePath = await new Promise((resolve) => {
        const dirPathArr =  dirPath.split('/');
        const uploadsIndex = dirPathArr.findIndex(elem => elem === 'uploads');
        resolve(['', gDriveDirName, ...dirPathArr.slice(uploadsIndex)].join('/'));
    });
    const folder = await getGDriveDirectory(dirName, gDrivePath, drive);
    await writeFilesOnGDrive(currentFilesData, folder, drive);

async function getDirectoryData(dirPath) {
    const currentFilesNames = await fs.promises.readdir(dirPath);
    return await Promise.all(currentFilesNames.map(async name => {
        const fileMeta = await fs.promises.stat(`${dirPath}/${name}`);
        const isDirectory = fileMeta.isDirectory();
        const directoryData = isDirectory ? await getDirectoryData(`${dirPath}/${name}`) : null;
        return {
            name,
            modTime: fileMeta.mtime,
            isDirectory,
            directoryData
        }
    }));  
}

async function writeFilesOnGDrive(currentFilesData, folder, drive) {
    const {data: {files: uploadedFiles}} = await drive.files.list({q: `'${folder.id}' in parents and trashed=false`, fields: 'files(id, name, appProperties)'});
    const filePromises = currentFilesData.map(async (file) => {
        if(!file.isDirectory) {
            const fileFromUploads = await new Promise(resolve => resolve(uploadedFiles.find(fl => fl.name === file.name)));
            const fileData = file.name.split('.');
            const fileFormat = fileData[fileData.length - 1];
            const mimeTypeData = mimeTypes[fileFormat];
            const media = {mimeType: mimeTypeData, body: fs.createReadStream(`${dirPath}/${file.name}`)};
            const requestBodyData = {name: file.name, mimeType: mimeTypeData, appProperties: {version: file.modTime}};
            if(!fileFromUploads) {
                if(mimeTypeData) {
                    drive.files.create({requestBody: {...requestBodyData, parents: [folder.id]}, media});
                }
            } else {
                if(file.modTime.toISOString() !== fileFromUploads.appProperties.version) {
                drive.files.update({fileId: fileFromUploads.id, requestBody: requestBodyData, media});
                }
            }
        } else {
            uploadFilesOnGDrive(gDriveDirName, file.name, `${dirPath}/${file.name}`, drive);
        }
      });
      await Promise.all(filePromises);
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
    await removeFilesInDirectory(dirPath);
    const gDrivePath = await new Promise((resolve) => {
        const dirPathArr =  dirPath.split('/');
        const uploadsIndex = dirPathArr.findIndex(elem => elem === 'uploads');
        resolve(['', gDriveDirName, ...dirPathArr.slice(uploadsIndex)].join('/'));
    });
    const folder = await getGDriveDirectory(dirName, gDrivePath, drive);
    const {data: {files: uploadedFiles}} = await drive.files.list({q: `'${folder.id}' in parents and trashed=false`, fields: 'files(id, name, mimeType, appProperties)'});
    await Promise.all(uploadedFiles.map(async file => {
            if(file.mimeType === 'application/vnd.google-apps.folder') {
                await getFilesFromGDrive(gDriveDirName, file.name, `${dirPath}/${file.name}`, drive);
            } else {
                const {data} = await drive.files.get({
                    fileId: file.id,
                    alt: 'media',
                  });
                const buffer = await data.arrayBuffer();
                const convertedData = Buffer.from(buffer);
                await fs.promises.writeFile(`${dirPath}/${file.name}`, convertedData);
            }
        }));
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

module.exports = {
    uploadFilesOnGDrive,
    getFilesFromGDrive,
    removeFilesInDirectory,
    checkFile, 
    deleteFile
};