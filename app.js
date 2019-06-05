const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models');
const app = express()
const port = 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎


app.listen(port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`The restaurantForum app listening on port ${port}!`)
})

require('./routes')(app);