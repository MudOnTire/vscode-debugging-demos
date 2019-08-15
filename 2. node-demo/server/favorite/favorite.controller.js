const BaseController = require('../base/base.contoller');
const Favorite = require('./favorite.model');

class FavoriteController extends BaseController {
  constructor(...props) {
    super(...props);
    this.getMine = this.getMine.bind(this);
  }

  getMine(req, res, next) {
    this.query(req, res, next, { fromUser: req.user._id }, ['course', 'news', 'post']);
  }
}

module.exports = new FavoriteController(Favorite);
