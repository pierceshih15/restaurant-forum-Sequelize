const db = require('../models');
const Restaurant = db.Restaurant;

// 宣告 adminController 物件變數，管理不同物件屬性（函式）
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', {
        restaurants: restaurants,
      });
    })
  }
}

module.exports = adminController;