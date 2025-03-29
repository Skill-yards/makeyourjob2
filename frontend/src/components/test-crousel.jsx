
import React from 'react';

import { Badge } from './ui/badge';
import { StarIcon, BriefcaseIcon, BuildingIcon } from 'lucide-react';
import CustomCarousel from './crousel';

const FeaturedJobsCarousel = () => {
  // Example featured job data
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Bangalore",
      salary: "₹18-25 LPA",
      tags: ["React", "TypeScript", "UI/UX"],
      featured: true,
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "InnovateLabs",
      location: "Hyderabad",
      salary: "₹16-22 LPA",
      tags: ["Node.js", "MongoDB", "AWS"],
      featured: true,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "GlobalSoft Solutions",
      location: "Pune",
      salary: "₹14-20 LPA",
      tags: ["JavaScript", "Python", "Docker"],
      featured: true,
    },
  ];

  // Create carousel items from the job data
  const carouselItems = featuredJobs.map(job => (
    <div key={job.id} className="h-full w-full p-4 md:p-6">
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="mb-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              Featured
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
              <BuildingIcon className="h-4 w-4 mr-1" />
              <span className="mr-4">{job.company}</span>
              <span>{job.location}</span>
            </div>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-lg font-medium text-sm">
            {job.salary}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {job.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto pt-6 flex justify-between items-center">
          <div className="flex items-center text-yellow-500 dark:text-yellow-400">
            <StarIcon className="fill-current h-4 w-4" />
            <StarIcon className="fill-current h-4 w-4" />
            <StarIcon className="fill-current h-4 w-4" />
            <StarIcon className="fill-current h-4 w-4" />
            <StarIcon className="fill-current h-4 w-4 text-gray-300 dark:text-gray-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">4.0</span>
          </div>
          <button className="text-purple-700 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Badge variant="outline" className="px-4 py-1 mb-3 rounded-full bg-white dark:bg-gray-800 shadow-sm border-purple-200">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-400 font-semibold">Featured Jobs</span>
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Highlighted Opportunities</h2>
          </div>
          <div className="hidden md:block">
            <button className="text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium">
              View All Jobs →
            </button>
          </div>
        </div>
        
        {/* The custom carousel component */}
        <div className="h-[400px] md:h-[350px]">
          <CustomCarousel
            items={carouselItems}
            interval={6000}
            className="h-full"
            slideClassName="px-2"
            indicatorClassName="mt-2"
          />
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button className="text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium">
            View All Jobs →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobsCarousel;