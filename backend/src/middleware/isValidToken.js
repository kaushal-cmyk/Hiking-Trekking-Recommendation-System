import { Token } from "../schema/model.js";

let isValidToken = (purpose) => {
    // console.log(purpose);
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization.split(" ")[1];
      // console.log("token => ", token);
      let tokenInfo = await Token.findOne({ token: token });
      // console.log("tokenInfo => ", tokenInfo);
      if (!tokenInfo) throw new Error("token is invalid");
      if (tokenInfo.purpose !== purpose) throw new Error("token is invalid");
      if (
        tokenInfo.purpose === "verify-email" ||
        tokenInfo.purpose === "reset-password"
      )
        await Token.findByIdAndDelete(tokenInfo._id);
    // console.log("*******")
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};
export default isValidToken;
