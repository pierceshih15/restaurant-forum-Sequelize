const restController = require('../controllers/restController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');

const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);

  // 後台頁面
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
  app.get('/admin/users', authenticatedAdmin, userController.editUser);
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);

  // 管理員權限設定
  app.put('/admin/users/:id', authenticatedAdmin, userController.putUser);

  // 新增分類
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);

  // 新增餐廳
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);

  // 瀏覽單一間餐廳資料
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant);

  // 編輯單一間餐廳資料
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant);
  // 更新單一間餐廳資料
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);

  // 刪除單一間餐廳資料
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant);

  // 使用者註冊
  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);

  // 使用者登入
  app.get('/signin', userController.signInPage);
  app.post('/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }), userController.signIn
  );

  // 使用者登出
  app.get('/logout', userController.logout);
};