import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/Stk")
        .then(console.log('db connected')
        )
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB