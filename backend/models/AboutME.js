import mongoose from "mongoose";

const AboutMESchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutMEModel = mongoose.model("AboutME", AboutMESchema)
export default AboutMEModel