const BaseController = require('../base/base.contoller');
const NewsCategory = require('./newsCategory.model');

class NewsCategoryController extends BaseController {
  constructor(...props) {
    super(...props);
    this.queryLevelOne = this.queryLevelOne.bind(this);
    this.queryLevelTwo = this.queryLevelTwo.bind(this);
  }

  queryLevelOne(req, res, next) {
    this.query(req, res, next, { parentId: { $exists: false } });
  }


  queryLevelTwo(req, res, next) {
    this.query(req, res, next, { parentId: { $exists: true } });
  }
}

module.exports = new NewsCategoryController(NewsCategory, 'title');
