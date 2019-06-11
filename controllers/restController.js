const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

// 宣告 restController 物件變數，管理不同物件屬性（函式）
const restController = {
  // 瀏覽所有餐廳的頁面
  getRestaurants: (req, res) => {
    // 宣告 whereQuery - 這是要傳給 findAll 的參數，需要包裝成物件格式。
    let whereQuery = {};
    // 宣告 categoryId - 這是要放在 whereQuery 裡的內容，如果 request 有帶入特定的分類，就可以用 req.query.categoryId 取到分類 id，如果「全部餐廳」的情境，就會是空字串。
    let categoryId = '';
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }

    console.log('here', req.query.categoryId);

    Restaurant.findAll({
        include: Category,
        where: whereQuery
      })
      .then(restaurants => {
        // 複製一份餐廳資料，存數變數 data 使用
        const data = restaurants.map(r => ({
          // 展開餐廳資料
          ...r.dataValues,
          // 複寫 description 內容
          description: r.dataValues.description.substring(0, 50)
        }))
        Category.findAll().then(categories => {
          return res.render('restaurants', {
            restaurants: data,
            categories: categories,
            categoryId: categoryId,
          });
        })
      })
  },
  // 瀏覽單一餐廳的頁面
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
        include: [category]
      })
      .then(restaurant => {
        return res.render('restaurant', {
          restaurant: restaurant
        });
      })
  },
}

module.exports = restController;