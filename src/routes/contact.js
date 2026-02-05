const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');
const logger = require('../utils/logger');

// Render Contact Page
router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Input Validation: Sanitize and validate contact form inputs
// This ensures that future form inputs are clean and safe
router.post('/', [
  // Validate and sanitize name
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .escape(), // Sanitize: convert HTML special characters to their entity equivalents

  // Validate and sanitize email
  body('email')
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(), // Sanitize: normalize email address

  // Validate and sanitize message
  body('message')
    .trim()
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
    .escape(),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Send email with form data
  try {
    const { name, email, message } = req.body;

    await sendContactEmail({ name, email, message });

    logger.info('Contact form submitted', { name, email });

    res.json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
    });
  } catch (error) {
    logger.error('Contact form submission failed', {
      error: error.message,
      email: req.body.email,
    });

    // Check if it's a configuration error
    if (error.message === 'Email service not configured') {
      return res.status(503).json({
        success: false,
        message: 'Email service is temporarily unavailable. Please try again later or contact via social media.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;
