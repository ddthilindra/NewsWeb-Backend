const routes = require("express").Router();

const userRoutes = require("./userRoute/index");
const newsRoutes = require("./newsRoute/index");

routes.use("/user", userRoutes);
routes.use("/news", newsRoutes);

module.exports = routes;
