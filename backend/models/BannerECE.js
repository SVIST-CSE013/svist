import mongoose from "mongoose";

const BannerECESchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerECEModel = mongoose.model("bannerECE", BannerECESchema)
export default BannerECEModel