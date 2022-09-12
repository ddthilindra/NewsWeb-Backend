const routes = require("express").Router();
const utils = require("../../lib/utils");
const UserController = require("../../controllers/user.controller");
const storage = require("../../lib/multerConfig");

routes.post("/AddUser", storage.single("image"), UserController.addUser);
routes.put("/EditUser/:id", storage.single("image"), UserController.updateUserProfileByID);
routes.post("/Login", UserController.loginUser);
// routes.post("/forgotpassword", UserController.forgotPassword);
// // routes.get("/VerifyAccount", UserController.verifyAccount);
// routes.put("/resetpassword", UserController.resetPassword);
// routes.get("/profile/:id", UserController.getUser);
// routes.post("/googlelogin", UserController.googlelogin);

// routes.post("/profileId", UserController.getProfileId);

// routes.get("/followUser/:followUserId/:userId", UserController.followUser);
// routes.get(
//   "/getFollowersCount",
//   utils.authMiddleware,
//   UserController.getFollowers
// );
// routes.get(
//   "/getFollowingsCount",
//   utils.authMiddleware,
//   UserController.getFollowings
// );
// routes.get("/getAllUsers", UserController.getAllUsers);
// routes.get("/isBlockedByUserId/:id",utils.authMiddleware, UserController.isBlockedByUserId);
// routes.get("/getBlockListByUserId",utils.authMiddleware, UserController.getBlockListByUserId);
// routes.get("/getBlockUserIdList",utils.authMiddleware, UserController.getBlockUserIdList);
// routes.get("/blockUser/:id",utils.authMiddleware, UserController.blockUser);
// routes.get("/getBlockedUsersId",utils.authMiddleware, UserController.getBlockedUsersId);
// routes.get("/getBlockedUsersDetails",utils.authMiddleware, UserController.getBlockedUsersDetails);
// routes.get("/getAllBlockUserIdList",utils.authMiddleware, UserController.getAllBlockUserIdList);


module.exports = routes;
