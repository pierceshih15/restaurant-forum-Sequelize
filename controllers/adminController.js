// 宣告 adminController 物件變數，管理不同物件屬性（函式）
const adminController = {
  getRestaurants: (req, res) => {
    return res.render('adminRestaurants');
  }
}

module.exports = adminController;