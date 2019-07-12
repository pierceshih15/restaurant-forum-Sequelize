const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const adminService = {
  // 取得所有餐廳的資料
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: [Category]
    }).then(restaurants => {
      callback({
        restaurants: restaurants,
      });
    })
  },

  // 取得單一餐廳的資料
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
        include: [Category]
      })
      .then(restaurant => {
        callback({
          restaurant: restaurant,
        });
      })
  },

  // 建立新餐廳的動作
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({
        status: 'error',
        message: "name didn't exist"
      })
    }

    const {
      file
    } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          })
          .then((restaurant) => {
            callback({
              status: 'success',
              message: '餐廳已新增'
            })
          })
      })
    } else {
      return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
        .then((restaurant) => {
          callback({
            status: 'success',
            message: '餐廳已新增'
          })
        })
    }
  },
  // 編輯單一餐廳的資料
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({
        status: 'error',
        message: "餐廳名稱尚未填寫"
      })
    }

    const {
      file
    } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? img.data.link : restaurant.image,
                CategoryId: req.body.categoryId
              })
              .then((restaurant) => {
                callback({
                  status: 'success',
                  message: '餐廳已新增'
                })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              callback({
                status: 'success',
                message: '餐廳已新增'
              })
            })
        })
    }
  },

  // 刪除單一餐廳的資料
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            callback({
              status: 'success',
              message: ''
            })
          })
      })
  }
}

module.exports = adminService;