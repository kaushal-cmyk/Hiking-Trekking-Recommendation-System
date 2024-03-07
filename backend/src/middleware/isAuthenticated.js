import jwt from "jsonwebtoken";
import { secret_key } from "../config/config.js";
import { Token } from "../schema/model.js";

let isAuthenticated = async (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;
    let token = bearerToken.split(" ")[1];
    let infoObj = jwt.verify(token, secret_key);  
    // console.log(infoObj);
    req._id = infoObj._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,  
      message: error.message,
    });
  }
};

export default isAuthenticated;
