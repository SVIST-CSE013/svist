import mongoose from "mongoose";

const FaqCESchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqCEModel = mongoose.model("FaqCE", FaqCESchema)
export default FaqCEModel