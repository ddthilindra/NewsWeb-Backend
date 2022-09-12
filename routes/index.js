const routes = require("express").Router();

const userRoutes = require("./userRoute/index");
const newsRoutes = require("./newsRoute/index");
const categoryRoutes = require("./categoryRoute/index");

routes.use("/user", userRoutes);
routes.use("/news", newsRoutes);
routes.use("/category", categoryRoutes);

module.exports = routes;
