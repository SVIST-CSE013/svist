import mongoose from "mongoose";

const ShowEventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    file: String
})

const ShowEventModel = mongoose.model("ShowEvent", ShowEventSchema)
export default ShowEventModel