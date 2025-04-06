import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["Employees", "recruiter"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiration: { type: Date, default: null },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // URL to resume file
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
