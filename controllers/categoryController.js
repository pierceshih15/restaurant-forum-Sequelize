const db = require('../models');
const Category = db.Category;

const categoryController = {
  // 瀏覽所有分類
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      return res.render('admin/categories', {
        categories: categories,
      });
    })
  },
  // 建立新分類的動作
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "分類型稱尚未填寫")
      return res.redirect('back')
    } else {
      return Category.create({
          name: req.body.name,
        })
        .then(category => {
          res.redirect('/admin/categories');
        })
    }
  }
}

module.exports = categoryController;