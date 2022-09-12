const routes = require("express").Router();
const NewsController = require("../../controllers/news.controller");
const storage = require("../../lib/multerConfig");

routes.post("/AddNews", storage.single("image"), NewsController.addNews);
routes.get("/GetAllNews", NewsController.getAllNews);
routes.put("/UpdateNews/:id", storage.single("image"), NewsController.updateNewsById);
routes.get("/GetNewsById/:id", NewsController.getNewsById);
routes.delete("/DeleteNewsById/:id", NewsController.deleteNewsById);

module.exports = routes;