import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        .then(console.log('db connected')
        )
    } catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB