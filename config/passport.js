const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Restaurant = db.Restaurant;

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({
      where: {
        email: username
      }
    }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號尚未註冊使用'));

      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));

      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    // 取出使用者收藏的餐廳資料
    include: [{
      model: db.Restaurant,
      as: 'FavoritedRestaurants'
    }, {
      model: db.Restaurant,
      as: 'LikeRestaurants'
    }, {
      model: User,
      as: 'Followers'
    }, {
      model: User,
      as: 'Followings'
    }],
  }).then(user => {
    return cb(null, user)
  })
})

module.exports = passport;

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

require('dotenv').config();
let jwtOptions = {}
// 設定去哪裡找 token
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// 使用密鑰來檢查 token 是否經過纂改
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [{
        model: db.Restaurant,
        as: 'FavoritedRestaurants',
      },
      {
        model: db.Restaurant,
        as: 'LikedRestaurants'
      },
      {
        model: User,
        as: 'Followers'
      },
      {
        model: User,
        as: 'Followings'
      }
    ]
  }).then(user => {
    console.log(user);
    if (!user) return next(null, false);
    return next(null, user);
  })
})

passport.use(strategy)