import mongoose from "mongoose";

const FaqEEESchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqEEEModel = mongoose.model("FaqEEE", FaqEEESchema)
export default FaqEEEModel