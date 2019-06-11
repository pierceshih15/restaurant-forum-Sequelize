const db = require('../models');
const Comment = db.Comment;

const commentController = {
  // 新增評論的動作
  postComment: (req, res) => {
    return Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      .then(restaurant => {
        res.redirect(`/restaurants/${req.body.restaurantId}`);
      })
  }
}

module.exports = commentController;