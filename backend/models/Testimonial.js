import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
    name: String,
    designation: String,
    description: String,
    profileimage: String
})

const TestimonialModel = mongoose.model("Testimonial", TestimonialSchema)
export default TestimonialModel