const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');  // Import the database connection

// Set up Multer to handle file uploads in memory
const upload = multer();

// Define the route for rendering the main page
router.get('/', (req, res) => {
  db.query('SELECT Author, Filename FROM images', (err, files) => {
    if (err) {
      console.error('Error fetching files:', err);
      return res.render('index', { title: 'Welcome to CatCache', files: [] });
    }
    res.render('index', { title: 'Welcome to CatCache', files });
  });
});

// Define the route for handling file uploads
router.post('/upload', upload.single('file'), (req, res) => {
  const { author } = req.body;
  const file = req.file;

  if (!file || !author) {
    return res.status(400).send('File and author name are required.');
  }

  // Save the file data into the database
  const query = 'INSERT INTO images (Author, ImageData, Filename) VALUES (?, ?, ?)';
  db.query(query, [author, file.buffer, file.originalname], (err, result) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Failed to upload file.');
    }
    res.status(200).send('File uploaded successfully!');
  });
});

// New route to view raw image
router.get('/viewraw/images/:filename', (req, res) => {
  const { filename } = req.params;

  db.query('SELECT ImageData FROM images WHERE Filename = ?', [filename], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Image not found.');
    }

    const imageData = results[0].ImageData;
    res.set('Content-Type', 'image/jpeg');  // Assuming images are JPEG, adjust if necessary
    res.send(imageData);
  });
});

// New route to download the image
router.get('/download/images/:filename', (req, res) => {
  const { filename } = req.params;

  db.query('SELECT ImageData FROM images WHERE Filename = ?', [filename], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Image not found.');
    }

    const imageData = results[0].ImageData;
    res.set('Content-Disposition', `attachment; filename=${filename}`);
    res.set('Content-Type', 'application/octet-stream');
    res.send(imageData);
  });
});

// 404 - Not Found route
router.all('*', (req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

module.exports = router;
