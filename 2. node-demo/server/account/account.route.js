const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const accountCtrl = require('./account.controller');
const passport = require('passport');
const authChecker = require('../../util/authChecker');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/register')
  .post(validate(paramValidation.register), accountCtrl.register);

router.route('/register-admin')
  .post(accountCtrl.registerAdmin);

router.route('/login')
  .post(
    validate(paramValidation.login),
    passport.authenticate('local', { failureFlash: true }),
    accountCtrl.login
  );

router.route('/logout').post(accountCtrl.logout);

router.route('/').get(authChecker, accountCtrl.query);

router.route('/update').put(authChecker, accountCtrl.update);

router.route('/current').get(authChecker, accountCtrl.getCurrentUser);

router.route('/current/password').put(authChecker, accountCtrl.updatePassword);

router.route('/orgInfo').get(accountCtrl.getOrgInfo);

module.exports = router;
