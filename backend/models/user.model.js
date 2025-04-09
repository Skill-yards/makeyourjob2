import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
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
            message: props => `${props.value} is not a valid email!`
        }
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter'],
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        required: false
    },
    otpExpiration: {
        type: Date,
        required: false
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        organization: {
            type: String,
            required: false
        },
        jobRole: {
            type: String,
            required: false
        }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);