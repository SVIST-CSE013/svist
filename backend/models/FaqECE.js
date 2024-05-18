import mongoose from "mongoose";

const FaqECESchema = new mongoose.Schema({
    question: String,
    answer: String,
})

const FaqECEModel = mongoose.model("FaqECE", FaqECESchema)
export default FaqECEModel