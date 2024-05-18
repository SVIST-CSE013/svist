import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
    fullName: String,
    enrollmentNo: Number,
    email: String,
    phone: Number,
    department: String,
    semester: String,
    password: String,
})

const LibraryModel = mongoose.model("Library", LibrarySchema)
export default LibraryModel