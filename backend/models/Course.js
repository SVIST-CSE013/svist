import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String
})

const CourseModel = mongoose.model("Course", CourseSchema)
export default CourseModel