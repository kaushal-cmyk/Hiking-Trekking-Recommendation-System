import { Router } from "express";
import {
  addToWishList,
  deleteFromWishList,
  getWishList,
} from "../controller/wishListController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidToken from "../middleware/isValidToken.js";

let wishListRouter = new Router();

wishListRouter
  .route("/")
  .get(isValidToken("login"), isAuthenticated, getWishList);

wishListRouter
  .route("/:hTLocId")
  .post(isValidToken("login"), isAuthenticated, addToWishList)
  .delete(isValidToken("login"), isAuthenticated, deleteFromWishList);

export default wishListRouter;