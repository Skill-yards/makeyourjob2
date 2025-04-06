import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const faqs = [
  "Are you facing any technical problems?",
  "Do you wish to partner with us?",
  "Do you wish to build a brand property around competitions or do an employee engagement program?",
  "Do you have any suggestions/feedback for us?",
  "Do you wish to organize an online quiz, an on-campus/live quiz, or a simulation game with us?",
  "Need help in Organizing Competitions?",
];

const statistics = [
  {
    value: "22M+",
    label: "Students",
    color: "bg-pink-200",
    image: "/students.png",
  },
  {
    value: "78+",
    label: "Countries",
    color: "bg-blue-200",
    image: "/world-map.png",
  },
  {
    value: "800+",
    label: "Brands trust us",
    color: "bg-orange-200",
    image: "/brands.png",
  },
  {
    value: "42K+",
    label: "Colleges",
    color: "bg-purple-200",
    image: "/colleges.png",
  },
  {
    value: "130K+",
    label: "Opportunities",
    color: "bg-yellow-200",
    image: "/opportunities.png",
  },
  {
    value: "22.3M+",
    label: "Assessments",
    color: "bg-green-200",
    image: "/assessments.png",
  },
];

const ContactUs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      {/* Main Section */}
      <section className="bg-white py-12 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Image */}
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
          <img
            src="/customer-support.jpg"
            alt="Customer Support"
            className="w-[80%] md:w-[60%] max-w-xs md:max-w-sm"
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

      {/* Our Numbers Section */}
      <section className="py-12 px-4 md:px-16 bg-gray-100 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">
          Our Numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md ${stat.color} flex flex-col items-center`}
            >
              <h3 className="text-lg md:text-xl font-bold">{stat.value}</h3>
              <p className="text-gray-700 text-sm md:text-base">{stat.label}</p>
              <img
                src={stat.image}
                alt={stat.label}
                className="mt-2 w-10 h-10 md:w-12 md:h-12"
              />
            </div>
          ))}
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
        <div className="mt-8 max-w-3xl mx-auto">
          {faqs.map((question, index) => (
            <div key={index} className="border-b border-gray-300 py-3">
              <button
                className="flex justify-between items-center w-full text-left text-sm md:text-lg font-medium text-gray-900"
                onClick={() => toggleFAQ(index)}
              >
                {question}
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="text-gray-600 mt-2 text-xs md:text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Name*</label>
              <input
                type="text"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your organization"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                What's on Your Mind?*
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
                rows="4"
              ></textarea>
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
