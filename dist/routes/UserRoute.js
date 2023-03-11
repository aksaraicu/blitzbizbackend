"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _UserController = require("../controllers/UserController.js");
var _AuthUser = require("../middleware/AuthUser.js");
var _RefreshToken = require("../controllers/RefreshToken.js");
var _AuthController = require("../controllers/AuthController.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get("/users", _AuthUser.verifyUser, _UserController.getUsers);
router.get("/users/:id", _AuthUser.verifyUser, _AuthUser.isAdmin, _UserController.getUserByID);
router.post("/users", _UserController.createUser);
router.post("/register", _UserController.registerUser);
router.patch("/users/:id", _AuthUser.verifyUser, _AuthUser.isAdmin, _UserController.updateUser);
router.delete("/users/:id", _AuthUser.verifyUser, _AuthUser.isAdmin, _UserController.deleteUser);
router.post("/login", _AuthController.Login);
router.delete("/logout", _AuthController.Logout);
router.get("/token", _RefreshToken.refreshToken);
router.get("/me", _AuthController.Me);
router.put("/forgotpassword", _AuthController.ForgotPassword);
router.put("/resetpassword/", _AuthController.ResetPassword);
var _default = router;
exports.default = _default;