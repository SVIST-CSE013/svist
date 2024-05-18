import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    message: String
})

const EnquiryModel = mongoose.model("Enquiry", EnquirySchema)
export default EnquiryModel