const restController = require('../controllers/restController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

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
      return res.redirect('signin');
    }
    res.redirect('/signin');
  }

  // 前台頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);

  // 後台頁面
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
  // 新增餐廳
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
  app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant);

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