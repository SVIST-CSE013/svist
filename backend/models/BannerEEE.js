import mongoose from "mongoose";

const BannerEEESchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerEEEModel = mongoose.model("bannerEEE", BannerEEESchema)
export default BannerEEEModel