const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/adminController.js');
const categoryController = require('../controllers/api/categoryController.js')

router.get('/admin/restaurants', adminController.getRestaurants);
router.get('/admin/restaurants/:id', adminController.getRestaurant);
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant);
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant);

router.get('/admin/categories', categoryController.getCategories);
router.get('/admin/categories/:id', categoryController.getCategories);

module.exports = router;