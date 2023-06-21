import express from "express";
import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

//ПОДКЛЮЧЕНИЕ К БД
mongoose
  .connect(
    "mongodb+srv://admin:12345Aa@cluster0.ytge6vp.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// ЗАПУСК СЕРВЕРА
const app = express();

app.use(express.json());

// АВТОРИЗАЦИЯ
app.post("/auth/login", loginValidation, UserController.login);

// РЕГИСТРАЦИЯ
app.post("/auth/register", registerValidation, UserController.register);

// ЗАПРОС ИНФЫ
app.get("/auth/me", checkAuth, UserController.getMe);

// СТАТЬИ
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.get("/posts", checkAuth, PostController.getAll);
// app.get("/posts:id", checkAuth, PostController.getOne);
// app.delete("/posts:id", checkAuth, PostController.remove);
// app.patch("/posts:id", checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});
