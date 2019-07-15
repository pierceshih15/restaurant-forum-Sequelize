const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const userService = require('../../services/userService.js')

// JWT
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let userController = {
  signIn: (req, res) => {
    // 1. 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: '欄位未填寫完成'
      })
    }

    // 2. 檢查 user 是否存在與密碼是否正確
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({
        where: {
          email: username
        }
      })
      .then(user => {
        // 1. 找不到用戶
        if (!user) return res.status(401).json({
          status: 'error',
          message: '找不到此用戶'
        })

        // 2. 密碼有錯
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: 'error',
            message: '密碼錯誤'
          })
        }

        // 3. 正確無誤，簽發 token
        var payload = {
          id: user.id
        };
        // 將資料轉為 JSON web token，前者參數為打包的資訊，後者為自訂的密鑰
        var token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        })
      })
  },

  // 註冊功能
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data);
    })
  }
}

module.exports = userController;