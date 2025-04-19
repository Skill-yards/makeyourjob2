import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendEmail } from "../utils/send.email.service.js";
import {User} from "../models/user.model.js"
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const { email } = req.body; 
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        if (!email) {
            return res.status(400).json({
                message: "User email is required.",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        await sendEmail({
            to: email,
            subject: `Application Submitted for ${job.jobTitle}`,
            otp: `Thank you for applying for the "${job.jobTitle}" position at Skillyards. Your application has been successfully submitted. The hiring team will review your profile and get back to you soon. If you didn’t apply for this job, please contact us immediately.`
        });
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};



export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getApplication = async (req, res) => {
    try {
      const { applicantId } = req.params;
      console.log(applicantId, "applicantId");
      const application = await Application.findById(applicantId).populate('applicant');
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
        });
      }
      return res.status(200).json({
        success: true,
        application,
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };


export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}