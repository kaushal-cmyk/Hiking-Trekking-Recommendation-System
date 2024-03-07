import connectToMongoDB from "./src/connectToDB/connectToMongoDB.js";
import { Attribute, HTLocation, Rating, User } from "./src/schema/model.js";
import cosineSimilarity from "./src/utils/cosineSimilarity.js";

function _ratingMatrix(hTLocations, ratings, users) {
  let ratingMatrix = new Array(users.length);
  // console.log(ratingMatrix);

  for (let i = 0; i < users.length; i++) {
    ratingMatrix[i] = [];
    for (let j = 0; j < hTLocations.length; j++) {
      let count = 0;
      for (let k = 0; k < ratings.length; k++) {
        // console.log(k);
        // console.log(ratings[k]);
        if (
          users[i].id === String(ratings[k].userId) &&
          hTLocations[j].id === String(ratings[k].hTLocationId)
        ) {
          ratingMatrix[i].push(ratings[k].rating);
          break;
        }
        count++;
      }
      if (count === ratings.length) {
        ratingMatrix[i].push(undefined);
      }
    }
  }
  // console.log(ratingMatrix);
  return ratingMatrix;
}

await connectToMongoDB();

let userId = "65a5e465fa69695bb89cdefd";
let hTLocations = await HTLocation.find({});
let ratings = await Rating.find({});
let users = await User.find({});
let attributes = await Attribute.find({});

let ratingMatrix = _ratingMatrix(hTLocations, ratings, users);
console.log("rating matrix", ratingMatrix);

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
//   console.log(hTLocations[i]);
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
  hTLocations[i].attributes.forEach((attribute, index) => {
    // console.log(attribute);
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
// console.log(itemMatrix)

let index;
for (let i = 0; i < users.length; i++)
{
    if (users[i].id === userId)
    {
        index = i;
        break;
    }
}
// console.log(index);
let ratingArray = ratingMatrix[index];
// console.log(ratingArray);


let locationsIndex = [];
for (let i = 0; i < ratingArray.length; i++)
{
    if (ratingArray[i])
    {
        locationsIndex.push(i);
    }
}

// console.log(locationsIndex);

let weightedMatrix = locationsIndex.map((index, j) => {
    let itemArray = itemMatrix[index];
    let weight = ratingArray[index];
    let weightedArray = itemArray.map((attribute, k) => {
        return (attribute * weight);
    });
    return weightedArray;
});
// console.log(weightedMatrix);

let weightedArray = [];

for (let i = 0; i < weightedMatrix[0].length; i++)
{
    let total = 0;
    weightedMatrix.forEach((item, j) => {
        total += item[i];
    });
    weightedArray.push(total);
}

// console.log(weightedArray);

let total = weightedArray.reduce((prev, cur) => {
    // console.log(prev + cur);
    return (prev + cur);
});

let normalizedArray = weightedArray.map((item, i) => {
    return (item/total);
})

// console.log(itemMatrix[0]);

// console.log(normalizedArray);

let finalRatingArray = [];
for (let i = 1; i < itemMatrix.length; i++)
{
    finalRatingArray.push(cosineSimilarity(normalizedArray, itemMatrix[i]))
};

// console.log(finalRatingArray)