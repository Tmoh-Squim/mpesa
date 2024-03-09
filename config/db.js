import mongoose from "mongoose"

const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      });
  };

export default connectDB