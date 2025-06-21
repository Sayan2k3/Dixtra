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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'text/html',
        },
        timeout: 5000,
      }),
      axios.get(rcURL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'text/html',
        },
        timeout: 5000,
      }),
    ]);

    const fema = cheerio.load(femaRes.data);
    const rc = cheerio.load(rcRes.data);

    const femaHeadlines = [];
    fema('.card__title a').each((i, el) => {
      if (i < 5) {
        femaHeadlines.push({
          title: fema(el).text().trim(),
          link: 'https://www.fema.gov' + fema(el).attr('href'),
        });
      }
    });

    const rcHeadlines = [];
    rc('.masonry-tile a').each((i, el) => {
      if (i < 5) {
        const href = rc(el).attr('href') || '';
        rcHeadlines.push({
          title: rc(el).text().trim(),
          link: href.startsWith('http') ? href : 'https://www.redcross.org' + href,
        });
      }
    });

    res.json({ fema: femaHeadlines, redCross: rcHeadlines });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Failed to scrape updates' });
  }
});

module.exports = router;
