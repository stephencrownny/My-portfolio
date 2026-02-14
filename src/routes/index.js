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

    res.render('index', {
      title: 'Portfolio',
      pageTitle: 'King Stephen | Fire Fighter & AI/ML Engineer',
      metaDescription: 'Stephen Wanjiru is a Fire Fighter and AI/ML Engineer specializing in Hazmat Operations, Machine Learning, and Data Analysis. Bridging physical safety with digital intelligence.',
      canonicalUrl: 'https://kingstephen.com/',
      ogTitle: 'King Stephen | Fire Fighter & AI/ML Engineer',
      ogImage: 'https://kingstephen.com/images/profile.jpg',
      breadcrumbs: [
        { name: 'Home', url: 'https://kingstephen.com/' }
      ],
      images,
      expertise
    });
  } catch (err) {
    logger.error('Error loading home page', { error: err.message, stack: err.stack });
    next(err);
  }
});

module.exports = router;
