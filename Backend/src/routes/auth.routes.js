import { Router } from "express";
import {
  getMe,
  loginUser,
  registerUser,
  verifyEmail,
} from "../controller/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validator/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerUser);

authRouter.post("/login", loginValidator, loginUser);

authRouter.get("/get-me", authUser, getMe);

authRouter.get("/verify-email", verifyEmail);

export default authRouter;
