import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const url = process.env.database_url + process.env.db

//below link only for testing, because above link not connected me, please make comment this link
// export const url = `mongodb://${process.env.database_username}:${process.env.database_password}@ac-7risazb-shard-00-00.57koacr.mongodb.net:27017,ac-7risazb-shard-00-01.57koacr.mongodb.net:27017,ac-7risazb-shard-00-02.57koacr.mongodb.net:27017/eflow?ssl=true&replicaSet=atlas-12fb2n-shard-0&authSource=admin&retryWrites=true&w=majority&appName=eflow-project.emern` 

const conenctionOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

mongoose
  .connect(url, conenctionOptions)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err);
  });

export default mongoose.connection;
