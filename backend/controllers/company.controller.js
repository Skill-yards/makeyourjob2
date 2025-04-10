import { Company } from "../models/company.model.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/file.upload.service.js";
import { Job } from "../models/job.model.js";
import path from "path";

export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      description,
      website,
      location,
      gstNumber,
      crnCertificate, // This is from req.body, not a file
    } = req.body;

    const files = req.files; 

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }

    // Handle logo upload
    let logoUrl = null;
    if (files && files.logo && files.logo.length > 0) {
      const logoFile = files.logo[0]; 
      const fileExtension = path.extname(logoFile.originalname);
      const fileKey = `logos/${Date.now()}_logo${fileExtension}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: logoFile.buffer,
        ContentType: logoFile.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      logoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    // Handle crnCertificate upload
    let crnCertificateUrl = null;
    if (files && files.crnCertificate && files.crnCertificate.length > 0) {
      const crnFile = files.crnCertificate[0]; 
      const fileExtension = path.extname(crnFile.originalname);
      const fileKey = `crn-certificates/${Date.now()}_crn${fileExtension}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: crnFile.buffer,
        ContentType: crnFile.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      crnCertificateUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    // Create the company with both URLs
    const company = await Company.create({
      name: companyName,
      description: description || null,
      website: website || null,
      location: location || null,
      logo: logoUrl, // Store logo URL
      userId: req.id,
      verification: {
        gstNumber: gstNumber || null,
        crnCertificate: crnCertificateUrl || crnCertificate || null, // Use URL if uploaded, otherwise fallback to req.body value
        isVerified: false,
      },
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error registering company:", error);
    return res.status(500).json({
      message: "Server error while registering company.",
      success: false,
      error: error.message,
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
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// get company by id

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Fetch company with populated jobs and applicants
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Fetch all jobs for this company with populated applicants
    const jobs = await Job.find({ company: companyId });

    return res.status(200).json({
      company: company.toObject(),
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      successful: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { name, description, website, location, gstNumber } = req.body;
    const files = req.files;

    // Find the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Check authorization
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "Unauthorized to update this company.",
        success: false,
      });
    }

    // Handle logo upload
    let logoUrl = company.logo;
    if (files && files.logo && files.logo.length > 0) {
      const logoFile = files.logo[0];
      const fileExtension = path.extname(logoFile.originalname);
      const fileKey = `logos/${Date.now()}_logo${fileExtension}`; // Consistent with registerCompany
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: logoFile.buffer,
        ContentType: logoFile.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      logoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    // Handle CRN certificate upload
    let crnCertificateUrl = company.verification.crnCertificate;
    if (files && files.crnCertificate && files.crnCertificate.length > 0) {
      const crnFile = files.crnCertificate[0];
      const fileExtension = path.extname(crnFile.originalname);
      const fileKey = `crn-certificates/${Date.now()}_crn${fileExtension}`; // Consistent with registerCompany
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: crnFile.buffer,
        ContentType: crnFile.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      crnCertificateUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    // Prepare update data
    const updateData = {
      name: name || company.name,
      description: description || company.description,
      website: website || company.website,
      location: location || company.location,
      logo: logoUrl,
      verification: {
        ...company.verification, // Preserve existing fields
        gstNumber: gstNumber || company.verification.gstNumber,
        crnCertificate: crnCertificateUrl,
        isVerified: company.verification.isVerified, // Preserve current status unless changed
      },
    };

    // Reset verification status to false if verification fields are updated
    if (
      gstNumber !== company.verification.gstNumber || // Check if gstNumber changed
      (files && files.crnCertificate && files.crnCertificate.length > 0) // Check if crnCertificate file is uploaded
    ) {
      updateData.verification.isVerified = false; // Reset to unverified, assuming admin re-verifies
    }

    // Update the company
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Company updated successfully.",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Server error while updating company.",
      success: false,
      error: error.message,
    });
  }
};
