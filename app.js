const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const bodyParser = require('body-parser');
const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models');

const app = express()
const port = 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(bodyParser.urlencoded({
  extended: true
}));

// setup session and flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`The restaurantForum app listening on port ${port}!`)
})

require('./routes')(app);