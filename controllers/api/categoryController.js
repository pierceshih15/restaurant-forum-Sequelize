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
    });
  },

  // 建立新分類的動作
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, data => {
      return res.json(data);
    });
  },

  // 修改分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      return res.json(data);
    });
  },

  // 刪除分類
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      return res.json(data);
    });
  },
}

module.exports = categoryController;