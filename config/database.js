import mongoose from "mongoose";

export const startServer = async (app, PORT = 8000) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`server started at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
