import mongoose from "mongoose";

const AboutCESchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutCEModel = mongoose.model("AboutCE", AboutCESchema)
export default AboutCEModel