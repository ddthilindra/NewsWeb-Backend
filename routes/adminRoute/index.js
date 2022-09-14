const routes = require("express").Router();
const AdminController = require("../../controllers/admin.contoller");

routes.post("/addAdmin" ,AdminController.addAdmin);
routes.post("/login", AdminController.loginAdmin);

module.exports = routes;
