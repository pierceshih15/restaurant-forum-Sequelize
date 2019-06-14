const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },
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
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },
  // 顯示使用者清單
  editUsers: (req, res) => {
    User.findAll().then(users => {
      return res.render('admin/users', {
        users: users,
      });
    })
  },
  // 更新使用者權限
  putUsers: (req, res) => {
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
              req.flash('success_messages', '帳號已設定為一般用戶！');
              return res.redirect('/admin/users');
            })
        } else {
          user.update({
              isAdmin: 1
            })
            .then(user => {
              req.flash('success_messages', '帳號已設定為管理員！');
              return res.redirect('/admin/users');
            })
        }
      })
  },
  // 瀏覽使用者個人頁面
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
        include: {
          model: Comment,
          include: Restaurant
        }
      })
      .then(user => {
        const commentNum = user.Comments.length;
        const commentRestaurantArray = user.Comments.map(comment => comment.Restaurant.name);
        const commentRestaurantNum = commentRestaurantArray.filter(findUnique).length;
        return res.render('users/profile', {
          // 傳入 profile 以供瀏覽器畫面更新，同時，不更動使用者的帳號
          profile: user,
          commentNum: commentNum,
          commentRestaurantNum: commentRestaurantNum,
        });
      })
  },
  // 編輯使用者個人資料頁面
  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      return res.render('users/editProfile', {
        user: user,
      });
    })
  },
  // 更新使用者個人資料
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.redirect(`/users/${req.params.id}`)
    }
    const {
      file
    } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
            .then((user) => {
              req.flash('success_messages', '個人資料已更新完成')
              res.redirect(`/users/${req.params.id}`)
            })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            req.flash('success_messages', '個人資料已更新完成')
            res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  },
}

module.exports = userController;

function findUnique(value, index, self) {
  return self.indexOf(value) === index;
}