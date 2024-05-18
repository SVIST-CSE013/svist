import mongoose from "mongoose";

const AboutMBASchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutMBAModel = mongoose.model("AboutMBA", AboutMBASchema)
export default AboutMBAModel