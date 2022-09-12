const routes = require("express").Router();
const NewsController = require("../../controllers/news.controller");
const storage = require("../../lib/multerConfig");
const utils = require("../../lib/utils");

routes.post("/AddNews", utils.authMiddleware, storage.single("image"), NewsController.addNews);
routes.get("/GetAllNews", utils.authMiddleware, NewsController.getAllNews);
routes.put("/UpdateNews/:id", utils.authMiddleware, storage.single("image"), NewsController.updateNewsById);
routes.get("/GetNewsById/:id", utils.authMiddleware, NewsController.getNewsById);
routes.delete("/DeleteNewsById/:id", utils.authMiddleware, NewsController.deleteNewsById);

module.exports = routes;