const db = require('../models');
const Restaurant = db.Restaurant;

// 宣告 adminController 物件變數，管理不同物件屬性（函式）
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', {
        restaurants: restaurants,
      });
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '餐廳名稱尚未填寫！');
      res.redirect('back');
    }
    return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description
      })
      .then(restaurant => {
        req.flash('success_messages', '餐廳已新增完成！')
        res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController;