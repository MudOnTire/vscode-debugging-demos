const passport = require('passport');
const Account = require('./account.model');

function register(req, res, next) {
  const { username, code, password } = req.body;
  Account.register(new Account({ username, role: 'user' }), password)
    .then(() => {
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          req.result = {
            _id: req.user.id,
            username: req.user.username
          };
          next();
        });
      });
    })
    .catch(err => {
      err.isPublic = true;
      next(err);
    });
}

function registerAdmin(req, res, next) {
  const { username, password } = req.body;
  if (username !== 'admin') {
    const err = new Error('该用户名不能注册管理员');
    err.isPublic = true;
    next(err);
  }
  Account.register(new Account({ username, role: 'admin' }), password)
    .then(() => {
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          req.result = {
            _id: req.user.id,
            username: req.user.username
          };
          next();
        });
      });
    })
    .catch(err => {
      err.isPublic = true;
      next(err);
    });
}

function login(req, res, next) {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    req.result = req.user;
    next();
  });
}


function logout(req, res, next) {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    next();
  });
}

function query(req, res, next) {
  const params = {
    ...req.query
  };
  delete params.pageNum;
  delete params.pageSize;
  const pageNum = req.query.pageNum || 1;
  const pageSize = req.query.pageSize || 10;
  Account.find(params)
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .then((accounts) => {
      Account.count(params, (err, count) => {
        if (err) {
          next(err);
        } else {
          res.send({
            result: accounts,
            pagination: {
              pageNum,
              pageSize,
              total: count
            },
            query: params
          });
        }
      });
    })
    .catch(next);
}

function update(req, res, next) {
  Account.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
    .then(result => {
      req.result = result;
      next();
    })
    .catch(next);
}

/**
 * 修改密码
 */
function updatePassword(req, res, next) {
  Account.findOne({ _id: req.user._id })
    .then(user => {
      if (!user) {
        throw new Error('用户不存在！');
      }
      const { oldPassword, newPassword } = req.body;
      return user.changePassword(oldPassword, newPassword);
    })
    .then(result => {
      req.result = result;
      next();
    })
    .catch(err => {
      if (err.name === 'IncorrectPasswordError') {
        res.status(400).json({
          code: 'bad',
          message: '原密码不正确'
        });
      } else {
        next(err);
      }
    });
}

function getCurrentUser(req, res, next) {
  req.result = req.user;
  next();
}

function getOrgInfo(req, res, next) {
  Account.findOne({ role: 'admin' })
    .then(admin => {
      let orgInfo = {};
      if (admin) {
        const { phone, servicePhones, address } = admin;
        orgInfo = {
          phone,
          servicePhones,
          address
        }
      }
      req.result = orgInfo;
      next();
    })
    .catch(next);
}


module.exports = {
  register,
  registerAdmin,
  login,
  logout,
  query,
  update,
  getCurrentUser,
  updatePassword,
  getOrgInfo
};
