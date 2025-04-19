import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  console.log(req.body,"dhadso")
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
    console.log(companyId,"jfejhe check....")
    // Validate required fields
    const requiredFields = {
      jobTitle: "Job title is required",
      jobDescription: "Job description is required",
      "workLocation.city": workLocation?.city ? undefined : "City is required",
      "workLocation.state": workLocation?.state ? undefined : "State is required",
      "workLocation.pincode": workLocation?.pincode ? undefined : "Pincode is required",
      "workLocation.area": workLocation?.area ? undefined : "Area is required",
      "workLocation.streetAddress": workLocation?.streetAddress ? undefined : "Street address is required",
      jobType: "Job type is required",
      experienceLevel: "Experience level is required",
      companyId: "Company ID is required",
      companyName: "Company name is required",
      workplacePlane: "Workplace plane is required",
      jobCategory: "Job category is required",
      skills: "At least one skill is required",
      numberOfPositions: "Number of positions is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (message) {
        const value = field.includes("workLocation")
          ? workLocation[field.split(".")[1]]
          : req.body[field];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return res.status(400).json({
            message,
            success: false,
          });
        }
      }
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(workLocation.pincode)) {
      return res.status(400).json({
        message: "Pincode must be a 6-digit number",
        success: false,
      });
    }

    // Validate experienceLevel
    const experience = parseFloat(experienceLevel);
    if (isNaN(experience) || experience < 0) {
      return res.status(400).json({
        message: "Experience level must be a non-negative number",
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

    // Validate skills (ensure it's an array and not empty)
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: "At least one skill is required",
        success: false,
      });
    }

    // Validate benefits (ensure it's an array)
    const parsedBenefits = Array.isArray(benefits) ? benefits : [];
    if (parsedBenefits.length === 0) {
      return res.status(400).json({
        message: "At least one benefit is required",
        success: false,
      });
    }

    // Validate salaryRange if provided
    let formattedSalaryRange = undefined;
    if (salaryRange && salaryRange.minSalary !== null && salaryRange.maxSalary !== null) {
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
        currency: "INR",
        frequency: "yearly",
      };
    }

    // Validate companyId exists in database (assuming Company model exists)
    // const Company = require("../models/Company"); // Adjust path as needed
  
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(400).json({
        message: "Invalid company ID",
        success: false,
      });
    }

    // Validate workplacePlane (optional, add allowed values if needed)
    const validWorkplacePlanes = ["Office", "Remote", "Hybrid"];
    if (!validWorkplacePlanes.includes(workplacePlane)) {
      return res.status(400).json({
        message: "Workplace plane must be one of: Office, Remote, Hybrid",
        success: false,
      });
    }

    // Create job document
    // const Job = require("../models/Job"); // Adjust path as needed
    const job = await Job.create({
      jobTitle,
      description: jobDescription,
      workLocation: {
        city: workLocation.city,
        state: workLocation.state,
        pincode: workLocation.pincode,
        area: workLocation.area,
        streetAddress: workLocation.streetAddress,
        country: "India",
      },
      jobType,
      experienceLevel: experience.toString(), // Store as string
      company: companyId,
      companyName,
      workplacePlane,
      jobCategory,
      skills,
      benefits: parsedBenefits,
      salaryRange: formattedSalaryRange,
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
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const SearchJob = async (req, res) => {
  try {
    // Extract and validate query parameters
    const { jobTitle, city, limit = 10, page = 1 } = req.query;

    // Parse limit and page to numbers and validate
    const parsedLimit = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1
    const parsedPage = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
    const skip = (parsedPage - 1) * parsedLimit; // Calculate documents to skip

    // Log for debugging
    console.log("Job Title:", jobTitle);
    console.log("City:", city);

    // Build query object
    const query = {};
    if (jobTitle) {
      query.jobTitle = { $regex: jobTitle, $options: "i" }; // Case-insensitive search
    }
    if (city && city !== "all") {
      query["workLocation.state"] = { $regex: city, $options: "i" }; // Filter by state
    }

    // Execute query with pagination, population, and sorting
    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name industry logo" // Example: Select specific fields from company
      })
      .sort({ createdAt: 1 }) // Sort by oldest first
      .skip(skip) // Skip documents for pagination
      .limit(parsedLimit); // Limit number of documents

    // Check if jobs were found
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found matching the criteria.",
        success: false,
      });
    }

    // Count total matching documents for pagination
    const totalJobs = await Job.countDocuments(query);

    // Return response with jobs and pagination metadata
    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error("Error searching for jobs:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for jobs",
      error: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "all";

    console.log("Keyword:", keyword);
    console.log("Location:", location);
    const query = {};

    // Filter by keyword (e.g., "hr") in jobTitle if provided
    if (keyword) {
      query.jobTitle = { $regex: keyword, $options: "i" };
    }

    // Add location filter based on workLocation.state if not "all"
    if (location !== "all") {
      query["workLocation.state"] = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found matching the criteria.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    return res.status(500).json({
      message: "Server error while fetching jobs.",
      success: false,
    });
  }
};
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




