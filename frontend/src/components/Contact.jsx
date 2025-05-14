import { useState } from "react";
import {
  Check,
  Mail,
  Phone,
  MapPin,
  Building,
  Send,
  // ChevronDown,
  // ChevronUp,
  User,
  Briefcase,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import axios from "axios";
import { CONSULTATION_API_END_POINT } from "@/utils/constant";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    organisation: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      // Client-side validation
      if (
        !formData.email ||
        !formData.name ||
        !formData.mobile ||
        !formData.organisation ||
        !formData.message
      ) {
        return toast.error("All fields are required");
      }
      const response = await axios.post(
        `${CONSULTATION_API_END_POINT}/consultation`,
        formData
      );
      toast.success(response.data.message || "Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        organisation: "",
        message: "",
      });
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        {/* Background with glass morphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-700 z-0"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/api/placeholder/800/800')] bg-repeat z-0"></div>

        {/* Floating shapes for modern look */}
        <div className="absolute hidden md:block top-20 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute hidden md:block -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute hidden md:block top-40 left-40 w-56 h-56 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content - Made more mobile-responsive */}
            <div className="md:w-1/2 text-center md:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                Reach Out To Us
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Let's Create
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-300">
                  Something Extraordinary
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 my-6 mx-auto md:mx-0 rounded-full"></div>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                Our passionate team is ready to turn your ideas into reality.
                Connect with us today and let's embark on a journey of
                innovation together.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-full px-6 shadow-lg transition-all duration-300 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 rounded-full px-6"
                >
                  Explore Services
                </Button>
              </div>
            </div>

            {/* Right Image - Enhanced for mobile */}
            <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
              <div className="relative max-w-sm sm:max-w-md">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                {/* Image container */}
                <div className="relative bg-white rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <img
                    src="/contactUsImage.jpg"
                    alt="Customer Support"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Floating badge for modern touch */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Repositioned for better flow and made mobile-responsive */}
      <section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="p-4 md:p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                500+
              </p>
              <p className="text-sm mt-2 text-slate-600">Happy Clients</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                1200+
              </p>
              <p className="text-sm mt-2 text-slate-600">Projects Completed</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                98%
              </p>
              <p className="text-sm mt-2 text-slate-600">Client Retention</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                24/7
              </p>
              <p className="text-sm mt-2 text-slate-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Contact Section - Improved layout for mobile */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Get in Touch
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto my-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Whether you have a question, want to start a project, or simply
              want to connect, we're here for you.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Card - Enhanced UI */}
            <Card className="flex-1 border-none rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-700 text-white py-6">
                <CardTitle className="text-xl md:text-2xl flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Book a Free Consultation
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Let us know how we can help you today
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={formSubmit}>
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Name*
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 rounded-lg border-slate-200 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email ID*
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 rounded-lg border-slate-200 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="mobile"
                      className="text-sm font-medium text-slate-700"
                    >
                      Mobile No.*
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="pl-10 rounded-lg border-slate-200 focus:ring-blue-500"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="organisation"
                      className="text-sm font-medium text-slate-700"
                    >
                      Organization*
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="organisation"
                        name="organisation"
                        value={formData.organisation}
                        onChange={handleChange}
                        className="pl-10 rounded-lg border-slate-200 focus:ring-blue-500"
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-slate-700"
                    >
                      What's on Your Mind?*
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="pl-10 min-h-32 rounded-lg border-slate-200 focus:ring-blue-500"
                        placeholder="Type your message here..."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Send className="h-4 w-4" /> Send Your Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info Cards - Redesigned for better mobile display */}
            <div className="flex-1 flex flex-col gap-4 md:gap-6">
              {/* Address Card */}
              <Card className="border-none rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-16 bg-violet-600 flex items-center justify-center p-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      Our Address
                    </h3>
                    <p className="text-slate-600">
                      D-24, Gailana Rd, behind St. Conrad's School,
                      <br />
                      Nirbhay Nagar, Agra, Uttar Pradesh 282007
                    </p>
                  </div>
                </div>
              </Card>

              {/* Company Info Card */}
              <Card className="border-none rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-16 bg-blue-600 flex items-center justify-center p-4">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      Company Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <p className="text-slate-600">
                          GST Number: 09ABMCS4605B1ZF
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <p className="text-slate-600">PAN Number: ABMCS4605B</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Card */}
              <Card className="border-none rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex-1">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-16 bg-indigo-600 flex items-center justify-center p-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      Contact Us
                    </h3>
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-indigo-500" />
                        <a
                          href="mailto:INFO@makeyourjobs.com"
                          className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors"
                        >
                          info@makeyourjobs.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-indigo-500" />
                        <a
                          href="tel:+917060100562"
                          className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors"
                        >
                          +91 7060100562
                        </a>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        (Monday to Saturday, 10 AM to 7 PM)
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {/* Social Media Icons */}
                      {/* <a
    href=""
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="icon" variant="outline" className="rounded-full w-8 h-8 p-0">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      </Button>
  </a> */}
                      <a
                        href="https://www.linkedin.com/company/make-your-jobs/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                          </svg>
                        </Button>
                      </a>

                      <a
                        href="https://www.instagram.com/makeyourjobss"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                          </svg>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with modern accordion */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Curious? Let's Clear Things Up!
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto my-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions or reach out for tailored
              support.
            </p>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-base sm:text-lg text-slate-800 hover:text-blue-600 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-blue-600 to-violet-700 rounded-2xl shadow-xl text-white text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Still have questions?
            </h3>
            <p className="mb-6 text-blue-100">
              Our team is just a click away and ready to assist you
            </p>
            <Button className="bg-white hover:bg-slate-100 text-blue-600 font-medium rounded-full px-6 shadow-lg transition-all duration-300 group">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Google Maps Integration */}

      <Footer />
    </div>
  );
};

export default ContactUs;
