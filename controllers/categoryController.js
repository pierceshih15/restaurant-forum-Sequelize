const db = require('../models');
const Category = db.Category;

const categoryService = require('../services/categoryService.js')

const categoryController = {
  // 瀏覽所有分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/restaurants', {
        data
      })
    })
  },
  // 建立新分類的動作
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  // 修改分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  // 刪除分類
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController;