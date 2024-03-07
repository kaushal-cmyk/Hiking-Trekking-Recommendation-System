import connectToMongoDB from "./src/connectToDB/connectToMongoDB.js";
import { HTLocation, Rating, User } from "./src/schema/model.js";

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

function _normalizedRatingMatrix(ratingMatrix) {
  let normalizedRatingMatrix = ratingMatrix.map((user, i) => {
    let avgRating = average(user);
    let normalizedUser = user.map((rating, j) => {
      if (rating) {
        return rating - avgRating;
      }
      return 0;
    });
    return normalizedUser;
  });
  return normalizedRatingMatrix;
}

function average(inputArr) {
  let sum = 0;
  let count = 0;
  inputArr.forEach((item, i) => {
    if (item) {
      sum += item;
      count++;
    }
  });
  return sum / count;
}

function cosineSimilarity(ar1, ar2) {
  if (ar1.length !== ar2.length) {
    throw new Error("length of both array needs to be equal");
  }
  let sumProduct = 0;
  let denomAr1 = 0;
  let denomAr2 = 0;
  ar1.forEach((value, i) => {
    sumProduct += value * ar2[i];
    denomAr1 += value * value;
    denomAr2 += ar2[i] * ar2[i];
  });
  let denom = Math.sqrt(denomAr1) * Math.sqrt(denomAr2);
  if (denom === 0) return 0;
  else return sumProduct / denom;
}

function _uToUSimilarityMatrix(normalizedRatingMatrix) {
  let uToUSimilarityMatrix = new Array(normalizedRatingMatrix.length);
  for (let i = 0; i < normalizedRatingMatrix.length; i++) {
    uToUSimilarityMatrix[i] = [];
    for (let j = 0; j < normalizedRatingMatrix.length; j++) {
      uToUSimilarityMatrix[i].push(
        Math.round(
          cosineSimilarity(
            normalizedRatingMatrix[i],
            normalizedRatingMatrix[j]
          ) * 1000
        ) / 1000
        // cosineSimilarity(normalizedRatingMatrix[i], normalizedRatingMatrix[j])
      );
    }
  }
  return uToUSimilarityMatrix;
}

function _filledRatingMatrix(
  uToUSimilarityMatrix,
  userId,
  users,
  hTLocations,
  ratings,
  normalizedRatingMatrix,
  ratingMatrix
) {
  let index;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      index = i;
      break;
    }
  }
  let userRatings = [];
  for (let i = 0; i < ratings.length; i++) {
    if (String(ratings[i].userId) === userId) {
      userRatings.push(ratings[i]);
    }
  }

  console.log("index => ", index);
  console.log("userRatings => ", userRatings);
  let ratingArray = [];
  for (let i = 0; i < hTLocations.length; i++) {
    console.log(i);
    // console.log(hTLocations[i])
    let count = 0;
    for (let j = 0; j < userRatings.length; j++) {
      if (hTLocations[i].id === String(userRatings[j].hTLocationId)) {
        ratingArray.push(userRatings[j].rating);
        break;
      }
      count++;
    }
    // console.log(count);
    if (count !== userRatings.length) {
      continue;
    }
    let usersWRatedHTL = []; // users Who Rated HTLocation
    for (let j = 0; j < ratings.length; j++) {
      if (String(ratings[j].hTLocationId) === hTLocations[i].id) {
        usersWRatedHTL.push(ratings[j].userId);
      }
    }
    // console.log(usersWRatedHTL);
    let usersWRatedHTLIndex = []; //users Who Rated HTLocation index
    for (let j = 0; j < usersWRatedHTL.length; j++) {
      for (let k = 0; k < users.length; k++) {
        if (String(usersWRatedHTL[j]) === users[k].id) {
          usersWRatedHTLIndex.push(k);
        }
      }
    }
    // console.log(usersWRatedHTLIndex);
    let uToUSimilarityArray = uToUSimilarityMatrix[index];
    // console.log(uToUSimilarityArray)
    let similarityArrayWusersWRatedHTL = [];
    for (let j = 0; j < uToUSimilarityArray.length; j++) {
      if (usersWRatedHTLIndex.includes(j)) {
        similarityArrayWusersWRatedHTL.push({
          value: uToUSimilarityArray[j],
          index: j,
        });
      }
    }
    console.log(similarityArrayWusersWRatedHTL);
    let numerator = 0;
    let denominator = 0;
    // for (let j = 0; j < similarityArrayWusersWRatedHTL.length; j++)
    // {
    //     numerator += similarityArrayWusersWRatedHTL[j].value * normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
    //     // console.log(numerator);
    //     denominator += similarityArrayWusersWRatedHTL[j].value;
    // }

    similarityArrayWusersWRatedHTL.sort((a, b) => b.value - a.value);
    if (similarityArrayWusersWRatedHTL.length >= 2) {
      for (let j = 0; j < 1; j++) {
        numerator +=
          similarityArrayWusersWRatedHTL[j].value *
          normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
        // console.log(numerator);
        denominator += similarityArrayWusersWRatedHTL[j].value;
      }
    } else {
      for (let j = 0; j < similarityArrayWusersWRatedHTL.length; j++) {
        numerator +=
          similarityArrayWusersWRatedHTL[j].value *
          normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
        // console.log(numerator);
        denominator += similarityArrayWusersWRatedHTL[j].value;
      }
    }
    console.log(similarityArrayWusersWRatedHTL);
    // console.log(numerator);
    // console.log(denominator)
    if (denominator === 0) {
      ratingArray.push(0);
    } else {
      ratingArray.push(
        Math.round(
          numerator / denominator + average(ratingMatrix[index]) * 100
        ) / 100
      );
    }
  }
  console.log(ratingArray);
}


