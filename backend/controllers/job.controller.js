import { Job } from "../models/job.model.js";

// export const postJob = async (req, res) => {
//   try {
//     const {
//       jobTitle,
//       description,
//       requirements,
//       salaryRangeDiversity,
//       workLocation,
//       jobType,
//       experienceLevel,
//       position,
//       companyId,
//       companyName,
//       jobNature,
//       workplacePlane,
//       jobCategory,
//       skills,
//       availabilityFrame,
//       benefits,
//     } = req.body;

//     const userId = req.id;

//     // Validate required fields
//     const requiredFields = {
//       jobTitle,
//       description,
//       requirements,
//       "salaryRangeDiversity.min": salaryRangeDiversity?.min,
//       "salaryRangeDiversity.max": salaryRangeDiversity?.max,
//       "workLocation.country": workLocation?.country,
//       jobType,
//       experienceLevel,
//       position,
//       companyId,
//       companyName,
//       jobNature,
//       workplacePlane,
//       jobCategory,
//       skills,
//       "availabilityFrame.startDate": availabilityFrame?.startDate,
//     };

//     for (const [field, value] of Object.entries(requiredFields)) {
//       if (!value) {
//         return res.status(400).json({
//           message: `Missing required field: ${field}`,
//           success: false,
//         });
//       }
//     }

//     // Parse comma-separated fields into arrays
//     const parsedRequirements = Array.isArray(requirements)
//       ? requirements
//       : requirements.split(',').map((req) => req.trim()).filter(Boolean);
//     const parsedSkills = Array.isArray(skills)
//       ? skills
//       : skills.split(',').map((skill) => skill.trim()).filter(Boolean);
//     const parsedBenefits = benefits
//       ? Array.isArray(benefits)
//         ? benefits
//         : benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean)
//       : [];

//     // Additional validation
//     if (salaryRangeDiversity.min >= salaryRangeDiversity.max) {
//       return res.status(400).json({
//         message: "Minimum salary must be less than maximum salary.",
//         success: false,
//       });
//     }

//     const job = await Job.create({
//       title: jobTitle, // Backward compatibility
//       jobTitle,
//       description,
//       requirements: parsedRequirements,
//       salary: `${salaryRangeDiversity.min} - ${salaryRangeDiversity.max} ${salaryRangeDiversity.currency}`, // Legacy field
//       salaryRangeDiversity,
//       location: `${workLocation.city}, ${workLocation.state}, ${workLocation.country}`, // Legacy field
//       workLocation,
//       jobType,
//       experienceLevel,
//       position,
//       company: companyId,
//       companyName,
//       created_by: userId,
//       jobNature,
//       workplacePlane,
//       jobCategory,
//       skills: parsedSkills,
//       availabilityFrame,
//       benefits: parsedBenefits,
//       status: "Open", // Default status
//     });

//     return res.status(201).json({
//       message: "New job created successfully.",
//       job,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error posting job:", error);
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((err) => err.message);
//       return res.status(400).json({
//         message: "Validation failed.",
//         errors: messages,
//         success: false,
//       });
//     }
//     return res.status(500).json({
//       message: "Internal server error.",
//       success: false,
//     });
//   }
// };

// student k liye






