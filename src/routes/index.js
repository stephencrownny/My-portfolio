const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// Home Page Route
router.get('/', async (req, res, next) => {
  try {
    // Load gallery images
    const imagesDir = path.join(__dirname, '../../public/images');
    const files = await fs.readdir(imagesDir);
    const images = files.filter(
      (file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) &&
        file !== 'profile.jpg' &&
        !file.endsWith('.backup')
    );

    // Load expertise data
    const expertiseDataPath = path.join(__dirname, '../../data/expertise.json');
    const expertiseData = await fs.readFile(expertiseDataPath, 'utf-8');
    const { expertise } = JSON.parse(expertiseData);

    res.render('index', { title: 'Portfolio', images, expertise });
  } catch (err) {
    logger.error('Error loading home page', { error: err.message, stack: err.stack });
    next(err);
  }
});

module.exports = router;
