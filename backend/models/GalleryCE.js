import mongoose from "mongoose";

const GalleryCESchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryCEModel = mongoose.model("GalleryCE", GalleryCESchema)
export default GalleryCEModel