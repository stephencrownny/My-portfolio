const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Rate Limiting: Prevent DoS on resume download
const resumeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many resume download requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Route to download resume
router.get('/download', resumeLimiter, (req, res) => {
  // Static File Security: Ensure only the specific PDF is served
  // We explicitly define the path to the resume file to prevent directory traversal
  const resumePath = path.join(__dirname, '../../public/resume/resume.pdf');

  // Check if file exists
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'resume.pdf', (err) => {
        if (err) {
            console.error('Error downloading resume:', err);
            if (!res.headersSent) {
                res.status(500).send('Error downloading file');
            }
        }
    });
  } else {
    res.status(404).send('Resume not found');
  }
});

module.exports = router;
