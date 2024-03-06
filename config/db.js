import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://timoohwilliams885:tmohsquim123@cluster0.w6myph1.mongodb.net/Stk")
        .then(console.log('db connected')
        )
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB