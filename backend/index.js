import express, { json } from "express";
import { port } from "./src/config/config.js";
import cors from "cors";
import userRouter from "./src/router/userRouter.js";
import connectToMongoDB from "./src/connectToDB/connectToMongoDB.js";
import ratingRouter from "./src/router/ratingRouter.js";
import hTLocationRouter from "./src/router/hTLocationRouter.js";
import wishListRouter from "./src/router/wishListRouter.js";
import attributeRouter from "./src/router/attributeRouter.js";

connectToMongoDB();
let app = express();
app.use(cors());
app.use(json());

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

app.use("/users", userRouter);
app.use("/hTLocations", hTLocationRouter);
app.use("/ratings", ratingRouter);
app.use("/wishLists", wishListRouter);
app.use("/attributes", attributeRouter)
