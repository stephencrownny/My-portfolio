const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');
const logger = require('../utils/logger');

// Render Contact Page
router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Contact Form Submission with Validation
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 10, max: 5000 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, message } = req.body;
    await sendContactEmail({ name, email, message });

    logger.info('Contact form submitted', { name, email });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    logger.error('Contact form error', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;
