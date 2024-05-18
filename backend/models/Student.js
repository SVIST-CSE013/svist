import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    fullName: String,
    guardianName: String,
    email: String,
    enrollmentNo: Number,
    phoneNo: Number,
    address: String,
    department: String,
    semester: String,
    gender: String,
    profile: String
})

const StudentModel = mongoose.model("Student", StudentSchema)
export default StudentModel