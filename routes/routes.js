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

// 前台頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
router.get('/restaurants', authenticated, restController.getRestaurants);
// 瀏覽最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds);
// 瀏覽美食達人的頁面
router.get('/users/top', authenticated, userController.getTopUser);
// 瀏覽 Top10 人氣餐廳的頁面
router.get('/restaurants/top', authenticated, restController.getTopRestaurant);

// 瀏覽單一間餐廳資料
router.get('/restaurants/:id', authenticated, restController.getRestaurant);
// 瀏覽單一間餐廳的 Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard);

// 使用者新增餐廳評論
router.post('/comments', authenticated, commentController.postComment);
// 管理員刪除餐廳評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);

// 後台頁面
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
router.get('/admin/users', authenticatedAdmin, userController.editUsers);

// 管理員權限設定
router.put('/admin/users/:id', authenticatedAdmin, userController.putUsers);

// 管理分類頁面
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);
// 新增分類
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);
// 管理單一分類頁面
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories);
// 編輯分類
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory);
// 刪除分類
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory);

// 新增餐廳
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);

// 瀏覽單一間餐廳資料
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant);

// 編輯單一間餐廳資料
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant);
// 更新單一間餐廳資料
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);

// 刪除單一間餐廳資料
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant);

// 使用者註冊
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);

// 使用者登入
router.get('/signin', userController.signInPage);
router.post('/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn
);

// 使用者登出
router.get('/logout', userController.logout);

// 瀏覽使用者個人資料頁面
router.get('/users/:id', authenticated, userController.getUser);
// 編輯使用者個人資料頁面
router.get('/users/:id/edit', authenticated, userController.editUser);
// 更新使用者個人資料頁面
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser);


// 使用者新增餐廳至我的最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite);
// 使用者從我的最愛移除餐廳
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite);
// 使用者為餐廳點讚
router.post('/like/:restaurantId', authenticated, userController.likeRestaurant);
// 使用者從餐廳移除讚
router.delete('/like/:restaurantId', authenticated, userController.unlikeRestaurant);
// 使用者追蹤使用者
router.post('/following/:userId', authenticated, userController.addFollowing);
// 使用者取消追蹤使用者
router.delete('/following/:userId', authenticated, userController.removeFollowing);

module.exports = router;