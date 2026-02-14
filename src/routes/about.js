const express = require('express');
const router = express.Router();

// About Page Route
router.get('/', (req, res) => {
  res.render('about', {
    title: 'About Me',
    pageTitle: 'About King Stephen | Fire Fighter & AI/ML Engineer',
    metaDescription: 'Learn about Stephen Wanjiru - a dedicated Fire Fighter with expertise in Hazmat Operations, combined with skills in AI/ML Engineering and Data Analysis.',
    canonicalUrl: 'https://kingstephen.com/about',
    ogTitle: 'About King Stephen | Fire Fighter & AI/ML Engineer',
    ogImage: 'https://kingstephen.com/images/profile.jpg',
    breadcrumbs: [
      { name: 'Home', url: 'https://kingstephen.com/' },
      { name: 'About', url: 'https://kingstephen.com/about' }
    ]
  });
});

module.exports = router;
