const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll().then(categories => {
      // 若網址上有分類 id，代表取出特定分類，再行傳入使用，反之，只需要傳入全數的分類即可
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            callback({
              categories: categories,
              category: category,
            });
          })
      } else {
        callback({
          categories: categories,
        });
      }
    })
  },

  // 建立新分類的動作
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({
        status: 'error',
        message: "分類名稱尚未填寫"
      })
    } else {
      return Category.create({
          name: req.body.name,
        })
        .then(category => {
          callback({
            status: 'success',
            message: `分類 ${category.name} 新增成功`
          });
        })
        .catch(function (err) {
          callback({
            status: 'error',
            message: '分類新增失敗'
          });
        })
    }
  },

  // 修改分類
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({
        status: 'error',
        message: '分類名稱尚未填寫'
      })
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
            .then(category => {
              callback({
                status: 'success',
                message: `分類 ${category.name} 更新成功`
              });
            })
        })
    }
  },

  // 刪除分類
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) {
          callback({
            status: 'error',
            message: '刪除分類名稱不存在!'
          });
        } else {
          category.destroy()
            .then(category => {
              callback({
                status: 'success',
                message: `${category.name} 已成功刪除`
              })
            })
        }
      })
  }
}

module.exports = categoryService;