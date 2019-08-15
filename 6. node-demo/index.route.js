const express = require('express');
const accountRoutes = require('./server/account/account.route');
const uploadRoutes = require('./server/upload/upload.route');
const newsRoutes = require('./server/news/news.route');
const newsCategoryRoutes = require('./server/newsCategory/newsCategory.route');
const favoriteRoutes = require('./server/favorite/favorite.route');
const commentRoutes = require('./server/comment/comment.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/accounts', accountRoutes);

router.use('/favorites', favoriteRoutes);

router.use('/comments', commentRoutes);

router.use('/news', newsRoutes);

router.use('/news-categories', newsCategoryRoutes);

router.use('/upload', uploadRoutes);

module.exports = router;