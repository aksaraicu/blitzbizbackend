import express from "express";
import {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  
} from "../controllers/UserController.js";
import { verifyUser, isAdmin } from "../middleware/AuthUser.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { Login, Logout, Me, ForgotPassword, ResetPassword } from "../controllers/AuthController.js";

const router = express.Router();

router.get("/users", verifyUser, getUsers);
router.get("/users/:id", verifyUser, isAdmin, getUserByID);
router.post("/users", createUser);
router.post("/register", registerUser);
router.patch("/users/:id", verifyUser, isAdmin, updateUser);
router.delete("/users/:id", verifyUser, isAdmin, deleteUser);
router.post("/login", Login);
router.delete("/logout", Logout);
router.get("/token", refreshToken);
router.get("/me", Me);
router.put("/forgotpassword", ForgotPassword)
router.put("/resetpassword/", ResetPassword)

export default router;
