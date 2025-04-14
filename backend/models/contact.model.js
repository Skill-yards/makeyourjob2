import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model("Consultation", consultationSchema);
