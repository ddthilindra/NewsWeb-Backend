const routes = require("express").Router();
const NewsController = require("../../controllers/news.controller");
const storage = require("../../lib/multerConfig");
const utils = require("../../lib/utils");

routes.post("/addNews", utils.authMiddleware, storage.single("image"), NewsController.addNews);
routes.get("/getAllNews", NewsController.getAllNews);
routes.put("/updateNews/:id", utils.authMiddleware, storage.single("image"), NewsController.updateNewsById);
routes.get("/getNewsById/:id", NewsController.getNewsById);
routes.get("/getNewsByCategory/:category", NewsController.getNewsByCategory);
routes.delete("/deleteNewsById/:id", utils.authMiddleware, NewsController.deleteNewsById);

module.exports = routes;