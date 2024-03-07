import mongoose from "mongoose"
import { db_url } from "../config/config.js"


let connectToMongoDB = async () => {
    try {
        await mongoose.connect(db_url)
        console.log(`Application successfully connected to mongodb with url: ${db_url}`);

    }
    catch (error)
    {
        console.log(error.message);
    }
};

export default connectToMongoDB;