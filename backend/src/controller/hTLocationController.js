import { Attribute, HTLocation, User } from "../schema/model.js";
import cosineSimilarity from "../utils/cosineSimilarity.js";
import haversine from "../utils/haversineFormula.js";

export let createHTLocation = async (req, res) => {
  // console.log(req.body)
  try {
    // let data = req.body.map((item, i) => {
    //   return {
    //     ...item,
    //     userId: req._id,
    //     avgRating: 0,
    //     pictures: [],
    //     nWishList: 0,
    //   };
    // });
    let data = {
      ...req.body,
      userId: req._id,
      avgRating: 0,
      pictures: [],
      nWishList: 0,
    };
    // console.log(data)
    let result = await HTLocation.create(data);
    // console.log(result._id);
    // console.log(result.id);
    res.status(201).json({
      success: true,
      message: "hTLocation created successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let getAllHTLocation = async (req, res) => {
  try {
    let hTLocations = await HTLocation.find({});
    let result;
    console.log(req.query);
    // console.log(req.query.type)
    // console.log(hTLocations[0].createdAt.toLocaleDateString());
    switch (req.query.type) {
      case "sort":
        switch (req.query.sort) {
          case "closest":
            let distance = hTLocations.map((hTLocation, i) => {
              // console.log(hTLocation);
              return {
                dist: haversine(
                  {
                    latitude: req.query.latitude,
                    longitude: req.query.longitude,
                  },
                  {
                    latitude: hTLocation.start.latitude,
                    longitude: hTLocation.end.longitude,
                  }
                ),
                ...hTLocation._doc,
              };
            });
            result = distance.sort((a, b) => a.dist - b.dist);
            // console.log(distance[0]);
            break;
          case "rating":
            result = hTLocations.sort((a, b) => {
              return b.avgRating - a.avgRating;
            });
            break;
          case "wishList":
            result = hTLocations.sort((a, b) => {
              return b.nWishList - a.nWishList;
            });
            break;
          case "recently-added":
            result = hTLocations.sort((a, b) => {
              let aDate = a.createdAt.toLocaleDateString().split("/"); //[month, day, year]
              let bDate = b.createdAt.toLocaleDateString().split("/"); //[month, day, year]
              aDate = `${aDate[2]}${aDate[0]}${aDate[1]}`;
              bDate = `${bDate[2]}${bDate[0]}${bDate[1]}`;
              return Number(bDate) - Number(aDate);
            });
            console.log(hTLocations);
            break;
        }
        break;
      case "filter":
        console.log("***");
        //filter => ["attributes", "difficulty", "duration"]
        // console.log(req.query.attributes.split(","));
        switch (req.query.filter) {
          case "attributes":
            console.log("******");
            // result = await HTLocation.find({attributes: {$in:req.query.attributes.split(",")}});
            // result = await HTLocation.find({difficulty: {$in: req.query.difficulty?.split(",")}});
            // result = await HTLocation.find({$and: [{attributes: {$in:req.query.attributes.split(",")}}, {difficulty: {$in: req.query.difficulty?.split(",")}}]})
            // result = await HTLocation.find({
            //   $and: [{ attributes: "Views" }, { difficulty: "easy" }],
            // }); //works
            if (!req.query.difficulty) {
              req.query.difficulty = "easy,moderate,hard";
            }
            if (!req.query.attributes) {
              console.log("***");
              let out = await Attribute.find({});
              req.query.attributes = [];
              out.forEach((item, i) => {
                req.query.attributes.push(item.attribute);
              });
              req.query.attributes = req.query.attributes.join(",");
              // console.log(req.query.attributes);
            }
            let attributes = req.query.attributes.split(",");
            console.log(attributes);
            attributes = attributes.map((a, i) => {
              return a.trim();
            });
            console.log(attributes);
            let difficulty = req.query.difficulty.split(",");
            console.log(difficulty);
            difficulty = difficulty.map((a, i) => {
              return a.trim();
            });
            console.log(difficulty);
            result = await HTLocation.find({
              $and: [
                { attributes: { $in: attributes } },
                { difficulty: { $in: difficulty } },
              ],
            }).sort("-avgRating");
            // console.log(result);
            break;
        }
        break;
      default:
        result = await HTLocation.find({});
    }
    res.status(200).json({
      success: true,
      message: "get all HTLocation successful",
      noOfHTLocation: result.length,
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// console.log(req.query.attribute);
// let result = await HTLocation.find({"length.value": {$gte: 30}}).populate("userId");
// console.log(typeof result);
// let result = await HTLocation.find({}).select("length start end");
// let result = await HTLocation.find({}).sort("length");
// console.log(result);
// try {
//   let result = await HTLocation.find({});
//   res.status(200).json({
//     success: true,
//     message: "get all HTLocation successful",
//     noOfHTLocation: result.length,
//     result: result,
//   });
// } catch (error) {
//   res.status(400).json({
//     success: false,
//     message: error.message,
//   });
// }

export let getRecommendation = async (req, res) => {
  let result = await HTLocation.find({});
  console.log(result[0]);
};

export let getContentRecommendation = async (req, res) => {
  try {
    let hTLocations = await HTLocation.find({});
    let attributes = await Attribute.find({});

    let attArray = attributes.map((a, i) => {
      return a.attribute;
    });

    let itemMatrix = [];

    itemMatrix[0] = [
      "length <= 20km",
      "length <= 50km",
      "length > 50km",
      "elevationGain <= 500m",
      "elevationGain <= 2000m",
      "elevationGain > 2000m",
      "easy",
      "moderate",
      "hard",
      "Loop",
      "Out & Back",
      "Point to Point",
      ...attArray,
    ];

    for (let i = 0; i < hTLocations.length; i++) {
      //length
      itemMatrix[i + 1] = [];
      if (hTLocations[i].length.value < 20) {
        itemMatrix[i + 1][0] = 1;
        itemMatrix[i + 1][1] = 0;
        itemMatrix[i + 1][2] = 0;
      } else if (hTLocations[i].length.value < 50) {
        itemMatrix[i + 1][0] = 0;
        itemMatrix[i + 1][1] = 1;
        itemMatrix[i + 1][2] = 0;
      } else {
        itemMatrix[i + 1][0] = 0;
        itemMatrix[i + 1][1] = 0;
        itemMatrix[i + 1][2] = 1;
      }

      //elevationGain
      if (hTLocations[i].elevationGain.value <= 500) {
        itemMatrix[i + 1][3] = 1;
        itemMatrix[i + 1][4] = 0;
        itemMatrix[i + 1][5] = 0;
      } else if (hTLocations[i].elevationGain.value <= 2000) {
        itemMatrix[i + 1][3] = 0;
        itemMatrix[i + 1][4] = 1;
        itemMatrix[i + 1][5] = 0;
      } else {
        itemMatrix[i + 1][3] = 0;
        itemMatrix[i + 1][4] = 0;
        itemMatrix[i + 1][5] = 1;
      }

      //difficulty
      if (hTLocations[i].difficulty === "easy") {
        itemMatrix[i + 1][6] = 1;
        itemMatrix[i + 1][7] = 0;
        itemMatrix[i + 1][8] = 0;
      } else if (hTLocations[i].difficulty === "moderate") {
        itemMatrix[i + 1][6] = 0;
        itemMatrix[i + 1][7] = 1;
        itemMatrix[i + 1][8] = 0;
      } else {
        itemMatrix[i + 1][6] = 0;
        itemMatrix[i + 1][7] = 0;
        itemMatrix[i + 1][8] = 1;
      }

      //routeType
      if (hTLocations[i].routeType === "Loop") {
        itemMatrix[i + 1][9] = 1;
        itemMatrix[i + 1][10] = 0;
        itemMatrix[i + 1][11] = 0;
      } else if (hTLocations[i].routeType === "Out & Back") {
        itemMatrix[i + 1][9] = 0;
        itemMatrix[i + 1][10] = 1;
        itemMatrix[i + 1][11] = 0;
      } else {
        itemMatrix[i + 1][9] = 0;
        itemMatrix[i + 1][10] = 0;
        itemMatrix[i + 1][11] = 1;
      }

      //attributes
      hTLocations[i].attributes.forEach((attribute, index) => {
        for (let j = 12; j < itemMatrix[0].length; j++) {
          if (attribute === itemMatrix[0][j]) {
            // console.log(j);
            // console.log(itemMatrix[0][j])
            itemMatrix[i + 1][j] = 1;
            break;
          }
        }
      });
      for (let j = 9; j < itemMatrix[0].length; j++) {
        if (itemMatrix[i + 1][j] !== 1) {
          itemMatrix[i + 1][j] = 0;
        }
      }
      // console.log(itemMatrix[1]);
    }
    let similarityMatrix = [];
    for (let i = 1; i < itemMatrix.length; i++) {
      similarityMatrix[i] = [];
      for (let j = 1; j < itemMatrix.length; j++) {
        similarityMatrix[i].push(
          cosineSimilarity(itemMatrix[i], itemMatrix[j])
        );
      }
    }

    let similarityObjectMatrix = [];
    for (let i = 1; i < similarityMatrix.length; i++) {
      similarityObjectMatrix[i - 1] = [];
      for (let j = 0; j < similarityMatrix[i].length; j++) {
        similarityObjectMatrix[i - 1].push({
          value: similarityMatrix[i][j],
          similarToIndex: j,
        });
      }
      //   console.log(similarityObjectMatrix[i-1].length);
      similarityObjectMatrix[i - 1].sort((a, b) => b.value - a.value);
    }

    let index;
    for (let i = 0; i < hTLocations.length; i++) {
      if (hTLocations[i].id === req.params.hTLocId) {
        index = i;
        break;
      }
    }

    let recommendation = [];
    for (let i = 1; i <= 5; i++) {
      let hTLocation =
        hTLocations[similarityObjectMatrix[index][i].similarToIndex];
      recommendation.push({
        hTLocation: hTLocation,
        match: similarityObjectMatrix[index][i].value,
      });
    }
    console.log(recommendation);
    res.status(200).json({
      success: true,
      message: "content based recommendation fetched",
      result: recommendation,
      length: recommendation.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let getHTLocation = async (req, res) => {
  try {
    let hTLocation = await HTLocation.findById(req.params.id);
    res.json({
      success: true,
      message: "read particular hTLocation successful",
      result: hTLocation,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export let updateHTLocation = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.params);
    let user = await User.findById(req._id);
    let hTLocation = await HTLocation.findById(req.params.id);
    if (String(user._id) !== String(hTLocation.userId))
      throw new Error("You do not have authorization to update this location");
    let result = await HTLocation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    
    res.status(201).json({
      success: true,
      message: "HTLocation updated successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let deleteHTLocation = async (req, res) => {
  try {
    let user = await User.findById(req._id);
    let hTLocation = await HTLocation.findById(req.params.id);
    console.log("user => ", user._id);
    console.log("actual => ", hTLocation.userId);
    if (String(user._id) !== String(hTLocation.userId))
      throw new Error("You do not have authorization to delete this location");
    let result = await HTLocation.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "hTLocation deleted successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let getHTLocationOfUser = async (req, res) => {
  try {
    let result = await HTLocation.find({userId: req._id});
    res.status(200).json({
      success: true,
      message: "All HTLocations created by the user fetched successfully ",
      result : result,
      length: result.length
    })
  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    })
  }
};