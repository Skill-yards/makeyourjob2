import React from 'react';

import { Badge } from './ui/badge';
import { StarIcon, BriefcaseIcon, BuildingIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
import CustomCarousel from './crousel';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FeaturedJobsCarousel = () => {
  const { allJobs } = useSelector(store => store.job);
  
  // Format salary range for display
  const formatSalary = (salaryRange) => {
    if (!salaryRange) return 'N/A';
    
    const { min, max, currency } = salaryRange;
    
    if (currency === 'INR') {
      return `₹${min}-${max} LPA`;
    }
    
    return `${currency} ${min}-${max}K`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric', 
      month: 'short'
    }).format(date);
  };

  // console.log(allJobs[0].company,"jobcompany");
  

  // Create carousel items from the allJobs data
  const carouselItems = allJobs.map(job => (
    <div key={job._id} className="h-full w-full p-2 sm:p-3 md:p-4">
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 flex flex-col">
        {/* Header section with logo and job type */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {job.company?.logo ? (
              <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                <img 
                  src={job.company.logo} 
                  alt={`${job.companyName} logo`} 
                  className="w-full h-full object-cover"
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src = "https://via.placeholder.com/40?text=logo";
                  // }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 mr-3 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <BuildingIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            )}
            <div>
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                {job.jobType}
              </Badge>
              {job.status === "Open" && (
                <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Active
                </Badge>
              )}
            </div>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-lg font-medium text-sm">
            {formatSalary(job.salaryRange)}
          </div>
        </div>

        {/* Job title and company info */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2">{job.jobTitle}</h3>
        <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 text-sm">
          <div className="flex items-center mr-4 mb-1">
            <BuildingIcon className="h-3.5 w-3.5 mr-1" />
            <span>{job.companyName}</span>
          </div>
          <div className="flex items-center mr-4 mb-1">
            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
            <span>{job.workLocation?.city || 'Remote'}, {job.workLocation?.state || ''}</span>
          </div>
          <div className="flex items-center mb-1">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>
        </div>
        
        {/* Skills section */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.skills && job.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills && job.skills.length > 4 && (
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        {/* Additional job details */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Experience:</span> {job.experienceLevel}+ years
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Workplace:</span> {job.workplacePlane}
          </div>
          {job.numberOfPositions && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Openings:</span> {job.numberOfPositions}
            </div>
          )}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Category:</span> {job.jobCategory}
          </div>
        </div>
        
        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Benefits:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {job.benefits.slice(0, 2).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  {benefit}
                </Badge>
              ))}
              {job.benefits.length > 2 && (
                <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  +{job.benefits.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom section with rating and apply button */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="flex items-center text-yellow-500 dark:text-yellow-400">
            {[1, 2, 3, 4].map((_, i) => (
              <StarIcon key={i} className="fill-current h-3.5 w-3.5" />
            ))}
            <StarIcon className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
            <span className="ml-1.5 text-gray-600 dark:text-gray-400 text-xs">4.0</span>
          </div>
        <Link to={`/jobs/${job._id}`} className="mt-2 md:mt-0">
        <button  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200">
            Apply Now
          </button></Link>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-10">
          <div>
            <Badge variant="outline" className="px-3 py-1 mb-2 sm:mb-3 inline-flex items-center rounded-full bg-white dark:bg-gray-800 shadow-sm border-purple-200">
              <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-400 font-semibold">Featured Jobs</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Highlighted Opportunities</h2>
          </div>
          <div className="hidden md:block">
            <button className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-5 py-2 rounded-lg font-medium transition-colors duration-200">
              View All Jobs →
            </button>
          </div>
        </div>
        
        {/* Handle empty state */}
        {allJobs && allJobs.length > 0 ? (
          <div className="h-[440px] sm:h-[420px] md:h-[380px]">
            <CustomCarousel
              items={carouselItems}
              interval={6000}
              className="h-full"
              slideClassName="px-1.5 md:px-2"
              indicatorClassName="mt-4"
            />
          </div>
        ) : (
          <div className="h-[300px] sm:h-[350px] flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="text-center p-6">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No featured jobs available</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">We're currently updating our job listings. Check back later for exciting new opportunities.</p>
              <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Browse All Categories
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 sm:mt-8 text-center md:hidden">
          <button className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-5 py-2 rounded-lg font-medium transition-colors duration-200">
            View All Jobs →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobsCarousel;