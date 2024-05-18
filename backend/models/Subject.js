import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    subcode: String,
    subname: String,
    deptname: String,
    semester: String,
    faculty: String,
    lectures: Number
})

const SubjectModel = mongoose.model("Subject", SubjectSchema)
export default SubjectModel