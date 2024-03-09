import mongoose from "mongoose"

const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      });
  };

export default connectDB