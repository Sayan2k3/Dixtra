// backend/routes/socialRoutes.js
const express = require('express');
const router = express.Router();

const PRIORITY_KEYWORDS = ['urgent', 'sos', 'emergency', 'help', 'asap', 'immediately'];

function isPriority(postText) {
  return PRIORITY_KEYWORDS.some(keyword =>
    postText.toLowerCase().includes(keyword)
  );
}

// ✅ Fixed route: parameter comes first to avoid path-to-regexp crash
router.get('/:disasterId/social-media', (req, res) => {
  const mockSocialData = {
    '123': [
      {
        user: '@citizen42',
        post: '#help Water needed near 123',
        image_url: 'https://www.hopkinsmedicine.org/-/media/images/health/3_-wellness/womans-health/hurricanereliefistock481990146640.jpg?h=358&iar=0&mh=360&mw=520&w=520&hash=3798AFAE66D2F59A906A06CA36FAB30B'
      },
      {
        user: '@volunteer77',
        post: 'Offering food supplies in affected area 123',
        image_url: 'https://world.time.com/wp-content/uploads/sites/17/2011/09/aaaaindia-floods.jpg'
      },
      {
        user: '@rescue_team',
        post: 'Rescue operations ongoing in the west sector.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttN2WxdCESzNjX7PdkLUF8GHebMGf7nXulQ&s'
      },
      {
        user: '@medic_ngo',
        post: 'Medical camp set up in zone C for flood victims.',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Disaster_relief_camp_Bangladesh_2007.jpg/800px-Disaster_relief_camp_Bangladesh_2007.jpg'
      }
    ],
    '456': [
      {
        user: '@fire_alert',
        post: 'Forest fire approaching nearby village!',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/California_Wildfire_2020.jpg/800px-California_Wildfire_2020.jpg'
      },
      {
        user: '@citizen56',
        post: 'Evacuation in progress, need transport assistance.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttN2WxdCESzNjX7PdkLUF8GHebMGf7nXulQ&s'
      }
    ]
  };

  const { disasterId } = req.params;
  const posts = mockSocialData[disasterId];

  if (posts) {
    const enhanced = posts.map(p => ({
      ...p,
      priority: isPriority(p.post)
    }));
    res.json(enhanced);
  } else {
    res.status(404).json({ message: `No social media posts found for disaster ID: ${disasterId}` });
  }
});

module.exports = router;
