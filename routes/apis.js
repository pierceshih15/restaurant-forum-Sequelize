const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/adminController.js');
const categoryController = require('../controllers/api/categoryController.js')

router.get('/admin/restaurants', adminController.getRestaurants);
router.get('/admin/restaurants/:id', adminController.getRestaurant);
router.get('/admin/categories', categoryController.getCategories);
router.get('/admin/categories/:id', categoryController.getCategories);

module.exports = router;