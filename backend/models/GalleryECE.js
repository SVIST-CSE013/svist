import mongoose from "mongoose";

const GalleryECESchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryECEModel = mongoose.model("GalleryECE", GalleryECESchema)
export default GalleryECEModel