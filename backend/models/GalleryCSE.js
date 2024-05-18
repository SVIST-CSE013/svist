import mongoose from "mongoose";

const GalleryCSESchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryCSEModel = mongoose.model("GalleryCSE", GalleryCSESchema)
export default GalleryCSEModel