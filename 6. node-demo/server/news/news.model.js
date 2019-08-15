const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../base/base.model');

const News = new Schema({
  ...BaseModel,
  title: String,
  subtitle: String,
  detail: String,
  listImg: String,
  categoryId: [{ type: Schema.Types.ObjectId, ref: 'news-category' }],
  watchCount: Number,
  enabled: Boolean
});

module.exports = mongoose.model('news', News);