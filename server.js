const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.params.folderName || 'default';
    const uploadPath = path.join(uploadsDir, folderName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Routes

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get list of folders
app.get('/api/folders', (req, res) => {
  try {
    const folders = fs.readdirSync(uploadsDir).filter(file => {
      return fs.statSync(path.join(uploadsDir, file)).isDirectory();
    });
    res.json({ folders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get files in a folder
app.get('/api/folders/:folderName/files', (req, res) => {
  try {
    const folderPath = path.join(uploadsDir, req.params.folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const files = fs.readdirSync(folderPath).filter(file => {
      return fs.statSync(path.join(folderPath, file)).isFile();
    });

    res.json({ files, folderName: req.params.folderName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload files to a folder
app.post('/api/folders/:folderName/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    res.json({ 
      message: `${req.files.length} file(s) uploaded successfully`,
      files: req.files.map(f => f.originalname)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new folder
app.post('/api/folders', express.json(), (req, res) => {
  try {
    const { folderName } = req.body;
    
    if (!folderName || folderName.trim() === '') {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const folderPath = path.join(uploadsDir, folderName);
    
    if (fs.existsSync(folderPath)) {
      return res.status(400).json({ error: 'Folder already exists' });
    }

    fs.mkdirSync(folderPath, { recursive: true });
    res.json({ message: 'Folder created successfully', folderName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download folder as ZIP
app.get('/api/folders/:folderName/download', (req, res) => {
  try {
    const folderPath = path.join(uploadsDir, req.params.folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.attachment(`${req.params.folderName}.zip`);
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();

    archive.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download single file
app.get('/api/folders/:folderName/files/:fileName/download', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.folderName, req.params.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/api/folders/:folderName/files/:fileName', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.folderName, req.params.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete folder
app.delete('/api/folders/:folderName', (req, res) => {
  try {
    const folderPath = path.join(uploadsDir, req.params.folderName);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    fs.rmSync(folderPath, { recursive: true, force: true });
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Web Technology Lab Works server running at http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
