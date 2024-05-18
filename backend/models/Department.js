import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    id: Number,
    deptname: String,
    hodname: String,
    studentsno: Number
})

const DepartmentModel = mongoose.model("Department", DepartmentSchema)
export default DepartmentModel