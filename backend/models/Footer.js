import mongoose from "mongoose";

const FooterSchema = new mongoose.Schema({
    title: String,
    sociallink1: String,
    sociallink2: String,
    sociallink3: String,
    address: String,
    phonenumber: Number,
    email: String,
    logo: String
})

const FooterModel = mongoose.model("Footer", FooterSchema)
export default FooterModel