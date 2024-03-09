import mongoose from "mongoose"
import "dotenv/config"
const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      });
  };

export default connectDB