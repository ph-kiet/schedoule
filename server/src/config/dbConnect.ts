import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}?authSource=${process.env.MONGO_USER}`;
    const connect = await mongoose.connect(mongoUri);
    console.log(`Database connected: ${connect.connection.name}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default dbConnect;
