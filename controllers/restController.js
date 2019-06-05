// 宣告 restController 物件變數，管理不同物件屬性（函式）
const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants');
  }
}

module.exports = restController;