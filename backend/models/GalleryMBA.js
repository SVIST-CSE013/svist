import mongoose from "mongoose";

const GalleryMBASchema = new mongoose.Schema({
    name: String,
    alttext: String,
    image: String,
})

const GalleryMBAModel = mongoose.model("GalleryMBA", GalleryMBASchema)
export default GalleryMBAModel