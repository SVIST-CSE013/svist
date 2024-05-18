import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    enrollmentNo: Number,
    fullName: String,
    department: String,
    semester: String,
    subject: String,
    date: String,
    attendance: String
})

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema)
export default AttendanceModel