export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id; // Assuming authentication middleware sets req.id

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
    addField('jobDescription', jobDescription);
    addField('jobType', jobType);
    addField('experienceLevel', experienceLevel ? Number(experienceLevel) : undefined);
    addField('companyId', companyId);
    addField('companyName', companyName);
    addField('workplacePlane', workplacePlane);
    addField('jobCategory', jobCategory);
    addField('numberOfPositions', numberOfPositions ? Number(numberOfPositions) : undefined);
    addField('status', status);

    // Validate numberOfPositions
    if (fieldsToUpdate.numberOfPositions !== undefined && (isNaN(fieldsToUpdate.numberOfPositions) || fieldsToUpdate.numberOfPositions < 1)) {
      return res.status(400).json({
        message: 'Number of positions must be a positive number.',
        success: false,
      });
    }

    // Handle skills array - could be array or comma-separated string
    if (skills !== undefined) {
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

    // Handle benefits array - frontend sends as array directly
    if (benefits !== undefined) {
      fieldsToUpdate.benefits = Array.isArray(benefits) 
        ? benefits 
        : benefits.split(',').map(benefit => benefit.trim()).filter(Boolean);
    }

    // Handle workLocation object
    if (workLocation && Object.keys(workLocation).length > 0) {
      const { city, state, pincode, area, streetAddress, country } = workLocation;
      const updatedWorkLocation = {};
      
      if (city !== undefined) updatedWorkLocation.city = city;
      if (state !== undefined) updatedWorkLocation.state = state;
      if (pincode !== undefined) updatedWorkLocation.pincode = pincode;
      if (area !== undefined) updatedWorkLocation.area = area;
      if (streetAddress !== undefined) updatedWorkLocation.streetAddress = streetAddress;
      if (country !== undefined) updatedWorkLocation.country = country;
      else updatedWorkLocation.country = 'India'; // Default country

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
      }
    }

    // Handle salaryRange - check if it's a string from frontend or an object
    if (salaryRange) {
      // If salaryRange is a string (from frontend format like "5000-10000")
      if (typeof salaryRange === 'string' && salaryRange.trim() !== '') {
        const parts = salaryRange.split(/[,|-]/);
        if (parts.length === 2) {
          const minSalary = Number(parts[0].trim());
          const maxSalary = Number(parts[1].trim());
          
          if (isNaN(minSalary) || isNaN(maxSalary)) {
            return res.status(400).json({
              message: 'Salary range must contain valid numbers.',
              success: false,
            });
          }
          
          if (minSalary >= maxSalary) {
            return res.status(400).json({
              message: 'Minimum salary must be less than maximum salary.',
              success: false,
            });
          }
          
          fieldsToUpdate.salaryRange = {
            minSalary,
            maxSalary,
            currency: 'INR', // Default
            frequency: 'yearly' // Default
          };
        } else {
          return res.status(400).json({
            message: 'Salary range format should be min-max or min,max',
            success: false,
          });
        }
      } 
      // If salaryRange is an object (already structured format)
      else if (typeof salaryRange === 'object' && Object.keys(salaryRange).length > 0) {
        const { minSalary, maxSalary, currency, frequency } = salaryRange;
        const updatedSalaryRange = {};

        if (minSalary !== undefined && minSalary !== '') {
          updatedSalaryRange.minSalary = Number(minSalary);
          if (isNaN(updatedSalaryRange.minSalary) || updatedSalaryRange.minSalary < 0) {
            return res.status(400).json({
              message: 'Invalid minimum salary. It must be a positive number.',
              success: false,
            });
          }
        }
        
        if (maxSalary !== undefined && maxSalary !== '') {
          updatedSalaryRange.maxSalary = Number(maxSalary);
          if (isNaN(updatedSalaryRange.maxSalary) || updatedSalaryRange.maxSalary < 0) {
            return res.status(400).json({
              message: 'Invalid maximum salary. It must be a positive number.',
              success: false,
            });
          }
        }
        
        if (currency !== undefined && currency !== '') updatedSalaryRange.currency = currency;
        else updatedSalaryRange.currency = 'INR';
        
        if (frequency !== undefined && frequency !== '') updatedSalaryRange.frequency = frequency;
        else updatedSalaryRange.frequency = 'yearly';

        if (updatedSalaryRange.minSalary !== undefined && 
            updatedSalaryRange.maxSalary !== undefined &&
            updatedSalaryRange.minSalary >= updatedSalaryRange.maxSalary) {
          return res.status(400).json({
            message: 'Minimum salary must be less than maximum salary.',
            success: false,
          });
        }

        fieldsToUpdate.salaryRange = updatedSalaryRange;
      }
      // If empty object is sent, allow clearing salaryRange
      else if (typeof salaryRange === 'object' && Object.keys(salaryRange).length === 0) {
        fieldsToUpdate.salaryRange = null;
      }
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
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Validation failed.',
        errors,
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


// export const SearchJob = async (req, res) => {
//   try {
//     const { jobTitle, city, limit = 10, page = 1 } = req.query;
//     const query = {};
//     if (jobTitle) {
//       const sanitizedTitle = jobTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       query.jobTitle = { $regex: new RegExp(sanitizedTitle, 'i') };
//     }
//     if (city) {
//       const sanitizedCity = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       query['workLocation.city'] = { $regex: new RegExp(sanitizedCity, 'i') };
//     }
//     if (Object.keys(query).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide at least one search parameter (jobTitle or city)',
//       });
//     }
//     const maxLimit = 100;
//     const parsedLimit = Math.max(1, Math.min(maxLimit, parseInt(limit, 10)));
//     const parsedPage = Math.max(1, parseInt(page, 10));
//     const skip = (parsedPage - 1) * parsedLimit;
//     const jobs = await Job.find(query)
//       .populate('company', 'name createdAt')
//       // .limit(parsedLimit)
//       .skip(skip)
//       .lean();

//     if (!jobs || jobs.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No jobs found matching the criteria',
//       });
//     }
//     const totalJobs = await Job.countDocuments(query);

//     return res.status(200).json({
//       success: true,
//       jobs,
//       pagination: {
//         totalJobs,
//         totalPages: Math.ceil(totalJobs / parsedLimit),
//         currentPage: parsedPage,
//         limit: parsedLimit,
//       },
//     });
//   } catch (error) {
//     console.error('Error searching for jobs:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred while searching for jobs',
//       error: error.message,
//     });
//   }
// };