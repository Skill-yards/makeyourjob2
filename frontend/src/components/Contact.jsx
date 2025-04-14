import { useState } from "react";
import { 
  Check, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Send, 
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  MessageSquare
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const CONSULTATION_API_END_POINT = "/api";

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
      if (
        !formData.email ||
        !formData.name ||
        !formData.mobile ||
        !formData.organisation ||
        !formData.message
      ) {
        return toast.error("All fields are required");
      }
      
      // In a real implementation, you would send the data to your API
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      <Navbar />

      {/* Hero Section with Parallax Effect */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-800/80 z-0"></div>
        
        {/* Dynamic background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/api/placeholder/800/800')] bg-repeat z-0"></div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Let's Create 
                <span className="block mt-2 text-yellow-300">Something Extraordinary</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 my-6 mx-auto lg:mx-0 rounded-full"></div>
              <p className="text-slate-200 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                Our passionate team is ready to turn your ideas into reality. Connect with us today and let's embark on a journey of innovation together.
              </p>
              <Button variant="default" size="lg" className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-full px-8 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300">
                Start Your Journey
              </Button>
            </div>
            
            {/* Right Image */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <img
                    src="contactUsImage.jpg"
                    alt="Customer Support"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-100/50 to-blue-100/50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Curious? Let's Clear Things Up!
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto my-6 rounded-full"></div>
          <p className="text-slate-600 text-lg">
            Find answers to common questions or reach out for tailored support.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-lg text-slate-800 hover:text-blue-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Form & Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-100/50 to-purple-100/50">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Card */}
            <Card className="flex-1 border-none shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="text-2xl">Book a Free Consultation</CardTitle>
                <CardDescription className="text-blue-100">
                  Let us know how we can help you today
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={formSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Name*
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
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
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mobile" className="text-sm font-medium text-slate-700">
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
                        className="pl-10"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="organisation" className="text-sm font-medium text-slate-700">
                      Organization*
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="organisation"
                        name="organisation"
                        value={formData.organisation}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      What's on Your Mind?*
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="pl-10 min-h-32"
                        placeholder="Type your message here..."
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-5"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Your Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Info Cards */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Address Card */}
              <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Our Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100">
                    D-24, Gailana Rd, behind St. Conrad's School,<br />
                    Nirbhay Nagar, Agra, Uttar Pradesh 282007
                  </p>
                </CardContent>
              </Card>
              
              {/* Company Info Card */}
              <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" /> Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <p>GST Number: 09ABMCS4605B1ZF</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <p>PAN Number: ABMCS4605B</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" /> Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-200" />
                    <a 
                      href="mailto:INFO@makeyourjobs.com" 
                      className="text-blue-100 hover:text-white hover:underline transition-colors"
                    >
                      INFO@makeyourjobs.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-200" />
                    <a 
                      href="tel:+917060100562" 
                      className="text-blue-100 hover:text-white hover:underline transition-colors"
                    >
                      +91 7060100562
                    </a>
                  </div>
                  <p className="text-sm text-blue-200 mt-2">
                    (Monday to Saturday, 10 AM to 7 PM)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">500+</p>
              <p className="text-sm md:text-base mt-2">Happy Clients</p>
            </div>
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">1200+</p>
              <p className="text-sm md:text-base mt-2">Projects Completed</p>
            </div>
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">98%</p>
              <p className="text-sm md:text-base mt-2">Client Retention</p>
            </div>
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-3xl md:text-4xl font-bold text-yellow-400">24/7</p>
              <p className="text-sm md:text-base mt-2">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;