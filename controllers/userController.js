const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const Favorite = db.Favorite;
const Like = db.Like;
const Followship = db.Followship;
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
        include: [{
            model: Comment,
            include: Restaurant
          }, {
            model: Restaurant,
            as: 'FavoritedRestaurants'
          },
          {
            model: User,
            as: 'Followers'
          },
          {
            model: User,
            as: 'Followings'
          },
        ]
      })
      .then(user => {
        // 取得使用者頁面的追蹤狀態
        const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)

        // 取得使用者頁面的相關數字
        const commentNum = user.Comments.length;
        const commentRestaurantArray = user.Comments.map(comment => comment.Restaurant.name);
        const commentRestaurantNum = commentRestaurantArray.filter(findUnique).length;
        const followingsNum = user.Followings.length;
        const followersNum = user.Followers.length;
        const favoritedRestaurantsNum = user.FavoritedRestaurants.length;

        // 取得收藏的餐廳
        const favoritedRestaurantsData = user.FavoritedRestaurants;

        // 篩選出評論中不重複的餐廳
        const restaurantData = user.Comments.map(comment => comment.Restaurant);
        // 透過 reduce 傳入 accumulator 和 currentValue 使用
        const filteredRestaurant = restaurantData.reduce((accumulator, currentValue) => {
          // 透過 find 比較 accumulator 和 currentValue 兩者 id 是否相同
          const x = accumulator.find(item => item.id === currentValue.id);
          // 若不相同，則 X 為 undefined，將 currentValue 以 concat 語法加入 accumulator
          if (!x) {
            return accumulator.concat([currentValue]);
          } else {
            // 反之，若 X 成立，則回傳 accumulator
            return accumulator;
          }
        }, []);

        return res.render('users/profile', {
          // 傳入 profile 以供瀏覽器畫面更新，同時，不更動使用者的帳號
          profile: user,
          commentNum: commentNum,
          commentRestaurantNum: commentRestaurantNum,
          favoritedRestaurantsNum: favoritedRestaurantsNum,
          favoritedRestaurantsData: favoritedRestaurantsData,
          followingsNum: followingsNum,
          followersNum: followersNum,
          isFollowed: isFollowed,
          filteredRestaurant: filteredRestaurant,
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
  // 新增餐廳至我的最愛
  addFavorite: (req, res) => {
    return Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(restaurant => {
        return res.redirect('back');
      })
  },
  // 從我的最愛移除餐廳
  removeFavorite: (req, res) => {
    return Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(favorite => {
        favorite.destroy()
          .then(restaurant => {
            return res.redirect('back');
          })
      })
  },
  // 為餐廳點個讚
  likeRestaurant: (req, res) => {
    return Like.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(restaurant => {
        return res.redirect('back');
      })
  },
  // 為餐廳移除讚
  unlikeRestaurant: (req, res) => {
    return Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(like => {
        like.destroy()
          .then(restaurant => {
            return res.redirect('back');
          })
      })
  },
  getTopUser: (req, res) => {
    return User.findAll({
        include: [{
          model: User,
          as: 'Followers'
        }]
      })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        // 依照追蹤者人數排序（多 -> 少）
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
        return res.render('topUser', {
          users: users
        })
      })
  },
  addFollowing: (req, res) => {
    return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController;

function findUnique(value, index, self) {
  return self.indexOf(value) === index;
}