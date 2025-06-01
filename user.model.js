// app/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    address: { type: String },
    dateofbirth: { type: Date },
    phonenumber: { type: String },
    socialmedia: { type: String },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],

    // Student-specific
    degree: { type: String },
    educationLevel: { type: String },
    major: { type: String },
    academicYear: { type: String },
    studentCV: { type: String },

    // Teacher-specific
    specialization: { type: String },
    experience: { type: String },
    teacherCV: { type: String },
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;