import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

//ПОДКЛЮЧЕНИЕ К БД
mongoose
  .set("strictQuery", false)
  .connect(
    "mongodb+srv://admin:12345Aa@cluster0.ytge6vp.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// ЗАПУСК СЕРВЕРА
const app = express();

// СОЗДАНИЕ ХРАНИЛИЩА
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

//научить экспресс видеть json
app.use(express.json());
//научить экспресс видеть картинки в папке uploads
app.use('/uploads', express.static('uploads'));

// ЗАГРУЗКА ФАЙЛА
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// АВТОРИЗАЦИЯ
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);

// РЕГИСТРАЦИЯ
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);

// ЗАПРОС ИНФЫ
app.get("/auth/me", checkAuth, UserController.getMe);

// СТАТЬИ
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});
