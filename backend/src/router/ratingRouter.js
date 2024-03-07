import { Router } from "express";
import { createHTLocationRating, deleteRating, getHTLocationAllRating, getUserAllRating, updateRating } from "../controller/ratingController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidToken from "../middleware/isValidToken.js";



let ratingRouter = new Router();

ratingRouter
.route("/users")
.get(isValidToken("login"), isAuthenticated, getUserAllRating)

ratingRouter
.route("/:ratingId")
.patch(isValidToken("login"), isAuthenticated, updateRating)
.delete(isValidToken("login"), isAuthenticated, deleteRating);

ratingRouter
.route("/hTLocations/:hTLocId")
.get(getHTLocationAllRating)
.post(isValidToken("login"), isAuthenticated, createHTLocationRating)


export default ratingRouter;