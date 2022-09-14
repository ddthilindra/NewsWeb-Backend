const routes = require("express").Router();

const editorRoutes = require("./editorRoute/index");
const adminRoutes = require("./adminRoute/index");
const newsRoutes = require("./newsRoute/index");
const categoryRoutes = require("./categoryRoute/index");

routes.use("/editor", editorRoutes);
routes.use("/admin", adminRoutes);
routes.use("/news", newsRoutes);
routes.use("/category", categoryRoutes);

module.exports = routes;
