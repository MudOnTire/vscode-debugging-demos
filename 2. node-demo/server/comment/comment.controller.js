const BaseController = require('../base/base.contoller');
const Comment = require('./comment.model');

class CommentController extends BaseController {
  constructor(...props) {
    super(...props);
  }
}

module.exports = new CommentController(Comment, 'content');
