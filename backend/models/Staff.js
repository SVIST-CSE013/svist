import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    staffId: Number,
    phoneNo: Number,
    address: String,
    gender: String,
    profile: String
})

const StaffModel = mongoose.model("Staff", StaffSchema)
export default StaffModel