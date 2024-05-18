import mongoose from "mongoose";

const AboutECESchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutECEModel = mongoose.model("AboutECE", AboutECESchema)
export default AboutECEModel