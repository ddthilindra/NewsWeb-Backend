const routes = require("express").Router();
const utils = require("../../lib/utils");
const EditorController = require("../../controllers/editor.controller");
const storage = require("../../lib/multerConfig");

routes.post("/addEditor", utils.authMiddleware, storage.single("image"), EditorController.addEditor);
routes.put("/updateEditor/:id", utils.authMiddleware, storage.single("image"), EditorController.updateEditorByID);
routes.post("/login", EditorController.loginEditor);
routes.get("/getAllEditors", utils.authMiddleware, EditorController.getAllEditors);

module.exports = routes;
