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
}

module.exports = adminService;