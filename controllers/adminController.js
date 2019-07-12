const fs = require('fs')
const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

// 引入 adminService 資料
const adminService = require('../services/adminService.js')

// 宣告 adminController 物件變數，管理不同物件屬性（函式）
const adminController = {
  // 取得所有餐廳的資料
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // 建立新餐廳的頁面
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {
        categories: categories,
      });
    })
  },
  // 建立新餐廳的動作
  postRestaurant: (req, res) => {
    adminService.postRestaurant(res, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  // 取得單一餐廳的資料
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  // 編輯單一餐廳的資料
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          restaurant: restaurant,
          categories: categories,
        });
      })
    })
  },
  // 編輯單一餐廳的資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  // 刪除單一餐廳的資料
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  }
}

module.exports = adminController;