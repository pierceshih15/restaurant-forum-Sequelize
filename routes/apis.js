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
// 更新單一間餐廳資料
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant);

router.get('/admin/categories', categoryController.getCategories);
router.get('/admin/categories/:id', categoryController.getCategories);
// 新增分類
router.post('/admin/categories', categoryController.postCategory);
// 編輯分類
router.put('/admin/categories/:id', categoryController.putCategory);
// 刪除分類
router.delete('/admin/categories/:id', categoryController.deleteCategory);

module.exports = router;