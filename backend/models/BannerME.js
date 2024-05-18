import mongoose from "mongoose";

const BannerMESchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerMEModel = mongoose.model("bannerME", BannerMESchema)
export default BannerMEModel