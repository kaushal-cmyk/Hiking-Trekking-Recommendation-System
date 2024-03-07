import connectToMongoDB from "./src/connectToDB/connectToMongoDB.js";
import { HTLocation, Rating, User } from "./src/schema/model.js";
import bcrypt from "bcrypt";

await connectToMongoDB();

// console.log("hello")

async function randomUsers(n) {
  for (let i = 0; i < n; i++) {
    let userNo = `${new Date().getTime()}.${
      Math.round(Math.random() * 1000) % n
    }`;
    let user = {
      firstName: `firstName-${userNo}`,
      lastName: `lastName-${userNo}`,
      email: `testing${userNo}@email.com`,
      password: await bcrypt.hash("12345", 10),
      address: `address-${userNo}`,
      dob: new Date().toLocaleDateString(),
      gender: Math.round(Math.random() * 1000) % 2 === 1 ? "male" : "female",
      isVerifiedEmail: true,
    };
    // console.log(user);
    await User.create(user);
  }
}

// let n = 100
// console.log(Math.round((Math.random()*1000))%100)

// let a = new Date();
// console.log(a.toLocaleDateString())

// randomUsers(5);

async function randomRatings() {
  let users = await User.find({});
  let hTLocations = await HTLocation.find({});
  let randomArray = new Array(100);
  let count = 1;
  for (let i = 0; i < 40; i++) {
    let randNum = Math.round(Math.random() * 100);
    randomArray[randNum] = count;
    count++;
  }
  console.log(randomArray);
  //   let rating = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < hTLocations.length; j++) {
      let randNum = Math.round(Math.random() * 100);
      console.log(randomArray[randNum]);
      if (randomArray[randNum]) {
        let r = Math.round(Math.random() * 100) % 6;
        if (r === 0) {
          continue;
        }
        // rating.push(r);
        await Rating.create({
          userId: users[i]._id,
          hTLocationId: hTLocations[j]._id,
          rating: r,
          review: ""
        });
      }
    }
  }
  //   console.log(rating)
}

// console.log(Math.round((Math.random()*100)))

// console.log(randomArray);


// await randomUsers(10);
// await randomRatings();
