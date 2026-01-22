const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

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
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, process the data (e.g., send email)
  // For now, just return success
  res.json({ message: 'Contact form submitted successfully', data: req.body });
});

module.exports = router;
