"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _PostController = require("../controllers/PostController.js");
var _AuthUser = require("../middleware/AuthUser.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get("/postswithrole", _AuthUser.verifyUser, _PostController.getPostAllbyRole);
router.patch("/postswithrole/:id", _AuthUser.verifyUser, _PostController.updatePostByRole);
router.delete("/postswithrole/:id", _PostController.deletePostWithRole);
router.get("/posts", _PostController.getPosts);
router.get("/posts/:id", _PostController.getPostByID);
router.post("/posts", _PostController.createPost);
router.patch("/posts/:id", _PostController.updatePost);
router.delete("/posts/:id", _PostController.deletePost);
var _default = router;
exports.default = _default;