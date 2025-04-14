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
      toast.success("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        organisation: "",
        message: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Section - Image */}
        <div className="lg:w-1/2 flex justify-center mb-12 lg:mb-0">
          <img
            src={contactImages}
            alt="Customer Support"
            className="w-4/5 sm:w-3/5 lg:w-2/3 rounded-3xl ring-1 ring-gray-100 transform hover:scale-[1.03] transition-transform duration-300"
          />
        </div>

        {/* Right Section - Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            We’re Here for You!
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 my-6 mx-auto lg:mx-0 rounded-full"></div>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
            Our passionate team is ready to turn your ideas into reality. Let’s
            create something extraordinary together!
          </p>
          <button className="mt-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-10 rounded-full hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300">
            Connect Now
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Curious? Let’s Clear Things Up!
          </h2>
          <p className="text-gray-500 mt-4 text-lg sm:text-xl font-light">
            Find answers to common questions or reach out for tailored support.
          </p>
        </div>
        <div className="mt-12 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-100 py-4 transition-all duration-300"
            >
              <button
                className="flex justify-between items-center w-full text-left text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="text-2xl font-light">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed animate-fadeIn font-light">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-24 flex flex-col lg:flex-row justify-center gap-6 lg:gap-8">
        {/* Left Section: Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl ring-1 ring-gray-100 w-full lg:w-1/2 transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            Book a Free Consultation
          </h2>
          <form className="space-y-5" onSubmit={formSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name*
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email ID*
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-gray-700 font-medium mb-2"
              >
                Mobile No.*
              </label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50"
                placeholder="Enter your mobile number"
              />
            </div>
            <div>
              <label
                htmlFor="organisation"
                className="block text-gray-700 font-medium mb-2"
              >
                Organization*
              </label>
              <input
                id="organisation"
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50"
                placeholder="Enter your organization"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                What’s on Your Mind?*
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50"
                placeholder="Type your message here"
                rows="5"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-lg font-semibold hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300"
            >
              Send Your Message
            </button>
          </form>
        </div>

        {/* Right Section: Contact Info */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white p-6 sm:p-8 rounded-2xl ring-1 ring-blue-200 w-full lg:w-1/2 lg:ml-6 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight">
            Get in Touch
          </h3>

          {/* Address Section */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold">Our Address</h4>
            <p className="text-base mt-2 leading-relaxed">
              D-24, Gailana Rd, behind St. Conrad's School,
              <br />
              Nirbhay Nagar, Agra, Uttar Pradesh 282007
            </p>
          </div>

          {/* Company Section */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold">Company</h4>
            <p className="text-base mt-2">GST Number: 09ABMCS4605B1ZF</p>
            <p className="text-base">PAN Number: ABMCS4605B</p>
          </div>

          {/* Inquiries Section */}
          <div>
            <h4 className="text-xl font-semibold">Inquiries</h4>
            <p className="text-base mt-2">
              Email:{" "}
              <a
                href="mailto:INFO@makeyourjobs.com"
                className="underline hover:text-yellow-400 transition-colors duration-200"
              >
                INFO@makeyourjobs.com
              </a>
            </p>
            <p className="text-base">
              Phone:{" "}
              <a
                href="tel:+917060100562"
                className="underline hover:text-yellow-400 transition-colors duration-200"
              >
                7060100562
              </a>
            </p>
            <p className="text-base">(Monday to Saturday, 10 AM to 7 PM)</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;