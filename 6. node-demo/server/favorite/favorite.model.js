const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../base/base.model');

const Favorite = new Schema({
  ...BaseModel,
  course: { type: Schema.Types.ObjectId, ref: 'course' },
  news: { type: Schema.Types.ObjectId, ref: 'news' },
  post: { type: Schema.Types.ObjectId, ref: 'post' },
  type: {
    type: String,
    enum: ['course', 'news', 'post'],
    required: [true, '收藏类型不能为空']
  }
});

module.exports = mongoose.model('favorite', Favorite);