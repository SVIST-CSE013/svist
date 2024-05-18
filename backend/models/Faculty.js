import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
    fullName: String,
    email: String,
    facultyId: Number,
    designation: String,
    phoneNo: Number,
    address: String,
    academicexp: String,
    department: String,
    gender: String,
    profile: String
})

const FacultyModel = mongoose.model("Faculty", FacultySchema)
export default FacultyModel