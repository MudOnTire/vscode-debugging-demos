const favoriteCtrl = require('./favorite.controller');
const authChecker = require('../../util/authChecker');
const favoriteRouter = require('../base/base.route')(favoriteCtrl);

favoriteRouter.route('/mine/all')
  .get(authChecker, favoriteCtrl.getMine);

module.exports = favoriteRouter;
