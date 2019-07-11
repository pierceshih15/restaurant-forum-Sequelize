const db = require('../../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

// 引入 adminService 資料
const adminService = require('../../services/adminService.js')

const adminController = {
  // 取得所有餐廳的資料
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController;