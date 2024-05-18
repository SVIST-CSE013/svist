import mongoose from "mongoose";

const BannerCESchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerCEModel = mongoose.model("bannerCE", BannerCESchema)
export default BannerCEModel