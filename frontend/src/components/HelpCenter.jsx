import React, { useState } from 'react';
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 font-serif">
              Help Center | MakeYourJobs
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Welcome to the MakeYourJobs Help Center! Whether you’re a skilled tradesperson, a recent graduate, an experienced professional, or a recruiter searching for the right fit, we’re here to support you every step of the way. Explore the topics below or use the search bar to quickly find the answers you need.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-4 pr-12 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Getting Started */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Getting Started</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">What is MakeYourJobs?</h3>
                <p className="text-gray-600 text-sm">
                  MakeYourJobs is a web-based job portal designed to connect job seekers and employers across all sectors, including both white-collar and blue-collar industries. Our mission is to close the gap between talent and opportunity by offering a seamless, accessible, and inclusive job-matching experience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">Who can use MakeYourJobs?</h3>
                <p className="text-gray-600 text-sm">
                  We support job seekers from all backgrounds and experience levels and employers ranging from small businesses to large enterprises. Whether you're looking for an entry-level position or seeking to hire for skilled roles, MakeYourJobs is built for you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">Is MakeYourJobs free?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, job seekers can use all essential features free of charge. Employers can post jobs with free basic listings or upgrade to premium plans for wider visibility.
                </p>
              </div>
            </div>
          </section>

          {/* For Job Seekers */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">For Job Seekers</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How do I start my job search?</h3>
                <p className="text-gray-600 text-sm">
                  Sign up for a free account, complete your profile, and head to the Find Jobs section. You can filter jobs by location, industry, skill level, and more.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">What types of jobs are listed?</h3>
                <p className="text-gray-600 text-sm">
                  MakeYourJobs features a wide range of job categories—from office-based roles like administration and IT to hands-on roles like construction, delivery, and manufacturing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How can I apply for a job?</h3>
                <p className="text-gray-600 text-sm">
                  Simply click on any job listing and hit Apply Now. You can attach your resume or use our built-in resume builder to create one instantly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">Can I receive job alerts?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! Set up your preferences under Job Alerts, and we’ll send tailored job opportunities directly to your inbox.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How do I track my applications?</h3>
                <p className="text-gray-600 text-sm">
                  Visit your Dashboard and go to My Applications to view the jobs you’ve applied for and see their current status.
                </p>
              </div>
            </div>
          </section>

          {/* For Employers */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">For Employers</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How do I post a job?</h3>
                <p className="text-gray-600 text-sm">
                  Create an employer account, go to Post a Job, and fill in details such as job title, description, location, and requirements. You can publish immediately or save it as a draft.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">What job roles can I post?</h3>
                <p className="text-gray-600 text-sm">
                  From technical trades and field roles to corporate and creative positions, MakeYourJobs is built to help you find the right match for any job type.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How does candidate management work?</h3>
                <p className="text-gray-600 text-sm">
                  Under your Employer Dashboard, you can view applicants, shortlist profiles, send messages, and schedule interviews—all in one place.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-7
00 mb-3">Can I promote my job listings?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! Featured and sponsored listings help your jobs appear more prominently on the platform and attract more candidates.
                </p>
              </div>
            </div>
          </section>

          {/* Account & Data Security */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Account & Data Security</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How do I reset my password?</h3>
                <p className="text-gray-600 text-sm">
                  Click on Forgot Password on the login screen and follow the email instructions to create a new password.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">How do I update or delete my account?</h3>
                <p className="text-gray-600 text-sm">
                  Visit Account Settings to update your details or permanently delete your profile. Be aware that deleted accounts cannot be restored.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">Is my personal data secure?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use encrypted systems and comply with global data protection standards to ensure your personal and professional information is safe.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting & Technical Support */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Troubleshooting & Technical Support</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">I'm having trouble logging in. What should I do?</h3>
                <p className="text-gray-600 text-sm">
                  Make sure you’re using the correct email and password. If you’re still stuck, try resetting your password or clearing your browser’s cache.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium text-gray-700 mb-3">The website is not working properly. How can I fix it?</h3>
                <p className="text-gray-600 text-sm">
                  We recommend updating your browser and checking your internet connection. If the issue continues, contact our support team.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-6 text-lg">Still need help? We're always here for you.</p>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <ul className="text-gray-600 space-y-6">
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm"><strong>Email:</strong> <a href="mailto:info@makeyourjobs.com" className="text-blue-600 hover:underline">info@makeyourjobs.com</a></span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8m18 0c0-4.418-4.03-8-9-8s-9 3.582-9 8m4-2h10" />
                  </svg>
                  <span className="text-sm"><strong>Live Chat:</strong> Available Monday–Saturday, 9:30 AM – 6:30 PM</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm"><strong>Help Ticket:</strong> <a href="#" className="text-blue-600 hover:underline">Submit a Request</a></span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;