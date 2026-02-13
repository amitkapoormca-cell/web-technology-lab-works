let selectedFolder = null;
let selectedFiles = [];

// API base URL - use relative path in production so requests go to the same origin
// When developing locally with separate server port, set to 'http://localhost:3000/api'
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFolders();
    setupUploadArea();
});

// Load and display folders
async function loadFolders() {
    try {
        const response = await fetch(`${API_BASE}/folders`);
        const data = await response.json();
        displayFolders(data.folders || []);
    } catch (error) {
        console.error('Error loading folders:', error);
        showFeedback('foldersList', 'Error loading folders', 'error');
    }
}

// Display folders in grid
function displayFolders(folders) {
    const foldersList = document.getElementById('foldersList');
    
    if (folders.length === 0) {
        foldersList.innerHTML = '<p class="loading">No folders yet. Create one to get started!</p>';
        return;
    }

    foldersList.innerHTML = folders.map(folder => `
        <div class="folder-card" onclick="selectFolder('${folder}')">
            <div class="folder-icon">📁</div>
            <div class="folder-name">${escapeHtml(folder)}</div>
            <div class="folder-info">Click to view contents</div>
        </div>
    `).join('');
}

// Create new folder
async function createFolder() {
    const folderNameInput = document.getElementById('folderNameInput');
    const folderName = folderNameInput.value.trim();

    if (!folderName) {
        showFeedback('createFeedback', 'Please enter a folder name', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/folders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName })
        });

        const data = await response.json();

        if (response.ok) {
            showFeedback('createFeedback', `Folder "${folderName}" created successfully!`, 'success');
            folderNameInput.value = '';
            loadFolders();
        } else {
            showFeedback('createFeedback', data.error || 'Error creating folder', 'error');
        }
    } catch (error) {
        console.error('Error creating folder:', error);
        showFeedback('createFeedback', 'Error creating folder', 'error');
    }
}

// Select folder to view/upload files
async function selectFolder(folderName) {
    selectedFolder = folderName;
    selectedFiles = [];

    // Hide folders list and show upload/contents sections
    document.querySelector('.folders-grid').parentElement.style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('contentsSection').style.display = 'block';

    document.getElementById('uploadTitle').textContent = `Upload Files to: ${escapeHtml(folderName)}`;
    document.getElementById('contentsTitle').textContent = `Contents: ${escapeHtml(folderName)}`;

    loadFolderContents(folderName);
}

// Go back to folders list
function goBackToFolders() {
    selectedFolder = null;
    selectedFiles = [];

    document.querySelector('.folders-grid').parentElement.style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('contentsSection').style.display = 'none';

    document.getElementById('fileInput').value = '';
    document.getElementById('uploadFeedback').classList.remove('show');
}

// Load folder contents
async function loadFolderContents(folderName) {
    try {
        const response = await fetch(`${API_BASE}/folders/${encodeURIComponent(folderName)}/files`);
        const data = await response.json();
        displayFiles(data.files || []);
    } catch (error) {
        console.error('Error loading folder contents:', error);
        showFeedback('filesList', 'Error loading folder contents', 'error');
    }
}

// Display files
function displayFiles(files) {
    const filesList = document.getElementById('filesList');

    if (files.length === 0) {
        filesList.innerHTML = '<p class="loading">No files in this folder yet</p>';
        return;
    }

    filesList.innerHTML = `
        <div>
            ${files.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <div class="file-icon">📄</div>
                        <div class="file-details">
                            <div class="file-name">${escapeHtml(file)}</div>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button onclick="downloadFile('${escapeHtml(file)}')" class="btn btn-success">Download</button>
                        <button onclick="deleteFile('${escapeHtml(file)}')" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Setup drag and drop for upload area
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        selectedFiles = Array.from(files);
        updateFileInput();
    });

    fileInput.addEventListener('change', (e) => {
        selectedFiles = Array.from(e.target.files);
        updateFileInput();
    });
}

// Update file input display
function updateFileInput() {
    const uploadArea = document.getElementById('uploadArea');
    if (selectedFiles.length > 0) {
        uploadArea.innerHTML = `
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p>${selectedFiles.length} file(s) selected</p>
        `;
    }
}

// Upload files
async function uploadFiles() {
    if (!selectedFolder) {
        showFeedback('uploadFeedback', 'Please select a folder first', 'error');
        return;
    }

    if (selectedFiles.length === 0) {
        showFeedback('uploadFeedback', 'Please select files to upload', 'error');
        return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('files', file);
    });
    formData.append('folderName', selectedFolder);

    try {
        const response = await fetch(
            `${API_BASE}/folders/${encodeURIComponent(selectedFolder)}/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {
            showFeedback('uploadFeedback', data.message, 'success');
            selectedFiles = [];
            document.getElementById('fileInput').value = '';
            document.getElementById('uploadArea').innerHTML = `
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p>Drag files here or click to upload</p>
            `;
            loadFolderContents(selectedFolder);
        } else {
            showFeedback('uploadFeedback', data.error || 'Error uploading files', 'error');
        }
    } catch (error) {
        console.error('Error uploading files:', error);
        showFeedback('uploadFeedback', 'Error uploading files', 'error');
    }
}

// Download file
function downloadFile(fileName) {
    if (!selectedFolder) return;
    
    const url = `${API_BASE}/folders/${encodeURIComponent(selectedFolder)}/files/${encodeURIComponent(fileName)}/download`;
    window.location.href = url;
}

// Download folder as ZIP
function downloadFolder() {
    if (!selectedFolder) return;
    
    const url = `${API_BASE}/folders/${encodeURIComponent(selectedFolder)}/download`;
    window.location.href = url;
}

// Delete file
async function deleteFile(fileName) {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
        return;
    }

    if (!selectedFolder) return;

    try {
        const response = await fetch(
            `${API_BASE}/folders/${encodeURIComponent(selectedFolder)}/files/${encodeURIComponent(fileName)}`,
            { method: 'DELETE' }
        );

        const data = await response.json();

        if (response.ok) {
            showFeedback('uploadFeedback', 'File deleted successfully', 'success');
            loadFolderContents(selectedFolder);
        } else {
            showFeedback('uploadFeedback', data.error || 'Error deleting file', 'error');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        showFeedback('uploadFeedback', 'Error deleting file', 'error');
    }
}

// Delete folder
async function deleteFolder() {
    if (!confirm(`Are you sure you want to delete the folder "${selectedFolder}" and all its contents?`)) {
        return;
    }

    if (!selectedFolder) return;

    try {
        const response = await fetch(
            `${API_BASE}/folders/${encodeURIComponent(selectedFolder)}`,
            { method: 'DELETE' }
        );

        const data = await response.json();

        if (response.ok) {
            alert('Folder deleted successfully');
            goBackToFolders();
            loadFolders();
        } else {
            showFeedback('uploadFeedback', data.error || 'Error deleting folder', 'error');
        }
    } catch (error) {
        console.error('Error deleting folder:', error);
        showFeedback('uploadFeedback', 'Error deleting folder', 'error');
    }
}

// Show feedback message
function showFeedback(elementId, message, type) {
    const feedbackElement = document.getElementById(elementId);
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback show ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            feedbackElement.classList.remove('show');
        }, 3000);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
