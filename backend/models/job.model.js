
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    minlength: [3, "Job title must be at least 3 characters long"],
    maxlength: [100, "Job title cannot exceed 100 characters"],
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
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
    type: {
      minSalary: { type: Number, required: true, min: 0 },
      maxSalary: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR", enum: ["INR", "USD", "EUR", "GBP"] },
      frequency: { type: String, default: "yearly", enum: ["hourly", "monthly", "yearly"] },
    },
    required: [true, "Salary range is required"],
  },
  workLocation: {
    type: {
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      pincode: { type: String, trim: true, required: true, match: [/^\d{6}$/, "Pincode must be a 6-digit number"] },
      area: { type: String, trim: true, required: true },
      streetAddress: { type: String, trim: true, required: true },
    },
    required: [true, "Work location is required"],
  },
  location: { // Backward compatibility
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
    enum: ["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Freelance"],
  },
  experienceLevel: {
    type: String,
    required: [true, "Experience level is required"],
    enum: ["Entry", "Junior", "Mid", "Senior", "Lead", "Expert"],
    default: "Entry",
  },
  workplacePlane: {
    type: String,
    required: [true, "Workplace type is required"],
    enum: ["Remote", "On-site", "Hybrid"],
    default: "On-site",
  },
  jobCategory: {
    type: String,
    required: [true, "Job category is required"],
    enum: [
      "Engineering", "Marketing", "Sales", "Finance", "Human Resources",
      "Design", "Product Management", "Customer Support", "IT", "Operations",
      "Other",
    ],
    default: "Other",
  },
  numberOfPositions: {
    type: Number,
    required: [true, "Number of positions is required"],
    min: [1, "Number of positions must be at least 1"],
    default: 1,
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
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator reference is required"],
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  }],
  status: {
    type: String,
    enum: ["Open", "Closed", "Draft", "Expired"],
    default: "Draft",
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);