const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

// GET /services - Main services page
router.get('/', async (req, res, next) => {
  try {
    const servicesDataPath = path.join(__dirname, '../../data/services.json');
    const servicesData = await fs.readFile(servicesDataPath, 'utf-8');
    const { services } = JSON.parse(servicesData);

    res.render('services', {
      title: 'Services',
      pageTitle: 'Services | King Stephen - Hazmat, AI/ML & Data Analysis',
      metaDescription: 'Professional services including Hazmat Operations consulting, AI/ML Engineering solutions, and Data Analysis. Expert services by Stephen Wanjiru.',
      canonicalUrl: 'https://kingstephen.com/services',
      ogTitle: 'Services | King Stephen - Hazmat, AI/ML & Data Analysis',
      ogImage: 'https://kingstephen.com/images/profile.jpg',
      breadcrumbs: [
        { name: 'Home', url: 'https://kingstephen.com/' },
        { name: 'Services', url: 'https://kingstephen.com/services' }
      ],
      services
    });
  } catch (err) {
    logger.error('Error loading services', {
      error: err.message,
      stack: err.stack
    });
    next(err);
  }
});

module.exports = router;
