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