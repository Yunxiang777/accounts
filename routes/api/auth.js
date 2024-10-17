var express = require("express");
var router = express.Router();
var UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const saltRounds = 10; // 加密強度
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "AAA"; // 用來生成 token 的密鑰，應該存放在環境變數中

/* login view */
// router.get("/login", async function (req, res, next) {
//   res.render("auth/login", { errors: [] });
// });

/* login action */
router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    // 查找用戶
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(500), send();
      res.json({
        code: "2001",
        msg: "讀取失敗",
        data: null,
      });
    }

    // 比較密碼
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({
        code: "2002",
        msg: "用戶不存在",
        data: null,
      });
      return;
    }
    // 生成 JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h", // token 1 小時後過期
      }
    );

    // 成功登入，回傳 token
    return res.json({
      code: "0000",
      msg: "登入成功",
      data: { token },
    });
  } catch (err) {
    console.log(err);

    res.json({
      code: "2002",
      msg: "用戶不存在",
      data: null,
    });
  }
});

/* logout action */
router.post("/logout", async function (req, res, next) {
  // 清除 session
  req.session.destroy(function (err) {
    if (err) {
      console.error("登出失敗：", err);
      return res
        .status(500)
        .render("error", { message: "登出失敗", error: err });
    }

    // 成功登出後，重定向到登入頁面
    res.redirect("/login");
  });
});

module.exports = router;
