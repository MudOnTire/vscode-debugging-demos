const newsCategoryCtrl = require('./newsCategory.controller');
const authChecker = require('../../util/authChecker');
const newsCategoryRouter = require('../base/base.route')(newsCategoryCtrl);

newsCategoryRouter.route('/level/one')
  .get(authChecker, newsCategoryCtrl.queryLevelOne);

newsCategoryRouter.route('/level/two')
  .get(authChecker, newsCategoryCtrl.queryLevelTwo);

module.exports = newsCategoryRouter;
