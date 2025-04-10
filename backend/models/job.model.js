import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  // Existing Fields (Updated/Refined)
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  salary: { // Kept for backward compatibility, but see salaryRangeDiversity below
    type: String,
    required: [true, "Salary is required"],
  },
  experienceLevel: {
    type: String,
    required: [true, "Experience level is required"],
    enum: ["Entry", "Junior", "Mid", "Senior", "Lead", "Expert"],
    default: "Entry",
  },
  location: { // Kept for backward compatibility, see workLocation below
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
    enum: ["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Freelance"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "Company reference is required"],
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

  // New Fields Requested
  companyName: { // Redundant with 'company' ref, but added for convenience
    type: String,
    trim: true,
    required: [true, "Company name is required"],
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  jobTitle: { // Similar to 'title', but kept separate if you want distinction
    type: String,
    trim: true,
    required: [true, "Job title is required"],
    maxlength: [100, "Job title cannot exceed 100 characters"],
  },
  jobNature: { // e.g., Permanent, Temporary, Seasonal
    type: String,
    required: [true, "Job nature is required"],
    enum: ["Permanent", "Temporary", "Seasonal", "Project-Based"],
    default: "Permanent",
  },
  workplacePlane: { // Assuming this means workplace type (e.g., Remote, On-site)
    type: String,
    required: [true, "Workplace type is required"],
    enum: ["Remote", "On-site", "Hybrid"],
    default: "On-site",
  },
  workLocation: { // More detailed than 'location', e.g., city, state, country
    type: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, required: true },
    },
    required: [true, "Work location is required"],
  },
  jobCategory: { // e.g., Engineering, Marketing, Sales
    type: String,
    required: [true, "Job category is required"],
    enum: [
      "Engineering", "Marketing", "Sales", "Finance", "Human Resources",
      "Design", "Product Management", "Customer Support", "IT", "Operations",
      "Other",
    ],
    default: "Other",
  },
  skills: [{
    type: String,
    trim: true,
    required: [true, "At least one skill is required"],
  }],
  availabilityFrame: { // e.g., start date or timeframe for availability
    type: {
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date },
    },
    required: [true, "Availability frame is required"],
  },
  salaryRangeDiversity: { // More flexible than 'salary' field
    type: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "USD", enum: ["USD", "INR", "EUR", "GBP"] },
      frequency: { type: String, default: "yearly", enum: ["hourly", "monthly", "yearly"] },
    },
    required: [true, "Salary range is required"],
  },

  // Additional Suggested Fields
  status: { // Job posting status
    type: String,
    enum: ["Open", "Closed", "Draft", "Expired"],
    default: "Draft",
  },
  postedDate: { // When the job was posted
    type: Date,
    default: Date.now,
  },
  deadline: { // Application deadline
    type: Date,
  },
  vacancies: { // Number of open positions
    type: Number,
    min: [1, "Vacancies must be at least 1"],
    default: 1,
  },
  benefits: [{ // e.g., Health Insurance, Paid Leave
    type: String,
    trim: true,
  }],
  educationLevel: { // Minimum education required
    type: String,
    enum: ["High School", "Bachelor", "Master", "PhD", "Other"],
  },
  keywords: [{ // For search optimization
    type: String,
    trim: true,
  }],
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);