import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  // Address for Google Maps
  const address = "D-24, Gailana Rd, behind St. Conrad's School, Nirbhay Nagar, Agra, Uttar Pradesh 282007";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  // Email for mailto link
  const email = "info@makeyourjobs.com";
  // State for email input and subscription status
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Handle subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/subscribe', {
        email: emailInput,
      });
      setMessage('Successfully subscribed to new job updates!');
      setEmailInput(''); 
      console.log(response.data)
    } catch (error) {
      const errorMessage =
        
        'You need to login first, for job Update'||error.response?.data?.message ;
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="max-w-md">
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-w-64"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                onClick={handleSubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </div>
          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.includes('Successfully') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                MakeYourJobs
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Find your dream job with our curated listings and powerful search tools.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-300">
                <Phone className="h-4 w-4 mr-3 text-indigo-400" />
                <span>+91 7060100562</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center hover:text-indigo-400 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-3 text-indigo-400" />
                  <span>{email}</span>
                </a>
              </div>
              <div className="flex items-start text-sm text-slate-300">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start hover:text-indigo-400 transition-colors"
                >
                  <MapPin className="h-4 w-5 mr-3 mb-5 text-indigo-400 mt-1" />
                  <span>{address}</span>
                </a>
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">
              For Job Seekers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              {/* <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Create Resume
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Job Alerts
                </a>
              </li> */}
              <li>
                <Link to="/carreradvise" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">
              For Employers
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/browse" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Post a Job
                </a>
              </li>
            </ul>
          </div> */}

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              © {currentYear} MakeYourJob. All rights reserved.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://www.linkedin.com/company/make-your-jobs/"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/makeyourjobss?igsh=MW5tanIzdW0wcnlvaw%3D%3D&utm_source=qr"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;