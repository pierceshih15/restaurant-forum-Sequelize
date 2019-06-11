const db = require('../models');
const Restaurant = db.Restaurant;
const category = db.Category;

// 宣告 restController 物件變數，管理不同物件屬性（函式）
const restController = {
  // 瀏覽所有餐廳的頁面
  getRestaurants: (req, res) => {
    Restaurant.findAll({
        include: [category]
      })
      .then(restaurant => {
        // 複製一份餐廳資料，存數變數 data 使用
        const data = restaurant.map(r => ({
          // 展開餐廳資料
          ...r.dataValues,
          // 複寫 description 內容
          description: r.dataValues.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data
        });
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