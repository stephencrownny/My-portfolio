const express = require('express');
const router = express.Router();

// About Page Route
router.get('/', (req, res) => {
  res.render('about', { title: 'About Me' });
});

module.exports = router;
