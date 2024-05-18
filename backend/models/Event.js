import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    start: String,
    end: String
})

const EventModel = mongoose.model("Event", EventSchema)
export default EventModel