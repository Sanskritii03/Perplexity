import mongoose from "mongoose";


async function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    await console.log('connected to mongo databse');
    
}

export default connectToDB