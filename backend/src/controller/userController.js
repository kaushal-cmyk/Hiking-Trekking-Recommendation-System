import { email, secret_key } from "../config/config.js";
import { Token, User } from "../schema/model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

export let createUser = async (req, res, next) => {
  // let token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  // console.log(req.body);
  // res.json({
  //     data: req.body
  // });

  try {
    // console.log(req.body);
    let data = req.body;
    let numOfUser = (await User.find({})).length;
    // console.log(numOfUser);
    data = {
      ...data,
      role: "user",
      // _id: `User_${(isNaN(numOfUser) ? 0 : numOfUser) + 1}`,
      isVerifiedEmail: false,
      password: await bcrypt.hash(data.password, 10),
    };
    // data.userId = `User_${(isNaN(numOfUser) ? 0 : numOfUser) + 1}`;
    // data.isVerifiedEmail = false;
    // data.password = await bcrypt.hash(data.password, 10);
    let result = await User.create(data);
    let token = jwt.sign({ _id: result._id }, secret_key, { expiresIn: "1d" });
    console.log(await Token.create({ token: token, purpose: "verify-email" }));
    await sendEmail({
      from: `"HTLoc-Recom-Portal"<${email}>`,
      to: [result.email],
      subject: `Verification Email`,
      html: `<h1>Verification Email</h1>
            <p>Click the link below to verify your email</p>
            <a href="http://localhost:3000/verify-email?token=${token}">http://localhost:3000/verify-email?token=${token}</a>`,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully. Email sent for verification",
      result: result,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let verifyEmailUser = async (req, res) => {
  try {
    // console.log(infoObj);
    // console.log(infoObj);
    let result = await User.findByIdAndUpdate(
      req._id,
      { isVerifiedEmail: true },
      { new: true }
    );
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "isVerifiedEmail is true",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let loginUser = async (req, res) => {
  try {
    // console.log(req)
    let { email, password } = req.body;
    let result = await User.findOne({ email: email });
    // if (result) {
    //   if (result.isVerifiedEmail) {
    //     let isValidPassword = await bcrypt.compare(password, result.password);
    //     console.log(isValidPassword);
    //     if (isValidPassword) {
    //       res.json({
    //         success: true,
    //         message: "Login operation successful",
    //         result: result,
    //         token: jwt.sign({ _id: result._id }, secret_key, {
    //           expiresIn: "365d",
    //         }),
    //       });
    //     } else {
    //       throw new Error("email or password is incorrect");
    //     }
    //   } else {
    //     throw new Error("email or password is incorrect");
    //   }
    // } else {
    //   throw new Error("email or password is incorrect");
    // }

    // console.log(result);
    if (!result) throw new Error("email or password does not match");
    if (!result.isVerifiedEmail) throw new Error("email is not verified");
    let isValidPassword = await bcrypt.compare(password, result.password);
    if (!isValidPassword) throw new Error("email or password does not match");
    let token = jwt.sign({ _id: result._id }, secret_key, {
      expiresIn: "365d",
    });
    await Token.create({ token: token, purpose: "login" });
    res.status(201).json({
      success: true,
      message: "Login operation successful",
      result: result,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let myProfileUser = async (req, res) => {
  // console.log(req._id);
  try {
    let result = await User.findById(req._id);
    res.status(200).json({
      success: true,
      message: "myProfile get successful",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let updateMyProfileUser = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    delete data.email;
    delete data.password;
    console.log(data);
    let result = await User.findByIdAndUpdate(req._id, data, { new: true });
    res.status(201).json({
      success: true,
      message: "myProfile update successful",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let updatePasswordUser = async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;
    let userInfo = await User.findById(req._id);
    console.log(userInfo);
    let isValidPassword = await bcrypt.compare(oldPassword, userInfo.password);
    // console.log(isValidPassword);
    if (!isValidPassword) throw new Error("Password is incorrect");
    let newHashPassword = await bcrypt.hash(newPassword, 10);
    let result = await User.findByIdAndUpdate(
      req._id,
      { password: newHashPassword },
      { new: true }
    );
    console.log(newHashPassword);
    res.status(201).json({
      succes: true,
      message: "password update successful",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let forgotPasswordUser = async (req, res) => {
  try {
    let infoObj = await User.findOne({ email: req.body.email });
    if (!infoObj) throw new Error("email does not exist");
    let token = jwt.sign({ _id: infoObj._id }, secret_key, { expiresIn: "1d" });
    console.log(
      await Token.create({ token: token, purpose: "reset-password" })
    );
    await sendEmail({
      from: `"HTLoc-Recom-Portal"<${email}>`,
      to: [infoObj.email],
      subject: `Reset Password Link`,
      html: `<h1>Reset Password</h1>
          <p>Click the link below to reset your password</p>
          <a href="http://localhost:3000/verify-email?token=${token}">http://localhost:3000/verify-email?token=${token}</a>`,
    });
    // console.log(infoObj);
    res.status(201).json({
      success: true,
      message: "Link has been sent to your email to reset password",
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let resetPasswordUser = async (req, res) => {
  try {
    let newHashPassword = await bcrypt.hash(req.body.newPassword, 10);
    // console.log(newHashPassword);
    // console.log(req._id);
    let result = await User.findByIdAndUpdate(
      req._id,
      { password: newHashPassword },
      { new: true }
    );
    console.log(result);
    res.status(201).json({
      success: true,
      message: "Password reset successful",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let readSpecificUser = async (req, res) => {
  try {
    // console.log(req.params);
    // let { userId } = req.params;
    let id = req.params.userId;
    // console.log(req.params)
    let result = await User.findById(id);
    res.json({
      success: true,
      message: "readSpecificUser successful",
      result: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export let updateSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.userId;
    let data = req.body;

    delete data.email;
    delete data.password;

    let result = await User.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
      success: true,
      message: "user updated successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let deleteSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.userId;
    let result = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "user deleted successfully.",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let readAllUser = async (req, res) => {
  try {
    // console.log(req.params);
    // let { userId } = req.params;
    let result = await User.find({});
    res.json({
      success: true,
      message: "Users read successfully.",
      result: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
