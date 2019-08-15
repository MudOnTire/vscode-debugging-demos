const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
  username: String,
  password: String,
  alias: String,
  phone: {
    type: String,
    match: [/^[1-9][0-9]{10}$/, '{PATH} ({VALUE})不是合法的手机号']
  },
  servicePhones: Array,
  role: {
    type: String,
    enum: ['admin', 'user'],
  },
  address: {
    type: String,
  },
  avatar: String,
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  birthday: Date,
  introduction: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('account', Account);