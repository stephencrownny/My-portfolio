const express = require('express');
const router = express.Router();

// Render Contact Page
router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

module.exports = router;
