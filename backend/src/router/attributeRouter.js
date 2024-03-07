import { Router } from "express";
import {
  addAttribute,
  getAttribute,
} from "../controller/attributeController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidToken from "../middleware/isValidToken.js";
let attributeRouter = new Router();

attributeRouter
  .route("/")
  .post(isValidToken("login"), isAuthenticated,addAttribute)
  .get(isValidToken("login"), isAuthenticated, getAttribute);

export default attributeRouter;
