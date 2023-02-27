import express from "express";
import { 
    getPosts,
    getPostByID,
    createPost,
    updatePost,
    deletePost, 
    getPostAllbyRole,
    updatePostByRole,
    deletePostWithRole
} from "../controllers/PostController.js";
import { verifyUser, isAdmin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/postswithrole", verifyUser, getPostAllbyRole);
router.patch("/postswithrole/:id", verifyUser, updatePostByRole);
router.delete("/postswithrole/:id", deletePostWithRole);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostByID);
router.post("/posts", createPost);
router.patch("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

export default router;