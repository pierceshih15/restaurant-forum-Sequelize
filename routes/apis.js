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

// ------------------------帳號功能-------------------------------- // 

// 1-1. 使用者註冊頁面
router.get('/signup', userController.signUpPage);

// 1-2. 使用者註冊動作
router.post('/signup', userController.signUp);

// 1-3. 使用者登入頁面
router.get('/signin', userController.signUpPage);

// 1-4. 使用者登入動作
router.post('/signin', userController.signIn);

// 1-5. 使用者登出

// ------------------------後台功能-------------------------------- // 

// 2-1 後台功能（餐廳） //
// 2-1-1. 後台頁面 - 首頁

// 2-1-2. 後台頁面 - 瀏覽所有餐廳資料
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants);

// 2-1-3. 後台頁面 - 新增餐廳頁面

// 2-1-4. 後台頁面 - 新增餐廳動作
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant);

// 2-1-5. 後台頁面 - 瀏覽單一間餐廳資料
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant);

// 2-1-6. 後台頁面 - 瀏覽單一間餐廳的編輯頁面
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant);

// 2-1-7. 後台頁面 - 更新單一間餐廳資料
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant);

// 2-1-8. 後台頁面 - 刪除單一間餐廳資料
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant);

// 2-2 後台功能（使用者） //

// 2-2-1. 後台頁面 - 瀏覽所有使用者資料
router.get('/admin/users', authenticatedAdmin, userController.editUsers);

// 2-2-2. 後台頁面 - 管理員權限設定
router.put('/admin/users/:id', authenticatedAdmin, userController.putUsers);

// 2-3. 後台功能（分類） //

// 2-3-1. 後台頁面 - 管理分類頁面
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories);

// 2-3-2. 後台頁面 - 新增分類
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory);

// 2-3-3. 後台頁面 - 管理單一分類頁面
router.get('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.getCategories);

// 2-3-4. 後台頁面 - 編輯分類
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory);

// 2-3-5. 後台頁面 - 刪除分類
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory);

// ------------------------前台功能-------------------------------- //

// 3-1 前台功能（首頁） //

// 3-1-1. 前台頁面 - 首頁

// 3-1-2. 前台頁面 - 瀏覽所有餐廳

// 3-1-3. 前台頁面 - 瀏覽最新動態

// 3-1-4. 前台頁面 - 瀏覽美食達人的頁面

// 3-1-5. 前台頁面 - 瀏覽 Top10 人氣餐廳的頁面


// 3-2 前台功能（餐廳） //

// 3-2-1. 前台頁面 - 瀏覽單一間餐廳資料

// 3-2-2. 前台頁面 - 瀏覽單一間餐廳的 Dashboard


// 3-3 前台功能（使用者） //

// 3-3-1. 前台頁面 - 瀏覽使用者個人資料頁面


// 3-3-2. 前台頁面 - 編輯使用者個人資料頁面


// 3-3-3. 前台頁面 - 更新使用者個人資料頁面


// 3-4 前台功能（評論） //

// 3-4-1. 前台頁面 - 使用者新增餐廳評論


// 3-4-2. 前台頁面 - 管理員刪除餐廳評論


// 3-5 前台功能（最愛） //

// 3-5-1. 前台頁面 - 使用者新增餐廳至我的最愛

// 3-5-2. 前台頁面 - 使用者從我的最愛移除餐廳


// 3-6 前台功能（按讚） //

// 3-6-1. 前台頁面 - 使用者為餐廳點讚

// 3-6-2. 前台頁面 - 使用者從餐廳移除讚

// 3- 7 前台功能（追蹤） //

// 3-7-1. 前台頁面 - 使用者追蹤使用者

// 3-7-2. 前台頁面 - 使用者取消追蹤使用者

module.exports = router;