import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    isbnNo: String,
    title: String,
    description: String,
    department: String,
    author: String,
    status: String,
    bookimg: String,
})

const BookModel = mongoose.model("Book", BookSchema)
export default BookModel