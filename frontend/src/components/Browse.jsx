

import { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import {  FolderSearch, MousePointerClick, RefreshCw, Search } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import Footer from './shared/Footer'

const Browse = () => {
  useGetAllJobs();
  const { allJobs, isLoading } = useSelector(store => store.job);
  const dispatch = useDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    }
  }, [dispatch]);

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse"></div>
        <FolderSearch className="relative h-16 w-16 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h2>
      <p className="text-gray-600 max-w-md mb-6">
        We're currently refreshing our job listings. The perfect opportunity is just around the corner!
      </p>
      <div className="space-y-4 w-full max-w-md">
        <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <MousePointerClick className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
          <p className="text-sm text-gray-700 text-left">Try adjusting your search filters or keywords</p>
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <Search className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
          <p className="text-sm text-gray-700 text-left">Browse different categories or industries</p>
        </div>
      </div>
      <Button 
        className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full px-6"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Results
      </Button>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
          <div className="flex space-x-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
   <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="font-bold text-2xl text-gray-800">Discovering Jobs...</h1>
            </div>
            <LoadingSkeleton />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              {allJobs.length > 0 ? (
                <h1 className="font-bold text-2xl text-gray-800">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    {allJobs.length}
                  </span> Opportunities Found
                </h1>
              ) : (
                <h1 className="font-bold text-2xl text-gray-800">Job Search Results</h1>
              )}
            </div>
            
            {allJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>
    </div>
    <Footer/>
   </>
  );
};

export default Browse;