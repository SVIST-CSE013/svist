import mongoose from "mongoose";

const FaqMBASchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqMBAModel = mongoose.model("FaqMBA", FaqMBASchema)
export default FaqMBAModel