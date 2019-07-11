const db = require('../../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

// 引入 categoryService 資料
const categoryService = require('../../services/categoryService.js')

const categoryController = {
  // 取得所有餐廳的資料
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data);
    })
  },
}

module.exports = categoryController;