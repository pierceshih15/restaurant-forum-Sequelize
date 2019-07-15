const express = require('express');
const router = express.Router();

const restController = require('../controllers/restController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})

const passport = require('../config/passport');

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
    // 若無管理員權限，則導回前台餐廳頁面，避免管理員需要將自己設為一般用戶時，頁面會跳錯
    return res.redirect('/restaurants');
  }
  res.redirect('/signin');
}

// ------------------------帳號功能-------------------------------- // 

// 1-1. 使用者註冊頁面
router.get('/signup', userController.signUpPage);

// 1-2. 使用者註冊動作
router.post('/signup', userController.signUp);

// 1-3. 使用者登入頁面
router.get('/signin', userController.signInPage);

// 1-4. 使用者登入動作
router.post('/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn
);

// 1-5. 使用者登出
router.get('/logout', userController.logout);

// ------------------------後台功能-------------------------------- // 

// 2-1 後台功能（餐廳） //
// 2-1-1. 後台頁面 - 首頁
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));

// 2-1-2. 後台頁面 - 瀏覽所有餐廳資料
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);

// 2-1-3. 後台頁面 - 新增餐廳頁面
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);

// 2-1-4. 後台頁面 - 新增餐廳動作
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);

// 2-1-5. 後台頁面 - 瀏覽單一間餐廳資料
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant);

// 2-1-6. 後台頁面 - 編輯單一間餐廳資料
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant);

// 2-1-7. 後台頁面 - 更新單一間餐廳資料
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);

// 2-1-8. 後台頁面 - 刪除單一間餐廳資料
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant);

// 2-2 後台功能（使用者） //

// 2-2-1. 後台頁面 - 瀏覽所有使用者資料
router.get('/admin/users', authenticatedAdmin, userController.editUsers);

// 2-2-2. 後台頁面 - 管理員權限設定
router.put('/admin/users/:id', authenticatedAdmin, userController.putUsers);

// 2-3. 後台功能（分類） //

// 2-3-1. 後台頁面 - 管理分類頁面
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);

// 2-3-2. 後台頁面 - 新增分類
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);

// 2-3-3. 後台頁面 - 管理單一分類頁面
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories);

// 2-3-4. 後台頁面 - 編輯分類
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory);

// 2-3-5. 後台頁面 - 刪除分類
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory);

// ------------------------前台功能-------------------------------- //

// 3-1 前台功能（首頁） //

// 3-1-1. 前台頁面 - 首頁
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'));

// 3-1-2. 前台頁面 - 瀏覽所有餐廳
router.get('/restaurants', authenticated, restController.getRestaurants);

// 3-1-3. 前台頁面 - 瀏覽最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds);

// 3-1-4. 前台頁面 - 瀏覽美食達人的頁面
router.get('/users/top', authenticated, userController.getTopUser);

// 3-1-5. 前台頁面 - 瀏覽 Top10 人氣餐廳的頁面
router.get('/restaurants/top', authenticated, restController.getTopRestaurant);

// 3-2 前台功能（餐廳） //

// 3-2-1. 前台頁面 - 瀏覽單一間餐廳資料
router.get('/restaurants/:id', authenticated, restController.getRestaurant);

// 3-2-2. 前台頁面 - 瀏覽單一間餐廳的 Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard);

// 3-3 前台功能（使用者） //

// 3-3-1. 前台頁面 - 瀏覽使用者個人資料頁面
router.get('/users/:id', authenticated, userController.getUser);

// 3-3-2. 前台頁面 - 編輯使用者個人資料頁面
router.get('/users/:id/edit', authenticated, userController.editUser);

// 3-3-3. 前台頁面 - 更新使用者個人資料頁面
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser);

// 3-4 前台功能（評論） //

// 3-4-1. 前台頁面 - 使用者新增餐廳評論
router.post('/comments', authenticated, commentController.postComment);

// 3-4-2. 前台頁面 - 管理員刪除餐廳評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);

// 3-5 前台功能（最愛） //

// 3-5-1. 前台頁面 - 使用者新增餐廳至我的最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite);

// 3-5-2. 前台頁面 - 使用者從我的最愛移除餐廳
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite);

// 3-6 前台功能（按讚） //

// 3-6-1. 前台頁面 - 使用者為餐廳點讚
router.post('/like/:restaurantId', authenticated, userController.likeRestaurant);

// 3-6-2. 前台頁面 - 使用者從餐廳移除讚
router.delete('/like/:restaurantId', authenticated, userController.unlikeRestaurant);

// 3- 7 前台功能（追蹤） //

// 3-7-1. 前台頁面 - 使用者追蹤使用者
router.post('/following/:userId', authenticated, userController.addFollowing);

// 3-7-2. 前台頁面 - 使用者取消追蹤使用者
router.delete('/following/:userId', authenticated, userController.removeFollowing);

module.exports = router;