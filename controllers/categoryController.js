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
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "分類名稱尚未填寫")
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
            .then(category => {
              res.redirect('/admin/categories');
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => {
            res.redirect('/admin/categories');
          })
      })
  }
}

module.exports = categoryController;