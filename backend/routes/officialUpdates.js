const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/official-updates', async (req, res) => {

  
  

  const femaURL = 'https://www.fema.gov/press-release';
  const rcURL = 'https://www.redcross.org/about-us/news-and-events.html';

  try {
    const [femaRes, rcRes] = await Promise.all([
      axios.get(femaURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36',
          Accept: 'text/html',
        },
      }),
      axios.get(rcURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36',
          Accept: 'text/html',
        },
      }),
    ]);

    const fema = cheerio.load(femaRes.data);
    const rc = cheerio.load(rcRes.data);

    const femaHeadlines = [];
    fema('.card__title a').each((i, el) => {
      if (i < 5) {
        const title = fema(el).text().trim();
        const link = 'https://www.fema.gov' + fema(el).attr('href');
        femaHeadlines.push({ title, link });
      }
    });

    const rcHeadlines = [];
    rc('.masonry-tile a').each((i, el) => {
      if (i < 5) {
        const title = rc(el).text().trim();
        const link = rc(el).attr('href').startsWith('http')
          ? rc(el).attr('href')
          : 'https://www.redcross.org' + rc(el).attr('href');
        rcHeadlines.push({ title, link });
      }
    });

    res.json({ fema: femaHeadlines, redCross: rcHeadlines });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Failed to scrape updates' });
  }
});

module.exports = router;
