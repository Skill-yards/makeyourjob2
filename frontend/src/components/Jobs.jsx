import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { motion } from 'framer-motion';
import Footer from './shared/Footer'
import { 
  Briefcase, 
  Search, 
  MapPin, 
  AlertCircle 
} from "lucide-react";
import { 
  Card, 
  CardContent   
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const [error, setError] = useState(null);

  console.log(allJobs);
  
  
  useEffect(() => {
    try {
      // Make sure allJobs is an array
      const jobsArray = Array.isArray(allJobs) ? allJobs : [];
      
      if (searchedQuery && searchedQuery.trim() !== '') {
        const query = searchedQuery.toLowerCase();
        
        const filteredJobs = jobsArray.filter((job) => {
          // Check if job properties exist before calling toLowerCase()
          const title = job?.title?.toLowerCase() || '';
          const description = job?.description?.toLowerCase() || '';
          const location = job?.location?.toLowerCase() || '';
          
          return title.includes(query) || 
                 description.includes(query) || 
                 location.includes(query);
        });
        
        setFilterJobs(filteredJobs);
      } else {
        setFilterJobs(jobsArray);
      }
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("Error filtering jobs:", err);
      setError("An error occurred while filtering jobs. Please try again.");
      // Set empty array for filtered jobs to prevent further errors
      setFilterJobs([]);
    }
  }, [allJobs, searchedQuery]);

  // Empty state variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
   <>
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      
      <div className="flex flex-col gap-6 md:flex-row md:gap-8 mt-6">
        <div className="md:w-1/4">
          <FilterCard />
        </div>
        
        <div className="md:w-3/4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search size={16} />
                <span>
                  {searchedQuery ? (
                    <>Showing results for <span className="font-medium text-primary">"{searchedQuery}"</span></>
                  ) : (
                    "Showing all available jobs"
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Display error message if an error occurred */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {(!error && filterJobs.length <= 0) ? (
            <motion.div 
              className="flex flex-col items-center justify-center p-12 text-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold mb-2" 
                variants={itemVariants}
              >
                No Jobs Found
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground mb-6 max-w-md" 
                variants={itemVariants}
              >
                {searchedQuery ? (
                  <>We couldn't find any jobs matching "<span className="font-medium">{searchedQuery}</span>". Try adjusting your search criteria.</>
                ) : (
                  "There are currently no job listings available. Please check back later or try different filters."
                )}
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Suggestions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 mt-2 text-left">
                      <li>Check for spelling errors</li>
                      <li>Try using more general keywords</li>
                      <li>Clear filters and search again</li>
                      <li>Browse all categories from the sidebar</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filterJobs.map((job) => (
                <motion.div key={job?.id || `job-${Math.random()}`} variants={itemVariants}>
                  <Job job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
    <Footer />
   </>
  );
};

export default Jobs;