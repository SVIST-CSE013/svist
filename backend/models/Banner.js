import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerModel = mongoose.model("banners", BannerSchema)
export default BannerModel