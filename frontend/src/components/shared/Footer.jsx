import React from 'react';
import { Mail, Phone, MapPin,  Linkedin, Twitter, Instagram, Gitlab } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">Join our newsletter</h3>
              <p className="text-slate-300 text-sm">Stay updated with the latest job opportunities and career insights.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Enter your email" 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-w-64"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Job Hunt</h2>
              <p className="mt-2 text-sm text-slate-300">Find your dream job with our curated listings and powerful search tools.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-300">
                <Phone className="h-4 w-4 mr-3 text-indigo-400" /> 
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Mail className="h-4 w-4 mr-3 text-indigo-400" /> 
                <span>hello@jobhunt.com</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <MapPin className="h-4 w-4 mr-3 text-indigo-400" /> 
                <span>123 Job Street, Career City</span>
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Create Resume</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Job Alerts</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Career Advice</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Salary Tools</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">For Employers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Browse Candidates</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Recruitment Tools</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Company Profile</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-700/50">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              © {currentYear} Job Hunt. All rights reserved.
            </p>
            
            <div className="flex space-x-5">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="GitHub">
                <Gitlab className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;