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
}

module.exports = categoryService;