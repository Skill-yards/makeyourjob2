import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return v ? /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v) : true;
            },
            message: props => `${props.value} is not a valid website URL!`
        }
    },
    location: {
        type: String
    },
    logo: {
        type: String // URL to company logo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    verification: {
        gstNumber: {
            type: String,
            unique: true,
            sparse: true, // Allows null values while maintaining uniqueness
            trim: true,
            match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'] // Basic GST format validation (India)
        },
        crnCertificate: {
            type: String, // URL to CRN certificate document
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    }
}, { timestamps: true });

companySchema.index({ 'verification.gstNumber': 1 }, { unique: true, sparse: true });

export const Company = mongoose.model("Company", companySchema);