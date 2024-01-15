const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create the Express app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Set up storage using Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const slug = req.body.slug;
        const ext = path.extname(file.originalname);
        const fullPath = path.join('uploads/', slug + ext);

        // Check if file already exists
        fs.access(fullPath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist, can save with this name
                cb(null, slug + ext);
            } else {
                // File exists, return an error
                req.fileValidationError = 'File already exists';
                cb(null, slug + ext);
            }
        });
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept videos only
        if (!file.originalname.match(/\.(mp4|jpg|jpeg|mp3)$/i)) {
            req.fileValidationError = 'Only MP4, JPEG, JPG and MP3 files are allowed!';
            return cb(new Error('Only MP4 files are allowed!'), false);
        }
        cb(null, true);
    }
});

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file || !req.body.slug) {
        return res.status(400).json({ success: false, message: 'No file or slug provided.' });
    }
    if (req.fileValidationError) {
        return res.status(400).json({ success: false, message: req.fileValidationError });
    }
    // Respond with success and the slug
    res.json({ success: true, slug: req.body.slug });

});

// Serve the video on the dynamic route base-url/<slug>
app.get('/:slug', (req, res) => {

    const slug = req.params.slug;
    const uploadsDir = path.join(__dirname, 'uploads');

    // Read the directory contents
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            // Handle error (e.g., directory not found)
            res.status(500).send('Server error.');
            return;
        }

        // Attempt to find a file that starts with the slug and has any extension
        const file = files.find(file => path.basename(file, path.extname(file)) === slug);

        if (!!file) {
            res.sendFile(path.join(__dirname, 'public', 'view.html'));
        } else {
            // No matching video file found
            res.status(404).send('Video not found.');
        }
    });
});

app.get('/check-video/:slug', (req, res) => {
    const slug = req.params.slug;
    const uploadsDir = path.join(__dirname, 'uploads');

    // Read the directory contents
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            // Handle error (e.g., directory not found)
            res.status(500).json({ error: 'Server error.' });
            return;
        }

        // Attempt to find a file that starts with the slug
        const contentFile = files.find(file => path.basename(file, path.extname(file)) === slug);

        res.json({ slugUsed: !!contentFile });
    });
});

app.get('/get-video/:slug', (req, res) => {
    const slug = req.params.slug;
    const uploadsDir = path.join(__dirname, 'uploads');

    // Read the directory contents
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            // Handle error (e.g., directory not found)
            res.status(500).json({ error: 'Server error.' });
            return;
        }

        // Attempt to find a file that starts with the slug
        const contentFile = files.find(file => path.basename(file, path.extname(file)) === slug);

        if (!!contentFile) {
            // Return the path to the content file
            res.json({ videoPath: `/uploads/${contentFile}` });
        } else {
            // No matching content file found
            res.status(404).json({ error: 'Video not found.' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

