import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
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
    phoneNumber: {
      type: String, // Changed to String to support formats like "+1234567890"
      required: true, // Made required to match API
      trim: true,
    },
    password: {
      type: String,
      required: true, // Made required to match API
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter","admin"],
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true, // Set to true to match API behavior
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiration: {
      type: Date,
      required: false,
    },
    profile: {
      bio: { type: String, default: "" },
      skills: [{ type: String }], 
      resume: { type: String }, 
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: { type: String, default: "" },
      organization: { type: String, default: "" },
      jobRole: { type: String, default: "" },
      employment: [
        {
          isCurrentEmployment: { type: Boolean, default: false },
          employmentType: {
            type: String,
            enum: ["Full-time", "Internship"],
            required: true,
          },
          totalExperienceYears: { type: Number, required: true },
          totalExperienceMonths: { type: Number, required: true },
          companyName: { type: String, required: true, trim: true },
          endingDateYear: { type: Number, required: false },
          endingDateMonth: { type: String, required: false }, // Made optional to match API
          jobTitle: { type: String, required: true, trim: true },
          joiningDateYear: { type: Number, required: true },
          joiningDateMonth: {
            type: String,
            enum: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            required: true,
          },
          salary: { type: Number, required: false },
          skillsUsed: [{ type: String }],
          jobProfile: { type: String, required: false },
          noticePeriod: { type: String, required: false },
        },
      ],
      education: [
        {
          educationLevel: { type: String, required: true, trim: true },
          university: { type: String, required: true, trim: true },
          course: { type: String, required: true, trim: true },
          specialization: { type: String, required: true, trim: true },
          courseType: {
            type: String,
            enum: ["Full time", "Part time"],
            required: true,
          },
          startingYear: { type: Number, required: true },
          endingYear: { type: Number, required: true },
          gradingSystem: { type: String, required: true, trim: true },
        },
      ],
      projects: [
        {
          projectTitle: { type: String, required: true, trim: true },
          tagInstitution: { type: String, required: true, trim: true },
          client: { type: String, required: true, trim: true },
          projectStatus: {
            type: String,
            enum: ["In progress", "Finished"],
            required: true,
          },
          workedFromYear: { type: Number, required: true },
          workedFromMonth: {
            type: String,
            enum: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            required: true,
          },
          endingDateMonth: { type: String, required: false }, // Made optional to match API
          details: { type: String, required: false },
        },
      ],
      onlineProfiles: [
        {
          socialProfileName: { type: String, required: true, trim: true },
          url: { type: String, required: true, trim: true },
          description: { type: String, required: false },
        },
      ],
      certificates: [
        {
          certificateName: { type: String, required: true, trim: true },
          issuingOrganization: { type: String, required: true, trim: true },
          issueDate: { type: Date, required: false },
          credentialId: { type: String, required: false },
          credentialUrl: { type: String, required: false },
        },
      ],
    },
    subscription: {
      isSubscribed: {
        type: Boolean,
        default: false,
      },
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);