const restController = require('../controllers/restController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', restController.getRestaurants);

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'));
  app.get('/admin/restaurants', adminController.getRestaurants);

  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);

  app.get('/signin', userController.signInPage);
  app.post('/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }), userController.signIn
  );
  app.get('/logout', userController.logout);
};