# Strapi plugin uploads-duplicator

## Overview
This plugin allows you to seamlessly synchronize your Strapi CMS uploads folder with Google Drive. 
It utilizes OAuth for secure authorization and provides a straightforward way to automate the backup and storage of your media assets.

## Getting Started

### Installation
To install the plugin, follow these steps:

1. Install Strapi CMS (if you don't have one)

2.Download the plugin:

```bash
npm install uploads-duplicator
```

2. Set enabled to true in plugins.js:

```javascript
module.exports = {
    // ...
    "uploads-duplicator": {
      enabled: true,
    },
    // ...
  };
```
3. Configure your OAuth credentials in the Strapi admin panel:
    * Visit your Google Cloud Console.
    * Create a new project.
    * Enable the Google Drive API for your project.
    * Create OAuth 2.0 credentials.

4. Go to Strapi and follow steps on plugin tab


### Usage

* If files or folders from "uploads" folder have doubles somewhere on Google Drive, they wouldn't be saved

* If you delete files in Media Library, you also should manually delete this files(all versions) on Google Drive

* Available main data formats: jpg, png, webp, gif, mp4, svg, docx, pdf, txt, zip, xlsx, json

### Contributing
Feel free to contribute to the development of this plugin. 

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.




