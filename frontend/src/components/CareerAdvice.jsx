
import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const CareerAdvice = () => {
  const [openSection, setOpenSection] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    alert(`Subscribed with: ${newsletterEmail}`);
    setNewsletterEmail('');
  };

  const adviceSections = [
    {
      title: 'Resume & Profile Tips',
      content: (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I create a strong resume?</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            A great resume highlights your skills, work history, and achievements clearly and concisely. Make sure to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
            <li>Tailor your resume to each job</li>
            <li>Use action verbs (e.g., "managed," "built," "led")</li>
            <li>Include relevant certifications or training</li>
            <li>
              Use our{' '}
              <a href="#resume-builder" className="text-indigo-600 hover:underline font-medium">
                Resume Builder
              </a>{' '}
              to craft a professional resume in minutes.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            How can I improve my profile on MakeYourJobs?
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">Complete your profile with:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>A short but impactful summary</li>
            <li>Accurate work experience and skills</li>
            <li>An up-to-date resume and a professional photo (if desired)</li>
            <li>A complete profile boosts your visibility to employers!</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Interview Preparation',
      content: (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What are common interview questions?</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Here are a few questions often asked across different industries:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
            <li>"Tell me about yourself."</li>
            <li>"Why do you want to work here?"</li>
            <li>"What are your strengths and weaknesses?"</li>
            <li>"Describe a time you solved a problem at work."</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I prepare for an interview?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Research the company and the role</li>
            <li>Practice answering questions out loud</li>
            <li>Dress appropriately for the job type (casual, uniformed, or formal)</li>
            <li>Be on time and follow up with a thank-you message</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Career Growth & Upskilling',
      content: (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I grow in my current role?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
            <li>Ask for feedback regularly</li>
            <li>Take initiative and volunteer for tasks</li>
            <li>Build relationships with colleagues and managers</li>
            <li>Consider short-term training or online courses to boost your skills</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Are there resources for learning new skills?</h3>
          <p className="text-gray-700 leading-relaxed">
            Yes! Check out our{' '}
            <a href="#skill-resources" className="text-indigo-600 hover:underline font-medium">
              Skill Development Resources
            </a>{' '}
            page for free and low-cost training programs in trades, digital skills, and professional development.
          </p>
        </>
      ),
    },
    {
      title: 'Switching Careers',
      content: (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Is it too late to change careers?</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Never. Whether you're moving from a field job to an office role or vice versa, career shifts are more common
            than ever. Focus on:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
            <li>Transferable skills (teamwork, problem-solving, time management)</li>
            <li>Gaining basic certifications in your new field</li>
            <li>Starting with entry-level roles or internships</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What if I don’t have experience in the new field?</h3>
          <p className="text-gray-700 leading-relaxed">
            No worries. Highlight your motivation to learn, and consider volunteering or part-time gigs to gain practical
            experience.
          </p>
        </>
      ),
    },
    {
      title: 'Workplace Tips & Mental Wellbeing',
      content: (
        <>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I handle stress at work?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
            <li>Take short breaks when needed</li>
            <li>Stay organized and prioritize tasks</li>
            <li>Talk to your manager if your workload is unmanageable</li>
            <li>Don’t hesitate to ask for help</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            What should I do if I’m facing discrimination or unfair treatment?
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            MakeYourJobs stands for equal opportunity. If you face any form of harassment or bias, you should:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Document the incident</li>
            <li>Report it to your HR or supervisor</li>
            <li>Reach out to legal aid or worker advocacy groups if needed</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-fade-in-up">
            Career Advice from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">MakeYourJobs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            Unlock powerful career opportunities with expert guidance. From your first job to a career switch or promotion, we’re here to support every step.
          </p>
          <a
            href="#advice-sections"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('advice-sections').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Career Tips
          </a>
        </div>

        {/* Advice Sections */}
        <div id="advice-sections" className="max-w-5xl mx-auto">
          {adviceSections.map((section, index) => (
            <div
              key={index}
              className="mb-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
              >
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                <svg
                  className={`w-7 h-7 text-indigo-600 transform transition-transform duration-300 ${
                    openSection === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === index && (
                <div className="p-8 bg-white animate-fade-in">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="max-w-5xl mx-auto mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-opacity-20 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-30"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Need Personalized Career Guidance?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Connect with our Career Support Team or join our Career Tips Newsletter for weekly insights tailored to your journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a
              href="http://localhost:5173/contact"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-100 hover:scale-105 transition-all duration-300"
            >
              Contact Career Support
            </a>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
                required
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerAdvice;
