import { useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { toast } from "sonner";
import { CONSULTATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import contactImages from "../../public/contactUsImage.jpg";

const faqs = [
  {
    question: "Are you experiencing any technology issues?",
    answer:
      "We are here to help! Please describe the problem you are facing, and a member of our support team will get back to you as soon as possible with a solution.",
  },
  {
    question: "Would you like to collaborate with us?",
    answer:
      "We would be delighted to discuss potential joint ventures. After you share your objectives or ideas, we will reach out to discuss how we can work together toward our mutual success.",
  },
  {
    question:
      "Do you want to implement an employee engagement program or create a brand initiative centered around competitions?",
    answer:
      "Absolutely! Creating memorable and impactful experiences is our specialty. Share your goals with us, and we'll work together to develop a campaign that is unique and aligned with your brand's values.",
  },
  {
    question: "Do you have any comments or suggestions for us?",
    answer:
      "We highly value your feedback. Please feel free to share any ideas, criticisms, or suggestions for improvements; we are continually striving to enhance our service for you.",
  },
  {
    question:
      "Would you like to collaborate with us on a simulation game, an on-campus/live quiz, or an online quiz?",
    answer:
      "Certainly! We offer a variety of formats to meet your needs, including hybrid, in-person, and virtual options. Let us know your preferred method, and we will handle the rest.",
  },
  {
    question: "Do you need assistance organizing competitions?",
    answer:
      "That's our specialty! We will support you at every stage, from conception to execution, to ensure a smooth and successful competition experience.",
  },
];

const ContactUs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    organisation: "",
    message: "",
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.email ||
        !formData.name ||
        !formData.mobile ||
        !formData.organisation ||
        !formData.message
      ) {
        return toast.error("All fields are required");
      }
      const res = await axios.post(
        `${CONSULTATION_API_END_POINT}/consultation`,
        formData
      );
      console.log(res.data);
      toast.success("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        organization: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Section */}
      <section className="bg-white py-12 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Image */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src={contactImages}
            alt="Customer Support"
            className="w-[80%] md:w-[60%] max-w-xs md:max-w-sm rounded-2xl"
          />
        </div>

        {/* Right Section - Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            How can we help you?
          </h2>
          <div className="w-16 h-1 bg-yellow-500 my-3 mx-auto md:mx-0"></div>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Thank you for showing your interest in collaborating and interacting
            with us. Our hardworking and dedicated team is ready to help you in
            every possible way.
          </p>
          <button className="mt-6 bg-[#032D60] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#021d40] transition">
            Contact Us
          </button>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="bg-white py-12 px-4 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Thank you for reaching out to makeYourJobs
          </h2>
          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Our hardworking and dedicated team is eager to help you in every
            possible way.
          </p>
        </div>
        <div className="mt-8 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300 py-3">
              <button
                className="flex justify-between items-center w-full text-left text-sm md:text-lg font-medium text-gray-900"
                onClick={() => toggleFAQ(index)}
              >
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="text-gray-600 mt-2 text-xs md:text-sm">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 py-12 px-4 md:px-16 flex flex-col md:flex-row  justify-center">
        {/* Left Section: Form */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Schedule a 1:1 Consultation
          </h2>
          <form className="space-y-4" onSubmit={formSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Email ID*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Mobile No.*
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Organization*
              </label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your organization"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
               {` What's on Your Mind?*`}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Submit Your Details
            </button>
          </form>
        </div>

        {/* Right Section: Contact Info */}
        <div className="bg-blue-900 text-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-1/2 mt-6 md:mt-0 md:ml-6">
          <h3 className="text-2xl font-bold mb-10">Contact Information</h3>

          {/* Address Section */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Our Address</h4>
            <p className="text-sm">
              D-24, Gailana Rd, behind St. Conrad's School,
            </p>
            <p className="text-sm">Nirbhay Nagar, Agra, Uttar Pradesh 282007</p>
          </div>

          {/* Company Section */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <p className="text-sm">GST Number: 09ABMCS4605B1ZF</p>
            <p className="text-sm">PAN Number: ABMCS4605B</p>
          </div>

          {/* Inquiries Section */}
          <div>
            <h4 className="text-lg font-semibold">Inquiries</h4>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:INFO@makeyourjobs.com" className="underline">
                INFO@makeyourjobs.com
              </a>
            </p>
            <p className="text-sm">
              Phone:{" "}
              <a href="tel:+917060100562" className="underline">
                7060100562
              </a>
            </p>
            <p className="text-sm">(Monday to Saturday, 10 AM to 7 PM)</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
