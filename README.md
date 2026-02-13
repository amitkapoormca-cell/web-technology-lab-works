# Web Technology Lab Works

A modern web application for students to upload, organize, and download laboratory folders with files.

## Features

- 📁 **Create Folders** - Organize your lab work by creating named folders
- 📤 **Upload Files** - Upload multiple files to folders with drag-and-drop support
- 📥 **Download Files** - Download individual files from your folders
- 📦 **Download Folders as ZIP** - Download entire folders as compressed ZIP files
- 🗑️ **Delete Files & Folders** - Manage your storage by removing unwanted items
- 🎨 **Modern UI** - Clean, responsive design that works on desktop and mobile devices

## Requirements

- Node.js (v12 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
```bash
cd "p:\PIET\Web Technology\Student"
```

2. Install dependencies:
```bash
npm install
```

This will install:
- `express` - Web framework
- `multer` - File upload handling
- `archiver` - ZIP file creation
- `cors` - Cross-origin resource sharing

## Running the Application

Start the server:
```bash
npm start
```

The application will start on `http://localhost:3000`

Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

### Creating a Folder
1. Enter a folder name in the "Create New Folder" section
2. Click "Create Folder"
3. The folder will appear in your folders list

### Uploading Files
1. Click on a folder to open it
2. Drag and drop files into the upload area, or click to select files
3. Click "Upload Selected Files"
4. Files will be added to the folder

### Downloading Files
1. Open a folder to see its contents
2. Click "Download" next to any file to download it individually
3. Or click "Download Folder as ZIP" to download all files in the folder

### Deleting Items
1. To delete a file: Open a folder, click "Delete" next to the file
2. To delete a folder: Open the folder, click "Delete Folder" (this deletes all contents)

## Project Structure

```
├── server.js                 # Express server and API routes
├── package.json              # Project dependencies
├── public/
│   ├── index.html           # Main HTML page
│   ├── styles.css           # CSS styling
│   └── script.js            # JavaScript functionality
├── uploads/                 # Folder storage (created automatically)
└── README.md                # This file
```

## API Endpoints

### Folders
- `GET /api/folders` - List all folders
- `POST /api/folders` - Create a new folder
- `DELETE /api/folders/:folderName` - Delete a folder

### Files
- `GET /api/folders/:folderName/files` - List files in a folder
- `POST /api/folders/:folderName/upload` - Upload files
- `GET /api/folders/:folderName/files/:fileName/download` - Download a file
- `DELETE /api/folders/:folderName/files/:fileName` - Delete a file

### Downloads
- `GET /api/folders/:folderName/download` - Download folder as ZIP

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Detail

### Drag and Drop Upload
Simply drag files from your computer into the upload area to start uploading.

### Responsive Design
The application works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

### File Organization
Organize your lab work into folders for easy management and access.

### Secure Downloads
All downloads are served directly from the server without exposing file paths.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify the `PORT` variable in `server.js` to a different port.

### File Upload Issues
- Ensure the `uploads` directory has write permissions
- Check that your files aren't too large
- Verify your internet connection

### Folder Not Appearing
- Refresh the page
- Check that the folder name doesn't contain special characters

## Notes

- Uploaded files are stored in the `uploads` directory
- The application does not persist data across server restarts (all uploads are in the local filesystem)
- File size limits can be configured in the multer configuration

## Future Enhancements

- User authentication and accounts
- File size limits and quotas
- Advanced file preview capabilities
- Search and filter functionality
- Sharing and collaboration features

## License

MIT License

## Support

For issues or questions, please check the code comments or refer to the API endpoints documentation.

---

**Created for Web Technology Lab Works** - A student-friendly file management system
