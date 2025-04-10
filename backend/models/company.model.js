import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Invalid website URL'], // Basic URL validation
  },
  location: {
    type: String,
  },
  logo: {
    type: String, // URL to company logo
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gstNumber: {
    type: String,
    required: false,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'],
  },
  cinNumber: {
    type: String,
    required: false,
    trim: true,
    match: [/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, 'Invalid CIN number format'],
  },
  gstDocument: {
    type: String, // URL to GST document
    required: false,
  },
  cinDocument: {
    type: String, // URL to CIN document
    required: false,
  },
  panNumber: {
    type: String,
    required: false,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'], // Indian PAN format (e.g., ABCDE1234F)
  },
  panDocument: {
    type: String, // URL to PAN document
    required: false,
  },
  foundedYear: {
    type: Number,
    required: false,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
  },
  employeeCount: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: false,
  },
  industry: {
    type: String,
    required: false,
    trim: true,
  },
  contactEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
  },
  contactPhone: {
    type: String,
    required: false,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'], // Basic international phone number validation
  },
  registrationDocument: {
    type: String, // URL to company registration certificate
    required: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);