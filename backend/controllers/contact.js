import { Consultation } from "../models/contact.model.js";

export const contactUs = async (req, res) => {
  try {
    const { name, email, mobile, message, organisation } = req.body;
    if (!name || !email || !mobile || !organisation) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    const newConsultation = await Consultation.create({
      name,
      email,
      mobile,
      message,
      organisation,
    });
    res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully",
      data: newConsultation,
    });
  } catch (error) {
    console.error("Error in contactUs:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};