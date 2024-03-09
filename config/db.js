import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(console.log('db connected')
        )
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB