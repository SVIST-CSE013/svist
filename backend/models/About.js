import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
})

const AboutModel = mongoose.model("About", AboutSchema)
export default AboutModel