# 皮皮餐廳論壇網

一個使用 Node.js + Express + MySQL 打造的餐廳論壇網站，提供使用者註冊個人帳號，不僅可以依照不同的分類來查看餐廳資料，也可以有相對應的評論、收藏功能。

此外，使用者之間也有互相追蹤的功能，互相查看彼此關注的餐廳和評論內容，創造網站內更多的互動行為。

[Demo Website](https://pipi-restaurant-forum-v1.herokuapp.com/signin)

歡迎使用測試帳號登入使用，帳密如下：

```
管理員
  帳號：root@example.com
  密碼：12345678
```

```
一般用戶
  帳號：user1@example.com
  密碼：12345678
```

## 專案畫面

![image](https://github.com/pierceshih15/restaurant-forum-Sequelize/blob/master/public/img/homePage.png)

![image](https://github.com/pierceshih15/restaurant-forum-Sequelize/blob/master/public/img/restaurantPage.png)

![image](https://github.com/pierceshih15/restaurant-forum-Sequelize/blob/master/public/img/userPage.png)

![image](https://github.com/pierceshih15/restaurant-forum-Sequelize/blob/master/public/img/adminPage.png)

## Features - 產品功能

#前台

1. 使用者可以註冊/登入/登出網站
2. 使用者可以在瀏覽所有餐廳與個別餐廳詳細資料
3. 在瀏覽所有餐廳資料時，可以用分類篩選餐廳
4. 使用者可以對餐廳留下評論
5. 使用者可以收藏餐廳
6. 使用者可以查看最新上架的 10 筆餐廳
7. 使用者可以查看最新的 10 筆評論
8. 使用者可以編輯自己的個人資料
9. 使用者可以查看自己評論過、收藏過的餐廳
10. 使用者可以追蹤其他的使用者
11. 使用者可以查看自己追蹤中的使用者與正在追蹤自己的使用者

#後台

1. 只有網站管理者可以登入網站後台
2. 網站管理者可以在後台管理餐廳的基本資料
3. 網站管理者可以在後台管理餐廳分類

## Environment SetUp - 環境建置

1. [Node.js](https://nodejs.org/en/)
2. [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Installing - 專案安裝流程

1. 打開你的 terminal，Clone 此專案至本機電腦

```
git clone https://github.com/pierceshih15/restaurant-forum-Sequelize
```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd restaurant-forum-Sequelize
```

3. 安裝 npm 套件

```
在 Terminal 輸入 npm install 指令
```

4. 安裝 nodemon 套件

```
在 Terminal 輸入 nodemon app.js 指令
```

5. 透過 MySQL Workbench 建立本機資料庫

6. 產生使用者與支出的資料模板至 MySQL

```
在 Terminal 執行 npx sequelize-cli db:migrate

於本機資料庫建立 Users Table、Restaurants Table、Categories Table、Comments Table、Favorites Table、Followship Table、Like Table
```

7. 建立種子檔案

```
在 Terminal 執行 npx sequelize-cli db:seed:all

於本機資料庫建立 Demo Users、Restaurants 和 Categories 資料
```

8. 啟動應用程式，執行 app.js 檔案

```
在 Terminal 執行 npm run dev
```

現在，你可開啟任一瀏覽器瀏覽器輸入 [http://localhost:3000](http://localhost:3000) 開始使用皮皮餐廳論壇網囉！歡迎使用官方測試帳號操作。

```
管理員
  帳號：root@example.com
  密碼：12345678
```

```
一般用戶
  帳號：user1@example.com
  密碼：12345678
```

## Contributor - 專案開發人員

> [Pierce Shih](https://github.com/pierceshih15)
