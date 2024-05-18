import mongoose from "mongoose";

const FaqMESchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqMEModel = mongoose.model("FaqME", FaqMESchema)
export default FaqMEModel