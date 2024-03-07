import { Router } from "express";
import {
  createUser,
  deleteSpecificUser,
  forgotPasswordUser,
  loginUser,
  myProfileUser,
  readAllUser,
  readSpecificUser,
  resetPasswordUser,
  updateMyProfileUser,
  updatePasswordUser,
  updateSpecificUser,
  verifyEmailUser,
} from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidToken from "../middleware/isValidToken.js";
import authorization from "../middleware/authorization.js";

let userRouter = new Router();

userRouter
  .route("/")
  .post(createUser)
  .get(
    isValidToken("login"),
    isAuthenticated,
    authorization(["admin"]),
    readAllUser
  );

// // userRouter
// // .route("/:id")

userRouter.route("/login").post(loginUser);

userRouter
  .route("/verify-email")
  .get(isValidToken("verify-email"), isAuthenticated, verifyEmailUser);

userRouter
  .route("/my-profile")
  .get(isValidToken("login"), isAuthenticated, myProfileUser)
  .patch(isValidToken("login"), isAuthenticated, updateMyProfileUser);

userRouter
  .route("/update-password")
  .patch(isValidToken("login"), isAuthenticated, updatePasswordUser);

userRouter.route("/forgot-password").post(forgotPasswordUser);

userRouter
  .route("/reset-password")
  .patch(isValidToken("reset-password"), isAuthenticated, resetPasswordUser);

userRouter
  .route("/:userId")
  .get(isValidToken("login"), isAuthenticated, readSpecificUser)
  .patch(
    isValidToken("login"),
    isAuthenticated,
    authorization(["admin"]),
    updateSpecificUser
  )
  .delete(
    isValidToken("login"),
    isAuthenticated,
    authorization(["admin"]),
    deleteSpecificUser
  );

export default userRouter;
