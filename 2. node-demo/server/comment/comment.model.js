const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../base/base.model');

const Comment = new Schema({
  ...BaseModel,
  targetId: String,
  targetType: {
    type: String,
    enum: ['course', 'news', 'comment', 'post']
  },
  content: String,
  supportCount: Number,
});

module.exports = mongoose.model('comment', Comment);