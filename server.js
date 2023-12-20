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
        // Use the slug as the filename, and append the original file extension
        const slug = req.body.slug;
        const ext = path.extname(file.originalname);
        cb(null, slug + ext);
    }
});

const upload = multer({ storage: storage });

// Handle video uploads on the POST /upload route
app.post('/upload', upload.single('video'), (req, res) => {
    // Check if the file and slug are present
    if (!req.file || !req.body.slug) {
        // Better error handling should be implemented here
        return res.status(400).json({ success: false, message: 'No file or slug provided.' });
    }

    // You might want to check if the slug already exists and handle accordingly

    // Respond with success and the slug
    res.json({ success: true, slug: req.body.slug });
});

// Serve the video on the dynamic route base-url/<slug>
app.get('/video/:slug', (req, res) => {
    const slug = req.params.slug;
    const filePath = path.join(__dirname, 'uploads', slug);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Serve the video file
        res.sendFile(filePath);
    } else {
        // Better error handling should be implemented here
        res.status(404).send('Video not found.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

