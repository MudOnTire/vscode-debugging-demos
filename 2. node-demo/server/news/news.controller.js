const BaseController = require('../base/base.contoller');
const News = require('./news.model');

class NewsController extends BaseController {
  constructor(...props) {
    super(...props);
  }


  query(req, res, next) {
    super.query(req, res, next, {}, ['categoryId']);
  }

  findById(req, res, next) {
    super.findById(req, res, next, ['categoryId']);
  }
}

module.exports = new NewsController(News, 'title');
