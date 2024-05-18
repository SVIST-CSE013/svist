import mongoose from "mongoose";

const GalleryMESchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryMEModel = mongoose.model("GalleryME", GalleryMESchema)
export default GalleryMEModel