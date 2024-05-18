import mongoose from "mongoose";

const FaqCSESchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqCSEModel = mongoose.model("Faq", FaqCSESchema)
export default FaqCSEModel