import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
    name: String,
    email: String,
    userid: String,
    password: String,
    role: String,
    profile: String,
    department: String
})

const LoginModel = mongoose.model("Logins", LoginSchema)
export default LoginModel