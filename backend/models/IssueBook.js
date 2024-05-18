import mongoose from "mongoose";

const IssueBookSchema = new mongoose.Schema({
    isbnNo: String,
    book: String,
    fullName: String,
    enrollmentNo: Number,
    email: String,
    department: String,
    semester: String,
    issued: String,
    due: String,
    returnDate: String,
    status: String,
})

const IssueBookModel = mongoose.model("IssueBook", IssueBookSchema)
export default IssueBookModel