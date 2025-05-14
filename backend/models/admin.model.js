import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["admin"],
        default: "admin",
        required: true,
      },
    },
    { timestamps: true }
  );

export const Admin = mongoose.model("Admin", adminSchema);