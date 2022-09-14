const routes = require("express").Router();
const CategoryController = require("../../controllers/Category.controller");
const utils = require("../../lib/utils");

routes.post("/addCategory", utils.authMiddleware,  CategoryController.addCategory);
routes.get("/getAllCategory", CategoryController.getAllCategory);
routes.delete("/deleteCategoryById/:id", utils.authMiddleware, CategoryController.deleteCategoryById);

module.exports = routes;