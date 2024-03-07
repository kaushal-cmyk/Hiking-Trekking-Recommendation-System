import { Router } from "express";
import { createHTLocation, deleteHTLocation, getAllHTLocation, getContentRecommendation, getHTLocation, getHTLocationOfUser, getRecommendation, updateHTLocation } from "../controller/hTLocationController.js";
import isValidToken from "../middleware/isValidToken.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

let hTLocationRouter = new Router();

hTLocationRouter
  .route("/")
  .post(isValidToken("login"), isAuthenticated, createHTLocation)
  .get(getAllHTLocation);

hTLocationRouter
.route("/user")
.get(isValidToken("login"), isAuthenticated, getHTLocationOfUser);



hTLocationRouter
    .route("/recommendation")
  .get(getRecommendation);

hTLocationRouter
.route("/recommendation/content/:hTLocId")
.get(getContentRecommendation)

hTLocationRouter
    .route("/:id")
    .get(isValidToken("login"), isAuthenticated, getHTLocation)
    .patch(isValidToken("login"), isAuthenticated, updateHTLocation)
    .delete(isValidToken("login"), isAuthenticated, deleteHTLocation);
    

export default hTLocationRouter;
