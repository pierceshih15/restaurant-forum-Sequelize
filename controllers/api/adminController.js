const db = require('../../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const adminController = {
  // 取得所有餐廳的資料
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Category]
    }).then(restaurants => {
      return res.json({
        restaurants: restaurants,
      });
    })
  },
}

module.exports = adminController;