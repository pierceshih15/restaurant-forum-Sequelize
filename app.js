const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport.js');
const methodOverride = require('method-override')
const db = require('./models');

const app = express();
const port = 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use('/upload', express.static(__dirname + '/upload'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user;
  next()
})

app.listen(process.env.PORT || port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`The restaurantForum app listening on port ${port}!`);
})

require('./routes')(app);