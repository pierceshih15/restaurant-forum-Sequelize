const db = require('../models');
const User = db.User;

const userService = {
  // 註冊
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不一致！');
      return res.redirect('/signup')
    } else {
      User.findOne({
          where: {
            email: req.body.email
          }
        })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱已被註冊使用！');
            return res.redirect('/signup');
          } else {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              })
              .then(user => {
                req.flash('success_messages', '帳號已成功註冊！');
                return res.redirect('/signin');
              })
          }
        })
    }
  },

  // 顯示使用者清單
  editUsers: (req, res, callback) => {
    User.findAll().then(users => {
      callback({
        users: users
      });
    })
  },

  // 更新使用者權限
  putUsers: (req, res, callback) => {
    return User.findByPk(req.params.id)
      .then(user => {
        const {
          isAdmin
        } = user;

        if (isAdmin) {
          user.update({
              isAdmin: 0
            })
            .then(user => {
              callback({
                status: 'success',
                message: '帳號已設定為一般用戶！'
              })
              // req.flash('success_messages', '帳號已設定為一般用戶！');
              // return res.redirect('/admin/users');
            })
        } else {
          user.update({
              isAdmin: 1
            })
            .then(user => {
              callback({
                status: 'success',
                message: '帳號已設定為管理員！'
              })
              // req.flash('success_messages', '帳號已設定為管理員！');
              // return res.redirect('/admin/users');
            })
        }
      })
  },
}

module.exports = userService;