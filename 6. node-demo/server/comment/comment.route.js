const commentCtrl = require('./comment.controller');
const authChecker = require('../../util/authChecker');
const commentRouter = require('../base/base.route')(commentCtrl);

commentRouter.route('/preview/query').get(commentCtrl.query)

module.exports = commentRouter;
