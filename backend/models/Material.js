import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
    title: String,
    department: String,
    semester: String,
    subject: String,
    description: String,
    file: String,
    faculty: String,
    date: String
})

const MaterialModel = mongoose.model("Material", MaterialSchema)
export default MaterialModel