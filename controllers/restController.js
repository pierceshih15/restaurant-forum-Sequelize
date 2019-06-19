const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const User = db.User;
const Comment = db.Comment;
const Favorite = db.Favorite;

const pageLimit = 10;

// 宣告 restController 物件變數，管理不同物件屬性（函式）
const restController = {
  // 瀏覽所有餐廳的頁面
  getRestaurants: (req, res) => {

    let offset = 0;
    // 宣告 whereQuery - 這是要傳給 findAll 的參數，需要包裝成物件格式。
    let whereQuery = {};
    // 宣告 categoryId - 這是要放在 whereQuery 裡的內容，如果 request 有帶入特定的分類，就可以用 req.query.categoryId 取到分類 id，如果「全部餐廳」的情境，就會是空字串。
    let categoryId = '';

    // 若有分頁內容，則計算該顯示哪個區段的資料
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    // 透過 findAndCountAll 語法找出相對應的餐廳資料，以 result 呈現內容
    Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset: offset,
        limit: pageLimit
      })
      .then(result => {
        // Pagination Variables
        // page 代表所在頁面，預設為 1
        let page = Number(req.query.page) || 1;
        // 計算總共有幾頁
        let pages = Math.ceil(result.count / pageLimit);
        let totalPage = Array.from({
          length: pages
        }).map((item, index) => index + 1);
        let prev = page - 1 ? 1 : page - 1;
        let next = page + 1 ? pages : pages + 1;

        // 複製一份餐廳資料，存數變數 data 使用
        // 從 results 取出 rows 屬性的內容
        const data = result.rows.map(r => ({
          // 展開餐廳資料
          ...r.dataValues,
          // 複寫 description 內容
          description: r.dataValues.description.substring(0, 50),
          // 判斷該餐廳是否有被使用者收藏，若有則為 true，反之則為 false
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id),
        }))
        Category.findAll().then(categories => {
          return res.render('restaurants', {
            restaurants: data,
            categories: categories,
            categoryId: categoryId,
            page: page,
            pageLimit: pageLimit,
            totalPage: totalPage,
            prev: prev,
            next: next,
          });
        })
      })
  },
  // 瀏覽單一餐廳的頁面
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
        include: [Category, {
          model: User,
          as: 'FavoritedUsers'
        }, {
          model: User,
          as: 'LikeUsers'
        }, {
          model: Comment,
          include: [User]
        }]
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
        restaurant.increment('viewCounts', {
          by: 1
        }).then(restaurant => {
          return res.render('restaurant', {
            restaurant: restaurant,
            isFavorited: isFavorited,
            isLike: isLike
          });
        })
      })
  },
  // 瀏覽單一餐廳的 Dashboard
  getDashboard: (req, res) => {
    Restaurant.findByPk(req.params.id, {
        include: [Category, {
          model: Comment,
          include: [User]
        }]
      })
      .then(restaurant => {
        return res.render('dashboard', {
          restaurant: restaurant
        });
      })
  },
  // 取得最新的動態內容
  getFeeds: (req, res) => {
    Restaurant.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [Category],
      })
      .then(restaurants => {
        Comment.findAll({
            limit: 10,
            order: [
              ['createdAt', 'DESC']
            ],
            include: [User, Restaurant],
          })
          .then(comments => {
            return res.render('feeds', {
              restaurants: restaurants,
              comments: comments,
            })
          })
      })
  },
  getTopRestaurant: (req, res) => {
    Restaurant.findAll({
        include: [{
          model: User,
          as: 'FavoritedUsers'
        }]
      })
      .then(restaurants => {
        let responseData = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          FavoriteCount: restaurant.FavoritedUsers.length,
          isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        }))
        // 排除收藏數為 0 的餐廳
        let filteredData = responseData.filter(item => item.FavoriteCount > 0);
        // 依照追蹤者人數排序（多 -> 少）
        filteredData = filteredData.sort((a, b) => b.FavoriteCount - a.FavoriteCount);
        // 取出前 10 筆資料
        let topRestaurantData = filteredData.slice(0, 10);
        return res.render('topRestaurant', {
          restaurants: topRestaurantData
        })
      })
  },
}

module.exports = restController;