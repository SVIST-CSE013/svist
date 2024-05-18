import mongoose from "mongoose";

const AboutCSESchema = new mongoose.Schema({
    title: String,
    description: String,
    image1: String,
    image2: String
})

const AboutCSEModel = mongoose.model("AboutCSE", AboutCSESchema)
export default AboutCSEModel