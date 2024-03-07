import { HTLocation, Rating } from "../schema/model.js";

export let getHTLocationAllRating = async (req, res) => {
  try {
    let param = req.params;
    let hTLocation = await HTLocation.findById(req.params.hTLocId);
    if (!hTLocation) throw new Error("Invalid hTLocId");
    let ratings = await Rating.find({ hTLocationId: hTLocation._id });
    res.status(200).json({
      success: true,
      message: "get all ratings of a particular hTLocation successful",
      noOfRating: ratings.length,
      result: ratings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let createHTLocationRating = async (req, res) => {
  try {
    let hTLocIdValid = await HTLocation.findOne({ _id: req.params.hTLocId });
    // console.log(hTLocIdValid);
    if (!hTLocIdValid) {
      throw new Error("Invalid hTLocId");
    }
    let userIdValid = await Rating.findOne({
      userId: req._id,
      hTLocationId: req.params.hTLocId,
    });
    if (userIdValid) {
      throw new Error("user has already created a review for this hTLocation");
    }
    let params = req.params;
    // console.log(req.body);
    let rating = {
      ...req.body,
      userId: req._id,
      hTLocationId: req.params.hTLocId,
    };
    // console.log(rating);
    let result = await Rating.create(rating);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      result: result,
    });
    // console.log(req._id);
    // console.log(params);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let getUserAllRating = async (req, res) => {
  // console.log(req._id);
  try {
    let userAllRating = await Rating.find({ userId: req._id });
    if (userAllRating.length === 0) {
      throw new Error("User has not given any ratings");
    }
    res.status(201).json({
      success: true,
      message: "Get all ratings of a user successful",
      result: userAllRating,
      noOfRating: userAllRating.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let updateRating = async (req, res) => {
  try {
    // console.log(req.params);
    let ratingInfo = await Rating.findById(req.params.ratingId);
    if (!ratingInfo) throw new Error("ratingId is invalid");
    // console.log(ratingInfo);
    console.log(req._id);
    console.log(ratingInfo.userId);
    if (req._id !== String(ratingInfo.userId))
      throw new Error("User does not have authorization");
    console.log(req.body);
    delete req.body.userId;
    delete req.body.hTLocationId;
    console.log(req.body);
    let result = await Rating.findByIdAndUpdate(req.params.ratingId, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: "Rating updated successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let deleteRating = async (req, res) => {
  try {
    console.log(req.params);
    let ratingInfo = await Rating.findById(req.params.ratingId);
    console.log(ratingInfo);
    if (!ratingInfo) throw new Error("ratingId is invalid");
    if (req._id !== String(ratingInfo.userId))
      throw new Error("User does not have authorization");
    let result = await Rating.findByIdAndDelete(req.params.ratingId);
    res.status(200).json({
      success: true,
      message: "Rating deleted successfully",
      result: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
