import { useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { toast } from "sonner";
import { CONSULTATION_API_END_POINT } from "@/utils/constant.js";
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
        organisation: "",
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-16 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 flex justify-center mb-12 md:mb-0">
          <img
            src={contactImages}
            alt="Customer Support"
            className="w-[85%] md:w-[70%] rounded-2xl transform "
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            How Can We Help You?
          </h2>
          <div className="w-20 h-1 bg-yellow-400 my-5 mx-auto md:mx-0 rounded-full"></div>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
            We’re excited to collaborate with you! Our passionate team is here to assist you every step of the way.
          </p>
          <button className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-blue-700 transition duration-300 shadow-md">
            Contact Us
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Reach Out to makeYourJobs
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Our dedicated team is ready to support you with enthusiasm and expertise.
          </p>
        </div>
        <div className="mt-12 max-w-5xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <span>{index + 1}. {faq.question}</span>
                <span className="ml-2 text-xl font-bold">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="text-gray-600 mt-3 text-base transition-all duration-300 ease-in-out">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form and Contact Info Section */}
      <section className="bg-gradient-to-r from-gray-100 to-blue-50 py-16 px-4 md:px-16 flex flex-col md:flex-row justify-center gap-8">
        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full md:w-1/2 transform hover:-translate-y-2 transition duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Book a 1:1 Consultation</h2>
          <form className="space-y-6" onSubmit={formSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email ID*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mobile No.*</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your Mobile Number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Organization*</label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Your Organization"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">{`What's on Your Mind?*`}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Tell us more..."
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition duration-300"
            >
              Submit Your Details
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white p-8 rounded-2xl shadow-xl w-full md:w-1/2 transform hover:-translate-y-2 transition duration-300">
          <h3 className="text-3xl font-bold mb-8">Contact Information</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold">Our Address</h4>
              <p className="text-sm leading-relaxed">
                D-24, Gailana Rd, behind St. Conrad's School,<br />
                Nirbhay Nagar, Agra, Uttar Pradesh 282007
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Company</h4>
              <p className="text-sm">GST Number: 09ABMCS4605B1ZF</p>
              <p className="text-sm">PAN Number: ABMCS4605B</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Inquiries</h4>
              <p className="text-sm">
                Email: <a href="mailto:INFO@makeyourjobs.com" className="underline hover:text-yellow-300">INFO@makeyourjobs.com</a>
              </p>
              <p className="text-sm">
                Phone: <a href="tel:+917060100562" className="underline hover:text-yellow-300">7060100562</a>
              </p>
              <p className="text-sm">(Mon-Sat, 10 AM - 7 PM)</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;