function temp(
    uToUSimilarityMatrix,
    userId,
    users,
    hTLocations,
    ratings,
    normalizedRatingMatrix,
    ratingMatrix
  ) {
    let index;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        index = i;
        break;
      }
    }
    let userRatings = [];
    for (let i = 0; i < ratings.length; i++) {
      if (String(ratings[i].userId) === userId) {
        userRatings.push(ratings[i]);
      }
    }
  
    console.log("index => ", index);
    console.log("userRatings => ", userRatings);
    let ratingArray = [];
    for (let i = 0; i < hTLocations.length; i++) {
      console.log(i);
      // console.log(hTLocations[i])
      let count = 0;
      for (let j = 0; j < userRatings.length; j++) {
        if (hTLocations[i].id === String(userRatings[j].hTLocationId)) {
          ratingArray.push(userRatings[j].rating);
          break;
        }
        count++;
      }
      // console.log(count);
      if (count !== userRatings.length) {
        continue;
      }
      let usersWRatedHTL = []; // users Who Rated HTLocation
      for (let j = 0; j < ratings.length; j++) {
        if (String(ratings[j].hTLocationId) === hTLocations[i].id) {
          usersWRatedHTL.push(ratings[j].userId);
        }
      }
      // console.log(usersWRatedHTL);
      let usersWRatedHTLIndex = []; //users Who Rated HTLocation index
      for (let j = 0; j < usersWRatedHTL.length; j++) {
        for (let k = 0; k < users.length; k++) {
          if (String(usersWRatedHTL[j]) === users[k].id) {
            usersWRatedHTLIndex.push(k);
          }
        }
      }
      // console.log(usersWRatedHTLIndex);
      let uToUSimilarityArray = uToUSimilarityMatrix[index];
      // console.log(uToUSimilarityArray)
      let similarityArrayWusersWRatedHTL = [];
      for (let j = 0; j < uToUSimilarityArray.length; j++) {
        if (usersWRatedHTLIndex.includes(j)) {
          similarityArrayWusersWRatedHTL.push({
            value: uToUSimilarityArray[j],
            index: j,
          });
        }
      }
      console.log(similarityArrayWusersWRatedHTL);
      let numerator = 0;
      let denominator = 0;
      // for (let j = 0; j < similarityArrayWusersWRatedHTL.length; j++)
      // {
      //     numerator += similarityArrayWusersWRatedHTL[j].value * normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
      //     // console.log(numerator);
      //     denominator += similarityArrayWusersWRatedHTL[j].value;
      // }
  
      similarityArrayWusersWRatedHTL.sort((a, b) => b.value - a.value);
      if (similarityArrayWusersWRatedHTL.length >= 2) {
        for (let j = 0; j < 2; j++) {
          numerator +=
            similarityArrayWusersWRatedHTL[j].value *
            normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
          // console.log(numerator);
          denominator += similarityArrayWusersWRatedHTL[j].value;
        }
      } else {
        for (let j = 0; j < similarityArrayWusersWRatedHTL.length; j++) {
          numerator +=
            similarityArrayWusersWRatedHTL[j].value *
            normalizedRatingMatrix[similarityArrayWusersWRatedHTL[j].index][i];
          // console.log(numerator);
          denominator += similarityArrayWusersWRatedHTL[j].value;
        }
      }
      console.log(similarityArrayWusersWRatedHTL);
      // console.log(numerator);
      // console.log(denominator)
      if (denominator === 0) {
        ratingArray.push(0);
      } else {
        ratingArray.push(
          Math.round(
            numerator / denominator + average(ratingMatrix[index]) * 100
          ) / 100
        );
      }
    }
    console.log(ratingArray);
  }

await connectToMongoDB();

let hTLocations = await HTLocation.find({});
let ratings = await Rating.find({});
let users = await User.find({});
// console.log(users);
// console.log(ratings);
// console.log(hTLocations.length);

// let b = _ratingMatrix;
// b[0] = 1;
// console.log(b);
// console.log(_ratingMatrix);

// console.log(average([1,2,undefined, undefined, 3, 4]));

let ratingMatrix = _ratingMatrix(hTLocations, ratings, users);
// console.log("rating matrix", ratingMatrix);
let normalizedRatingMatrix = _normalizedRatingMatrix(ratingMatrix);
// console.log("normalized Rating Matrix", normalizedRatingMatrix);
let uToUSimilarityMatrix = _uToUSimilarityMatrix(normalizedRatingMatrix);
// console.log("uToUSimilarityMatrix", uToUSimilarityMatrix);
_filledRatingMatrix(
  uToUSimilarityMatrix,
  "65abdda926dac5c30cfe7a06",
  users,
  hTLocations,
  ratings,
  normalizedRatingMatrix,
  ratingMatrix
);

// console.log(cosineSimilarity([1,1],[1,2]))

//_ratingMatrix()
//_normalizedRatingMatrix()
//average()
//cosineSimilarity()
//_uToUSimilarityMatrix()
