
import React, { useState } from 'react';
import { ChevronDown, Send, Bookmark, Award, Briefcase, BookOpen, RefreshCw, Heart } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from '@/components/ui/alert';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Link } from 'react-router-dom';

const CareerAdvice = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    setSubscriptionSuccess(true);
    setNewsletterEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubscriptionSuccess(false);
    }, 5000);
  };

  const adviceSections = [
    {
      value: "resume-tips",
      title: 'Resume & Profile Tips',
      icon: <Bookmark className="h-5 w-5 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">How do I create a strong resume?</h3>
            <p className="text-gray-700 leading-relaxed">
              A great resume highlights your skills, work history, and achievements clearly and concisely. Make sure to:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Tailor your resume to each job</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Use action verbs (e.g., "managed," "built," "led")</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Include relevant certifications or training</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>
                  Use our{' '}
                  <a href="#resume-builder" className="text-indigo-600 hover:underline font-medium">
                    Resume Builder
                  </a>{' '}
                  to craft a professional resume in minutes
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              How can I improve my profile on MakeYourJobs?
            </h3>
            <p className="text-gray-700 leading-relaxed">Complete your profile with:</p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>A short but impactful summary</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Accurate work experience and skills</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>An up-to-date resume and a professional photo (if desired)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>A complete profile boosts your visibility to employers!</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "interview-prep",
      title: 'Interview Preparation',
      icon: <Briefcase className="h-5 w-5 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">What are common interview questions?</h3>
            <p className="text-gray-700 leading-relaxed">
              Here are a few questions often asked across different industries:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>"Tell me about yourself."</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>"Why do you want to work here?"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>"What are your strengths and weaknesses?"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>"Describe a time you solved a problem at work."</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">How do I prepare for an interview?</h3>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Research the company and the role</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Practice answering questions out loud</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Dress appropriately for the job type (casual, uniformed, or formal)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Be on time and follow up with a thank-you message</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "career-growth",
      title: 'Career Growth & Upskilling',
      icon: <Award className="h-5 w-5 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">How do I grow in my current role?</h3>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Ask for feedback regularly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Take initiative and volunteer for tasks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Build relationships with colleagues and managers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Consider short-term training or online courses to boost your skills</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Are there resources for learning new skills?</h3>
            <p className="text-gray-700 leading-relaxed">
              Yes! Check out our{' '}
              <a href="#skill-resources" className="text-indigo-600 hover:underline font-medium">
                Skill Development Resources
              </a>{' '}
              page for free and low-cost training programs in trades, digital skills, and professional development.
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "switching-careers",
      title: 'Switching Careers',
      icon: <RefreshCw className="h-5 w-5 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Is it too late to change careers?</h3>
            <p className="text-gray-700 leading-relaxed">
              Never. Whether you're moving from a field job to an office role or vice versa, career shifts are more common
              than ever. Focus on:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Transferable skills (teamwork, problem-solving, time management)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Gaining basic certifications in your new field</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Starting with entry-level roles or internships</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">What if I don't have experience in the new field?</h3>
            <p className="text-gray-700 leading-relaxed">
              No worries. Highlight your motivation to learn, and consider volunteering or part-time gigs to gain practical
              experience.
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "workplace-tips",
      title: 'Workplace Tips & Mental Wellbeing',
      icon: <Heart className="h-5 w-5 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">How do I handle stress at work?</h3>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Take short breaks when needed</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Stay organized and prioritize tasks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Talk to your manager if your workload is unmanageable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Don't hesitate to ask for help</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              What should I do if I'm facing discrimination or unfair treatment?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              MakeYourJobs stands for equal opportunity. If you face any form of harassment or bias, you should:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Document the incident</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Report it to your HR or supervisor</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-indigo-500">•</span>
                <span>Reach out to legal aid or worker advocacy groups if needed</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Career Advice from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                MakeYourJobs
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unlock powerful career opportunities with expert guidance. From your first job to a career switch or promotion, we're here to support every step.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('advice-sections').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Career Tips
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adviceSections.slice(0, 3).map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-indigo-100">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    {section.icon}
                    <CardTitle className="text-xl font-bold text-gray-900">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {section.title === 'Resume & Profile Tips' && 
                      "Learn how to create a standout resume and optimize your profile for job searches."
                    }
                    {section.title === 'Interview Preparation' && 
                      "Prepare for interviews with common questions and strategies to impress potential employers."
                    }
                    {section.title === 'Career Growth & Upskilling' && 
                      "Discover ways to grow in your current role and resources for developing new skills."
                    }
                  </CardDescription>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                      onClick={() => {
                        document.getElementById('advice-sections').scrollIntoView({ behavior: 'smooth' });
                        // Add a small delay to ensure the accordion is in view before expanding
                        setTimeout(() => {
                          document.getElementById(section.value).click();
                        }, 300);
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advice Sections using Accordion */}
        <div id="advice-sections" className="max-w-5xl mx-auto scroll-mt-20">
          <Accordion type="single" collapsible className="w-full">
            {adviceSections.map((section, index) => (
              <AccordionItem 
                key={index} 
                value={section.value}
                className="mb-4 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger 
                  id={section.value}
                  className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 text-left flex"
                >
                  <div className="flex items-center">
                    {section.icon}
                    <span className="ml-2 text-xl font-bold text-gray-900">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 bg-white">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call-to-Action Section */}
        <div className="max-w-5xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] mix-blend-overlay opacity-10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-bold text-center">Need Personalized Career Guidance?</CardTitle>
              <CardDescription className="text-indigo-100 text-lg max-w-2xl mx-auto text-center">
                Connect with our Career Support Team or join our Career Tips Newsletter for weekly insights tailored to your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
               <Link to="/contact"  >
               <Button 
                  className="bg-white text-indigo-600 hover:bg-indigo-100 px-8 py-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 w-full md:w-auto"
                  size="lg"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Contact Career Support
                </Button></Link>
                
                {/* <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-4 py-6 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md bg-white border-none"
                    required
                  />
                  <Button 
                    type="submit"
                    className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Subscribe
                  </Button>
                </form> */}
              </div>
              
              {subscriptionSuccess && (
                <div className="mt-6 animate-fade-in">
                  <Alert className="bg-green-100 border-green-200 text-green-800">
                    <AlertTitle className="font-medium">Success!</AlertTitle>
                    <AlertDescription>
                      You've been subscribed to our Career Tips Newsletter. Watch your inbox for weekly career advice!
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerAdvice;