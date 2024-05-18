import mongoose from "mongoose";

const GalleryEEESchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryEEEModel = mongoose.model("GalleryEEE", GalleryEEESchema)
export default GalleryEEEModel