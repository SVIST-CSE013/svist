import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String,
    date: String,
    file: String,
    timestamp: { type: Date, default: Date.now }
})

const NoticeModel = mongoose.model("Notice", NoticeSchema)
export default NoticeModel