import mongoose from "mongoose";

const AboutEEESchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutEEEModel = mongoose.model("AboutEEE", AboutEEESchema)
export default AboutEEEModel