import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    minlength: [3, "Job title must be at least 3 characters long"],
    maxlength: [100, "Job title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
  },
  workLocation: {
    city: { type: String, trim: true, required: [true, "City is required"] },
    state: { type: String, trim: true, required: [true, "State is required"] },
    pincode: {
      type: String,
      trim: true,
      required: [true, "Pincode is required"],
      match: [/^\d{6}$/, "Pincode must be a 6-digit number"],
    },
    area: { type: String, trim: true, required: [true, "Area is required"] },
    streetAddress: { type: String, trim: true, required: [true, "Street address is required"] },
    country: { type: String, trim: true, default: "India" }, // Default to India based on pincode API
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
    enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelancing"],
  },
  experienceLevel: {
    type: String, // Changed to String to store decimal like "2.5"
    required: [true, "Experience level is required"],
    match: [/^\d+(\.\d)?$/, "Experience level must be a number (e.g., 2 or 2.5)"],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "Company reference is required"],
  },
  companyName: {
    type: String,
    trim: true,
    required: [true, "Company name is required"],
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  workplacePlane: {
    type: String,
    required: [true, "Workplace type is required"],
   
  },
  jobCategory: {
    type: String,
    required: [true, "Job category is required"],
    enum: [
      "Engineering", "Marketing", "Sales", "Finance", "Human Resources",
      "Design", "Product Management", "Customer Support", "IT", "Operations", "Other",
    ],
    default: "Other",
  },
  skills: [{
    type: String,
    trim: true,
    required: [true, "At least one skill is required"],
  }],
  benefits: [{
    type: String,
    trim: true,
  }],
  salaryRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: {
      type: String,
      
      default: "INR",
    },
    
   
  },
  numberOfPositions: {
    type: Number,
    min: [1, "Number of positions must be at least 1"],
    default: 1,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator reference is required"],
  },
  status: {
    type: String,
    enum: ["Open", "Closed", "Draft", "Expired"],
    default: "Open",
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  }],
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);