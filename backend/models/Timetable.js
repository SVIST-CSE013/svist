import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
    title: String,
    department: String,
    semester: String,
    file: String,
    date: String
})

const TimetableModel = mongoose.model("Timetable", TimetableSchema)
export default TimetableModel