import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experienceLevel,    // ✅ Added experienceLevel
            position, 
            companyId 
        } = req.body;

        const userId = req.id;

        if (!title || !description || !salary || !location || !jobType || !experienceLevel || !position || !companyId || !requirements) {
            return res.status(400).json({
                message: "Missing required fields.",
                success: false
            });
        }

        const parsedRequirements = Array.isArray(requirements) 
            ? requirements 
            : requirements.split(',').map(req => req.trim()).filter(Boolean);

        const job = await Job.create({
            title,
            description,
            requirements: parsedRequirements,
            salary,
            location,
            jobType,
            experienceLevel,     // ✅ Added experienceLevel to the model
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
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


export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        console.log("Request body:", req.body);

        // Filter out empty or undefined fields
        const fieldsToUpdate = {};
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== "" && req.body[key] !== undefined) {
                // Handle salary validation
                if (key === "salary") {
                    const salaryValue = Number(req.body.salary);
                    if (!isNaN(salaryValue) && salaryValue >= 0) {
                        fieldsToUpdate[key] = salaryValue;
                    } else {
                        return res.status(400).json({
                            message: "Invalid salary value. It must be a valid number.",
                            success: false
                        });
                    }
                } else if (key === "requirements" && typeof req.body.requirements === "string") {
                    // Split requirements string into array
                    fieldsToUpdate[key] = req.body.requirements
                        .split(",")
                        .map(req => req.trim())
                        .filter(Boolean);
                } else {
                    fieldsToUpdate[key] = req.body[key];
                }
            }
        });

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update.",
                success: false
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
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            job: updatedJob,
            success: true
        });

    } catch (error) {
        console.error("Error in updateJob:", error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};
