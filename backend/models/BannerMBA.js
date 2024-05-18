import mongoose from "mongoose";

const BannerMBASchema = new mongoose.Schema({
    title: String,
    description: String,
    backgroundImage: String
})

const BannerMBAModel = mongoose.model("bannerMBA", BannerMBASchema)
export default BannerMBAModel