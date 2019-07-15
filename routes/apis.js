const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/api/adminController.js');
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')


const passport = require('passport');
const authenticated = passport.authenticate('jwt', {
  session: false
})

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.json({
      status: 'error',
      message: 'permission denied'
    })
  } else {
    return res.json({
      status: 'error',
      message: 'permission denied'
    })
  }
}

// 登入
router.post('/signin', userController.signIn);

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants);
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant);
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant);
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant);
// 更新單一間餐廳資料
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant);

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories);
router.get('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.getCategories);
// 新增分類
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory);
// 編輯分類
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory);
// 刪除分類
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory);

module.exports = router;