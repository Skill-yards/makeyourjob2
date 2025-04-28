import { Company } from "../models/company.model.js";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import {s3Client} from "../utils/file.upload.service.js";
import { Job } from "../models/job.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    const userId = req.id; // Logged-in user ID

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    // Check if the recruiter already has a company
    const existingCompany = await Company.findOne({ userId });
    if (existingCompany) {
      return res.status(400).json({
        message: "You can only register one company as a recruiter.",
        success: false,
      });
    }

    // Check if company name is unique
    const companyByName = await Company.findOne({ name: companyName });
    if (companyByName) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }

    const company = await Company.create({
      name: companyName,
      userId,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Fetch company with populated jobs and applicants
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Fetch all jobs for this company with populated applicants
        const jobs = await Job.find({ company: companyId })

        return res.status(200).json({
            company: company.toObject(),
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            successful: false
        });
    }
};


export const updateCompany = async (req, res) => {
  try {
    const {
      name, description, website, location, gstNumber, cinNumber, panNumber,
      foundedYear, employeeCount, industry, contactEmail, contactPhone
    } = req.body;
    const files = req.files;
    const companyId = req.params.id;

    // Basic input validation
    if (!name) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    const updateData = {
      name,
      description: description || undefined,
      website: website || undefined,
      location: location || undefined,
      gstNumber: gstNumber || undefined,
      cinNumber: cinNumber || undefined,
      panNumber: panNumber || undefined,
      foundedYear: foundedYear ? Number(foundedYear) : undefined,
      employeeCount: employeeCount || undefined,
      industry: industry || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
    };

    // Validate foundedYear
    if (foundedYear) {
      const year = Number(foundedYear);
      if (year < 1800 || year > new Date().getFullYear()) {
        return res.status(400).json({
          message: `Founded year must be between 1800 and ${new Date().getFullYear()}.`,
          success: false,
        });
      }
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Check if company name is unique (excluding the current company)
    if (name && name !== company.name) {
      const existingCompany = await Company.findOne({ name });
      if (existingCompany) {
        return res.status(400).json({
          message: "A company with this name already exists.",
          success: false,
        });
      }
    }

    // Handle file uploads (store only URL as string)
    if (files) {
      const uploadFile = async (file, folder) => {
        const fileKey = `${folder}/${Date.now()}_${file.originalname}`;
        const bucket = process.env.AWS_S3_BUCKET_NAME;
        const uploadParams = {
          Bucket: bucket,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        return `https://${bucket}.s3.amazonaws.com/${fileKey}`; // Return only URL
      };

      if (files.file && files.file.length > 0) {
        updateData.logo = await uploadFile(files.file[0], 'company_logos');
      }
      if (files.gstDocument && files.gstDocument.length > 0) {
        updateData.gstDocument = await uploadFile(files.gstDocument[0], 'gst_documents');
      }
      if (files.cinDocument && files.cinDocument.length > 0) {
        updateData.cinDocument = await uploadFile(files.cinDocument[0], 'cin_documents');
      }
      if (files.panDocument && files.panDocument.length > 0) {
        updateData.panDocument = await uploadFile(files.panDocument[0], 'pan_documents');
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      message: "Company information updated.",
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed.",
        errors: messages,
        success: false,
      });
    }
    if (error.code === 11000) { // Duplicate key error (e.g., unique name)
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};