const db = require('../models');
const Category = db.Category;

const categoryController = {
  // 瀏覽所有分類
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      // 若網址上有分類 id，代表取出特定分類，再行傳入使用，反之，只需要傳入全數的分類即可
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              categories: categories,
              category: category,
            });
          })
      } else {
        return res.render('admin/categories', {
          categories: categories,
        });
      }
    })
  },
  // 建立新分類的動作
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "分類名稱尚未填寫")
      return res.redirect('back')
    } else {
      return Category.create({
          name: req.body.name,
        })
        .then(category => {
          res.redirect('/admin/categories');
        })
    }
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