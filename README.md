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

### Available data formats

| File Type       | MIME Type                                                | Category    |
| --------------- | -------------------------------------------------------- | ----------- |
| .doc            | application/msword                                      | Documents   |
| .docx           | application/vnd.openxmlformats-officedocument.wordprocessingml.document | Documents   |
| .odt            | application/vnd.oasis.opendocument.text                   | Documents   |
| .rtf            | application/rtf                                         | Documents   |
| .pdf            | application/pdf                                         | Documents   |
| .txt            | text/plain                                              | Documents   |
| .zip            | application/zip                                         | Archives    |
| .epub           | application/epub+zip                                   | E-books     |
| .xlsx           | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Spreadsheets |
| .ods            | application/x-vnd.oasis.opendocument.spreadsheet        | Spreadsheets |
| .csv            | text/csv                                                | Spreadsheets |
| .tsv            | text/tab-separated-values                              | Spreadsheets |
| .pptx           | application/vnd.openxmlformats-officedocument.presentationml.presentation | Presentations |
| .odp            | application/vnd.oasis.opendocument.presentation        | Presentations |
| .jpg            | image/jpeg                                              | Images      |
| .jpeg           | image/jpeg                                              | Images      |
| .png            | image/png                                               | Images      |
| .webp           | image/webp                                              | Images      |
| .svg            | image/svg+xml                                           | Images      |
| .json           | application/json                                        | Data        |
| .gif            | image/gif                                               | Images      |
| .avi            | video/x-msvideo                                         | Videos      |
| .mp4            | video/mp4                                               | Videos      |
| .mp3            | audio/mpeg                                              | Audios      |

### Usage

* If files or folders from the "uploads" folder have doubles somewhere on Google Drive, they wouldn't be saved

* If you delete files in Media Library, you also should manually delete this files(all versions) on Google Drive

* To completely delete files in the "uploads" folder folder, please, restart strapi

### Contributing
Feel free to contribute to the development of this plugin.
If you have any questions, comments, or suggestions for improving the plugin, feel free to reach out to developer via email:

- Email: [2dl0gical@gmail.com](mailto:2dl0gical@gmail.com) 

### Support the Project
If you appreciate this project and would like to support the developer, you can make a donation through the following [link](https://www.paypal.com/donate/?hosted_button_id=STC2SUX6JZHMA).

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.

### Disclaimer
The author of this project disclaims any liability for any damages, direct or indirect, arising from the use of this plugin.



