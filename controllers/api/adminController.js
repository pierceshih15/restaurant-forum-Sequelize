const db = require('../../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

// 引入 adminService 資料
const adminService = require('../../services/adminService.js')

const adminController = {
  // 取得所有餐廳的資料
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data);
    })
  },

  // 取得單一餐廳的資料
  getRestaurant: (req, res, callback) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data);
    })
  },

  // 建立新餐廳的動作
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      return res.json(data);
    })
  },

  // 編輯單一餐廳的資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      return res.json(data);
    })
  },

  // 刪除單一餐廳的資料
  deleteRestaurant: (req, res, callback) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json({
        status: 'success',
        message: ''
      });
    })
  }
}

module.exports = adminController;