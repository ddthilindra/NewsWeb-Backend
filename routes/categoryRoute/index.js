const routes = require("express").Router();
const CategoryController = require("../../controllers/Category.controller");
const utils = require("../../lib/utils");

routes.post("/AddCategory", utils.authMiddleware,  CategoryController.addCategory);
routes.get("/GetAllCategory", utils.authMiddleware, CategoryController.getAllCategory);
routes.delete("/DeleteCategoryById/:id", utils.authMiddleware, CategoryController.deleteCategoryById);

module.exports = routes;