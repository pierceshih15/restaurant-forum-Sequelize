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
  }
}

module.exports = userService;