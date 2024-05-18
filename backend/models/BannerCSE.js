import mongoose from "mongoose";

const BannerCSESchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerCSEModel = mongoose.model("bannercse", BannerCSESchema)
export default BannerCSEModel