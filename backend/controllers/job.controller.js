import { Job } from "../models/job.model.js";





/// create modify job post funcations

export const postJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      skills,
      benefits,
      salaryRange,
      workLocation,
      jobType,
      experienceLevel,
      workplacePlane,
      jobCategory,
      numberOfPositions,
      companyId,
      companyName,
    } = req.body;

    const userId = req.id;

    // Validate required fields
    const requiredFields = {
      jobTitle,
      jobDescription,
      skills,
      "salaryRange.minSalary": salaryRange?.minSalary,
      "salaryRange.maxSalary": salaryRange?.maxSalary,
      "workLocation.city": workLocation?.city,
      "workLocation.state": workLocation?.state,
      "workLocation.pincode": workLocation?.pincode,
      "workLocation.area": workLocation?.area,
      "workLocation.streetAddress": workLocation?.streetAddress,
      jobType,
      experienceLevel,
      workplacePlane,
      jobCategory,
      numberOfPositions,
      companyId,
      companyName,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === "" || value === null) {
        return res.status(400).json({
          message: `Missing required field: ${field}`,
          success: false,
        });
      }
    }

    // Validate salary range
    if (salaryRange.minSalary >= salaryRange.maxSalary) {
      return res.status(400).json({
        message: "Minimum salary must be less than maximum salary.",
        success: false,
      });
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(workLocation.pincode)) {
      return res.status(400).json({
        message: "Pincode must be a 6-digit number.",
        success: false,
      });
    }

    // Parse comma-separated fields
    const parsedSkills = Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => skill.trim()).filter(Boolean);
    const parsedBenefits = benefits
      ? Array.isArray(benefits)
        ? benefits
        : benefits.split(',').map(benefit => benefit.trim()).filter(Boolean)
      : [];

    // Validate number of positions
    const positions = parseInt(numberOfPositions);
    if (isNaN(positions) || positions < 1) {
      return res.status(400).json({
        message: "Number of positions must be at least 1.",
        success: false,
      });
    }

    const job = await Job.create({
      jobTitle,
      jobDescription,
      skills: parsedSkills,
      benefits: parsedBenefits,
      salaryRange: {
        minSalary: Number(salaryRange.minSalary),
        maxSalary: Number(salaryRange.maxSalary),
        currency: salaryRange.currency || "INR",
        frequency: salaryRange.frequency || "yearly",
      },
      workLocation,
      location: `${workLocation.city}, ${workLocation.state}`, // Backward compatibility
      jobType,
      experienceLevel,
      workplacePlane,
      jobCategory,
      numberOfPositions: positions,
      company: companyId,
      companyName,
      created_by: userId,
      status: "Open",
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed.",
        errors: messages,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      jobTitle,
      jobDescription,
      skills,
      benefits,
      salaryRange,
      workLocation,
      jobType,
      experienceLevel,
      workplacePlane,
      jobCategory,
      numberOfPositions,
      companyId,
      companyName,
      status,
      deadline,
    } = req.body;

    // Build update object, ignoring empty/undefined fields
    const fieldsToUpdate = {};

    const addField = (key, value) => {
      if (value !== undefined && value !== "" && value !== null) {
        fieldsToUpdate[key] = value;
      }
    };

    // Basic fields
    addField("jobTitle", jobTitle);
    addField("jobDescription", jobDescription);
    addField("jobType", jobType);
    addField("experienceLevel", experienceLevel);
    addField("workplacePlane", workplacePlane);
    addField("jobCategory", jobCategory);
    addField("numberOfPositions", numberOfPositions ? Number(numberOfPositions) : undefined);
    addField("company", companyId);
    addField("companyName", companyName);
    addField("status", status);
    addField("deadline", deadline ? new Date(deadline) : undefined);

    // Array fields
    if (skills !== undefined && skills !== "") {
      fieldsToUpdate.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map(skill => skill.trim()).filter(Boolean);
    }
    if (benefits !== undefined && benefits !== "") {
      fieldsToUpdate.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split(",").map(benefit => benefit.trim()).filter(Boolean);
    }

    // Nested field: salaryRange
    if (salaryRange && Object.keys(salaryRange).length > 0) {
      const { minSalary, maxSalary, currency, frequency } = salaryRange;
      const updatedSalaryRange = {};
      if (minSalary !== undefined && minSalary !== "") {
        updatedSalaryRange.minSalary = Number(minSalary);
        if (isNaN(updatedSalaryRange.minSalary) || updatedSalaryRange.minSalary < 0) {
          return res.status(400).json({
            message: "Invalid minimum salary. It must be a positive number.",
            success: false,
          });
        }
      }
      if (maxSalary !== undefined && maxSalary !== "") {
        updatedSalaryRange.maxSalary = Number(maxSalary);
        if (isNaN(updatedSalaryRange.maxSalary) || updatedSalaryRange.maxSalary < 0) {
          return res.status(400).json({
            message: "Invalid maximum salary. It must be a positive number.",
            success: false,
          });
        }
      }
      if (currency !== undefined && currency !== "") updatedSalaryRange.currency = currency;
      if (frequency !== undefined && frequency !== "") updatedSalaryRange.frequency = frequency;

      if (Object.keys(updatedSalaryRange).length > 0) {
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
          return res.status(404).json({
            message: "Job not found.",
            success: false,
          });
        }
        fieldsToUpdate.salaryRange = {
          minSalary: updatedSalaryRange.minSalary ?? existingJob.salaryRange.minSalary,
          maxSalary: updatedSalaryRange.maxSalary ?? existingJob.salaryRange.maxSalary,
          currency: updatedSalaryRange.currency ?? existingJob.salaryRange.currency,
          frequency: updatedSalaryRange.frequency ?? existingJob.salaryRange.frequency,
        };

        if (fieldsToUpdate.salaryRange.minSalary >= fieldsToUpdate.salaryRange.maxSalary) {
          return res.status(400).json({
            message: "Minimum salary must be less than maximum salary.",
            success: false,
          });
        }
      }
    }

    // Nested field: workLocation
    if (workLocation && Object.keys(workLocation).length > 0) {
      const { city, state, pincode, area, streetAddress } = workLocation;
      const updatedWorkLocation = {};
      if (city !== undefined && city !== "") updatedWorkLocation.city = city;
      if (state !== undefined && state !== "") updatedWorkLocation.state = state;
      if (pincode !== undefined && pincode !== "") {
        updatedWorkLocation.pincode = pincode;
        if (!/^\d{6}$/.test(pincode)) {
          return res.status(400).json({
            message: "Pincode must be a 6-digit number.",
            success: false,
          });
        }
      }
      if (area !== undefined && area !== "") updatedWorkLocation.area = area;
      if (streetAddress !== undefined && streetAddress !== "") updatedWorkLocation.streetAddress = streetAddress;

      if (Object.keys(updatedWorkLocation).length > 0) {
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
          return res.status(404).json({
            message: "Job not found.",
            success: false,
          });
        }
        fieldsToUpdate.workLocation = {
          city: updatedWorkLocation.city ?? existingJob.workLocation.city,
          state: updatedWorkLocation.state ?? existingJob.workLocation.state,
          pincode: updatedWorkLocation.pincode ?? existingJob.workLocation.pincode,
          area: updatedWorkLocation.area ?? existingJob.workLocation.area,
          streetAddress: updatedWorkLocation.streetAddress ?? existingJob.workLocation.streetAddress,
        };
        fieldsToUpdate.location = `${fieldsToUpdate.workLocation.city}, ${fieldsToUpdate.workLocation.state}`;
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update.",
        success: false,
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateJob:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed.",
        errors: messages,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};




// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}


// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}




































export const adminGetJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: 'applications',
                populate: {
                    path: 'applicant',  // Populate the applicant details
                    select: 'fullname email phoneNumber role profile' // Select only necessary fields
                }
            })
            .populate('company') // Optionally populate company details if needed
            .populate('created_by'); // Optionally populate the job creator's details

        // If no job is found, return a 404 error
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Error retrieving job with applications:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
