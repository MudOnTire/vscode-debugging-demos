const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../base/base.model');

const Category = new Schema({
  ...BaseModel,
  parentId: String,
  title: {
    type: String,
    required: [true, '分类标题不能为空']
  },
  subtitle: String,
  order: Number,
  enabled: Boolean,
  showInHome: Boolean,
  logo: String,
  banner: String
});

module.exports = mongoose.model('news-category', Category);