export const postJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      workLocation,
      jobType,
      experienceLevel,
      companyId,
      companyName,
      workplacePlane,
      jobCategory,
      skills,
      benefits,
      salaryRange,
      numberOfPositions,
    } = req.body;

    const userId = req.id; // Assuming req.id is set by authentication middleware

    // Validate required fields
    const requiredFields = {
      jobTitle,
      jobDescription,
      "workLocation.city": workLocation?.city,
      "workLocation.state": workLocation?.state,
      "workLocation.pincode": workLocation?.pincode,
      "workLocation.area": workLocation?.area,
      "workLocation.streetAddress": workLocation?.streetAddress,
      jobType,
      experienceLevel,
      companyId,
      companyName,
      workplacePlane,
      jobCategory,
      skills,
      numberOfPositions,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          message: `Missing required field: ${field}`,
          success: false,
        });
      }
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(workLocation.pincode)) {
      return res.status(400).json({
        message: "Pincode must be a 6-digit number",
        success: false,
      });
    }

    // Validate experienceLevel format
    if (!/^\d+(\.\d)?$/.test(experienceLevel)) {
      return res.status(400).json({
        message: "Experience level must be a number (e.g., 2 or 2.5)",
        success: false,
      });
    }

    // Validate numberOfPositions
    const positions = parseInt(numberOfPositions);
    if (isNaN(positions) || positions < 1) {
      return res.status(400).json({
        message: "Number of positions must be at least 1",
        success: false,
      });
    }

    // Parse comma-separated fields
    const parsedSkills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    if (parsedSkills.length === 0) {
      return res.status(400).json({
        message: "At least one skill is required",
        success: false,
      });
    }

    const parsedBenefits = benefits
      ? Array.isArray(benefits)
        ? benefits
        : benefits.split(",").map((benefit) => benefit.trim()).filter(Boolean)
      : [];

    // Validate salaryRange if provided
    let formattedSalaryRange = {};
    if (salaryRange && (salaryRange.minSalary || salaryRange.maxSalary)) {
      const min = parseFloat(salaryRange.minSalary);
      const max = parseFloat(salaryRange.maxSalary);
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        return res.status(400).json({
          message: "Invalid salary range: min must be less than or equal to max and both non-negative",
          success: false,
        });
      }
      formattedSalaryRange = {
        min: min,
        max: max,
        currency: "INR", // Default based on component context
        frequency: "yearly",
      };
    }

    // Create job document
    const job = await Job.create({
      jobTitle,
      description: jobDescription,
      workLocation: {
        city: workLocation.city,
        state: workLocation.state,
        pincode: workLocation.pincode,
        area: workLocation.area,
        streetAddress: workLocation.streetAddress,
        country: "India", // Default based on pincode API
      },
      jobType,
      experienceLevel,
      company: companyId,
      companyName,
      workplacePlane,
      jobCategory,
      skills: parsedSkills,
      benefits: parsedBenefits,
      salaryRange: formattedSalaryRange.min ? formattedSalaryRange : undefined,
      numberOfPositions: positions,
      created_by: userId,
      status: "Open",
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



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



// export const updateJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;

//     console.log("Request body:", req.body);

//     // Filter out empty or undefined fields and build the update object
//     const fieldsToUpdate = {};

//     // Destructure all possible fields from req.body
//     const {
//       jobTitle,
//       description,
//       requirements,
//       salaryRangeDiversity,
//       workLocation,
//       jobType,
//       experienceLevel,
//       position,
//       companyId,
//       companyName,
//       jobNature,
//       workplacePlane,
//       jobCategory,
//       skills,
//       availabilityFrame,
//       benefits,
//       status,
//       deadline,
//       vacancies,
//       educationLevel,
//       keywords,
//     } = req.body;

//     // Helper function to add field to update object if defined
//     const addField = (key, value) => {
//       if (value !== "" && value !== undefined) {
//         fieldsToUpdate[key] = value;
//       }
//     };

//     // Basic fields
//     addField("jobTitle", jobTitle);
//     addField("title", jobTitle); // Backward compatibility
//     addField("description", description);
//     addField("jobType", jobType);
//     addField("experienceLevel", experienceLevel);
//     addField("position", position);
//     addField("company", companyId); // Use companyId as company reference
//     addField("companyName", companyName);
//     addField("jobNature", jobNature);
//     addField("workplacePlane", workplacePlane);
//     addField("jobCategory", jobCategory);
//     addField("status", status);
//     addField("deadline", deadline ? new Date(deadline) : undefined);
//     addField("vacancies", vacancies ? Number(vacancies) : undefined);
//     addField("educationLevel", educationLevel);

//     // Array fields (comma-separated strings or arrays)
//     if (requirements !== "" && requirements !== undefined) {
//       fieldsToUpdate.requirements = Array.isArray(requirements)
//         ? requirements
//         : requirements.split(",").map((req) => req.trim()).filter(Boolean);
//     }
//     if (skills !== "" && skills !== undefined) {
//       fieldsToUpdate.skills = Array.isArray(skills)
//         ? skills
//         : skills.split(",").map((skill) => skill.trim()).filter(Boolean);
//     }
//     if (benefits !== "" && benefits !== undefined) {
//       fieldsToUpdate.benefits = Array.isArray(benefits)
//         ? benefits
//         : benefits.split(",").map((benefit) => benefit.trim()).filter(Boolean);
//     }
//     if (keywords !== "" && keywords !== undefined) {
//       fieldsToUpdate.keywords = Array.isArray(keywords)
//         ? keywords
//         : keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean);
//     }

//     // Nested field: salaryRangeDiversity
//     if (salaryRangeDiversity && Object.keys(salaryRangeDiversity).length > 0) {
//       const { min, max, currency, frequency } = salaryRangeDiversity;
//       const updatedSalaryRange = {};
//       if (min !== "" && min !== undefined) {
//         updatedSalaryRange.min = Number(min);
//         if (isNaN(updatedSalaryRange.min) || updatedSalaryRange.min < 0) {
//           return res.status(400).json({
//             message: "Invalid minimum salary. It must be a positive number.",
//             success: false,
//           });
//         }
//       }
//       if (max !== "" && max !== undefined) {
//         updatedSalaryRange.max = Number(max);
//         if (isNaN(updatedSalaryRange.max) || updatedSalaryRange.max < 0) {
//           return res.status(400).json({
//             message: "Invalid maximum salary. It must be a positive number.",
//             success: false,
//           });
//         }
//       }
//       if (currency !== "" && currency !== undefined) updatedSalaryRange.currency = currency;
//       if (frequency !== "" && frequency !== undefined) updatedSalaryRange.frequency = frequency;

//       if (Object.keys(updatedSalaryRange).length > 0) {
//         fieldsToUpdate.salaryRangeDiversity = {
//           ...updatedSalaryRange,
//           min: updatedSalaryRange.min ?? (await Job.findById(jobId)).salaryRangeDiversity.min,
//           max: updatedSalaryRange.max ?? (await Job.findById(jobId)).salaryRangeDiversity.max,
//           currency: updatedSalaryRange.currency ?? (await Job.findById(jobId)).salaryRangeDiversity.currency,
//           frequency: updatedSalaryRange.frequency ?? (await Job.findById(jobId)).salaryRangeDiversity.frequency,
//         };

//         // Validate min < max
//         if (fieldsToUpdate.salaryRangeDiversity.min >= fieldsToUpdate.salaryRangeDiversity.max) {
//           return res.status(400).json({
//             message: "Minimum salary must be less than maximum salary.",
//             success: false,
//           });
//         }

//         // Backward compatibility for 'salary' field
//         fieldsToUpdate.salary = `${fieldsToUpdate.salaryRangeDiversity.min} - ${fieldsToUpdate.salaryRangeDiversity.max} ${fieldsToUpdate.salaryRangeDiversity.currency}`;
//       }
//     }

//     // Nested field: workLocation
//     if (workLocation && Object.keys(workLocation).length > 0) {
//       const { city, state, country } = workLocation;
//       const updatedWorkLocation = {};
//       if (city !== "" && city !== undefined) updatedWorkLocation.city = city;
//       if (state !== "" && state !== undefined) updatedWorkLocation.state = state;
//       if (country !== "" && country !== undefined) updatedWorkLocation.country = country;

//       if (Object.keys(updatedWorkLocation).length > 0) {
//         fieldsToUpdate.workLocation = {
//           ...updatedWorkLocation,
//           city: updatedWorkLocation.city ?? (await Job.findById(jobId)).workLocation.city,
//           state: updatedWorkLocation.state ?? (await Job.findById(jobId)).workLocation.state,
//           country: updatedWorkLocation.country ?? (await Job.findById(jobId)).workLocation.country,
//         };

//         // Backward compatibility for 'location' field
//         fieldsToUpdate.location = `${fieldsToUpdate.workLocation.city || ''}, ${fieldsToUpdate.workLocation.state || ''}, ${fieldsToUpdate.workLocation.country}`;
//       }
//     }

//     // Nested field: availabilityFrame
//     if (availabilityFrame && Object.keys(availabilityFrame).length > 0) {
//       const { startDate, endDate } = availabilityFrame;
//       const updatedAvailabilityFrame = {};
//       if (startDate !== "" && startDate !== undefined) updatedAvailabilityFrame.startDate = new Date(startDate);
//       if (endDate !== "" && endDate !== undefined) updatedAvailabilityFrame.endDate = new Date(endDate);

//       if (Object.keys(updatedAvailabilityFrame).length > 0) {
//         fieldsToUpdate.availabilityFrame = {
//           ...updatedAvailabilityFrame,
//           startDate: updatedAvailabilityFrame.startDate ?? (await Job.findById(jobId)).availabilityFrame.startDate,
//           endDate: updatedAvailabilityFrame.endDate ?? (await Job.findById(jobId)).availabilityFrame.endDate,
//         };
//       }
//     }

//     if (Object.keys(fieldsToUpdate).length === 0) {
//       return res.status(400).json({
//         message: "No valid fields provided for update.",
//         success: false,
//       });
//     }

//     const updatedJob = await Job.findByIdAndUpdate(
//       jobId,
//       { $set: fieldsToUpdate },
//       { new: true, runValidators: true }
//     );

//     if (!updatedJob) {
//       return res.status(404).json({
//         message: "Job not found.",
//         success: false,
//       });
//     }

//     return res.status(200).json({
//       message: "Job updated successfully.",
//       job: updatedJob,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error in updateJob:", error);
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((err) => err.message);
//       return res.status(400).json({
//         message: "Validation failed.",
//         errors: messages,
//         success: false,
//       });
//     }
//     return res.status(500).json({
//       message: "Server error.",
//       success: false,
//     });
//   }
// };


export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id; // Assuming authentication middleware sets req.id

    const {
      jobTitle,
      description,
      workLocation,
      jobType,
      experienceLevel,
      companyName,
      workplacePlane,
      jobCategory,
      skills,
      benefits,
      salaryRange,
      numberOfPositions,
      status,
    } = req.body;

    // Build fields to update
    const fieldsToUpdate = {};

    // Helper function to add field if defined
    const addField = (key, value) => {
      if (value !== undefined && value !== '') {
        fieldsToUpdate[key] = value;
      }
    };

    // Basic fields
    addField('jobTitle', jobTitle);
    addField('description', description);
    addField('jobType', jobType);
    addField('experienceLevel', experienceLevel);
    addField('companyName', companyName);
    addField('workplacePlane', workplacePlane);
    addField('jobCategory', jobCategory);
    addField('numberOfPositions', numberOfPositions ? Number(numberOfPositions) : undefined);
    addField('status', status);

    // Validate numberOfPositions
    if (fieldsToUpdate.numberOfPositions && (isNaN(fieldsToUpdate.numberOfPositions) || fieldsToUpdate.numberOfPositions < 1)) {
      return res.status(400).json({
        message: 'Number of positions must be a positive number.',
        success: false,
      });
    }

    // Array fields
    if (skills !== undefined && skills !== '') {
      fieldsToUpdate.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => skill.trim()).filter(Boolean);
      if (fieldsToUpdate.skills.length === 0) {
        return res.status(400).json({
          message: 'At least one skill is required.',
          success: false,
        });
      }
    }

    if (benefits !== undefined && benefits !== '') {
      fieldsToUpdate.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean);
    } else if (benefits === '') {
      fieldsToUpdate.benefits = [];
    }

    // Nested field: workLocation
    if (workLocation && Object.keys(workLocation).length > 0) {
      const { city, state, pincode, area, streetAddress, country } = workLocation;
      const updatedWorkLocation = {};
      addField('city', city);
      addField('state', state);
      addField('pincode', pincode);
      addField('area', area);
      addField('streetAddress', streetAddress);
      addField('country', country);

      if (Object.keys(updatedWorkLocation).length > 0) {
        fieldsToUpdate.workLocation = updatedWorkLocation;

        // Validate required workLocation fields
        if (!updatedWorkLocation.city) {
          return res.status(400).json({
            message: 'City is required.',
            success: false,
          });
        }
        if (!updatedWorkLocation.state) {
          return res.status(400).json({
            message: 'State is required.',
            success: false,
          });
        }
        if (!updatedWorkLocation.pincode || !/^\d{6}$/.test(updatedWorkLocation.pincode)) {
          return res.status(400).json({
            message: 'Pincode must be a 6-digit number.',
            success: false,
          });
        }
        if (!updatedWorkLocation.area) {
          return res.status(400).json({
            message: 'Area is required.',
            success: false,
          });
        }
        if (!updatedWorkLocation.streetAddress) {
          return res.status(400).json({
            message: 'Street address is required.',
            success: false,
          });
        }
        if (!updatedWorkLocation.country) {
          updatedWorkLocation.country = 'India'; // Default
        }
      }
    }

    // Nested field: salaryRange
    if (salaryRange && (salaryRange.min || salaryRange.max)) {
      const { min, max, currency, frequency } = salaryRange;
      const updatedSalaryRange = {};
      if (min !== undefined && min !== '') {
        updatedSalaryRange.min = Number(min);
        if (isNaN(updatedSalaryRange.min) || updatedSalaryRange.min < 0) {
          return res.status(400).json({
            message: 'Invalid minimum salary. It must be a positive number.',
            success: false,
          });
        }
      }
      if (max !== undefined && max !== '') {
        updatedSalaryRange.max = Number(max);
        if (isNaN(updatedSalaryRange.max) || updatedSalaryRange.max < 0) {
          return res.status(400).json({
            message: 'Invalid maximum salary. It must be a positive number.',
            success: false,
          });
        }
      }
      if (currency !== undefined && currency !== '') updatedSalaryRange.currency = currency;
      if (frequency !== undefined && frequency !== '') updatedSalaryRange.frequency = frequency;

      if (Object.keys(updatedSalaryRange).length > 0) {
        const existingJob = await Job.findById(jobId);
        fieldsToUpdate.salaryRange = {
          min: updatedSalaryRange.min ?? existingJob.salaryRange?.min,
          max: updatedSalaryRange.max ?? existingJob.salaryRange?.max,
          currency: updatedSalaryRange.currency ?? existingJob.salaryRange?.currency ?? 'INR',
          frequency: updatedSalaryRange.frequency ?? existingJob.salaryRange?.frequency ?? 'yearly',
        };

        // Validate min < max
        if (fieldsToUpdate.salaryRange.min !== undefined && fieldsToUpdate.salaryRange.max !== undefined) {
          if (fieldsToUpdate.salaryRange.min >= fieldsToUpdate.salaryRange.max) {
            return res.status(400).json({
              message: 'Minimum salary must be less than maximum salary.',
              success: false,
            });
          }
        }
      }
    } else if (salaryRange && !salaryRange.min && !salaryRange.max) {
      fieldsToUpdate.salaryRange = null; // Allow clearing salaryRange
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update.',
        success: false,
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: 'Job not found.',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Job updated successfully.',
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error('Error in updateJob:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: 'Validation failed.',
        errors: messages,
        success: false,
      });
    }
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
};





export const adminGetJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job by ID and populate the applications and the applicants for each application
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
