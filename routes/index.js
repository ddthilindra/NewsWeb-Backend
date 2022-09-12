const routes = require("express").Router();

const userRoutes = require("./userRoute/index");

routes.use("/user", userRoutes);

module.exports = routes;
