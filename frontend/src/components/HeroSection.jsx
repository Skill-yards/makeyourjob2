import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedJobs } from "@/redux/browseJob.slice.js";
import {
  Search,
  Briefcase,
  ArrowRight,
  Loader2,
  MapPin,
  AlertCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { cities } from "../lib/state-cities.js";
import { motion, AnimatePresence } from "framer-motion";

// Predefined job titles for suggestions
const jobTitles = [
  "Python Developer",
  "Node.js Developer",
  "Nest js Developer",
  "JavaScript Developer",
  "Full Stack Developer",
  "Back End Developer",
  "Front End Developer",
  "Software Engineer",
  "Data Scientist",
  "UI/UX Designer",
];

const HeroSection = () => {
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ref for detecting clicks outside the dropdown
  const jobDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  // Ref for the job input container and city input container for scrolling
  const jobInputContainerRef = useRef(null);
  const cityInputContainerRef = useRef(null);

  const { allJobs } = useSelector((store) => store.job);

  // Effect to handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        jobDropdownRef.current &&
        !jobDropdownRef.current.contains(event.target)
      ) {
        setShowJobDropdown(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter job titles based on the current search input
  const filteredJobs = jobTitles
    .filter((job) => job.toLowerCase().includes(jobSearch.toLowerCase()))
    .filter((job) => !selectedJobTitles.includes(job)) // Avoid duplicates
    .slice(0, 10); // Limit to 10 results

  // Filter cities based on the current search input
  const filteredCities = cities
    .filter((city) =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    )
    .filter((city) => !selectedCities.includes(city.name)) // Avoid duplicates
    .slice(0, 10);

  // Experience level options
  const experienceOptions = [
    { label: "Fresher (less than 1 year)", value: "0" },
    { label: "1 year", value: "1" },
    { label: "2 years", value: "2" },
    { label: "3 years", value: "3" },
    { label: "4 years", value: "4" },
    { label: "6 years", value: "6" },
    { label: "7 years", value: "7" },
    { label: "8 years", value: "8" },
    { label: "9 years", value: "9" },
    { label: "10 years", value: "10" },
    { label: "11 years", value: "11" },
    { label: "12 years", value: "12" },
    { label: "13 years", value: "13" },
    { label: "14 years", value: "14" },
    { label: "15 years", value: "15" },
  ];

  async function searchJob() {
    setError(null);
    if (isLoading) return;
    setIsLoading(true);

    if (
      !selectedJobTitles.length &&
      !selectedCities.length &&
      !experienceLevel
    ) {
      setError({
        type: "error",
        title: "Invalid Input",
        message:
          "Please provide at least one search parameter (job title, city, or experience level).",
      });
      setIsLoading(false);
      return;
    }

    try {
      const jobTitle = selectedJobTitles.join(", ");
      const city = selectedCities.join(", ");
      const url = `${JOB_API_END_POINT}/search?jobTitle=${encodeURIComponent(
        jobTitle
      )}&city=${encodeURIComponent(city)}&experienceLevel=${encodeURIComponent(
        experienceLevel
      )}`;
      const res = await axios.get(url, { withCredentials: true });

      if (res.data.success) {
        dispatch(setSearchedJobs(res.data.jobs));
        navigate("/browse");
      } else {
        dispatch(setSearchedJobs([]));
        setError({
          type: "info",
          title: "No Jobs Found",
          message:
            "We couldn't find any jobs matching your criteria. Try adjusting your search.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError({
            type: "warning",
            title: "Authentication Required",
            message: "Please log in to search for jobs.",
          });
        } else if (error.response.status === 400) {
          setError({
            type: "error",
            title: "Invalid Input",
            message:
              error.response.data.message ||
              "Please provide valid search parameters.",
          });
        } else if (error.response.status === 404) {
          setError({
            type: "info",
            title: "",
            message: "Unable to find any jobs matching your search criteria.",
          });
        } else {
          setError({
            type: "error",
            title: "Server Error",
            message:
              error.response.data.message ||
              "Something went wrong. Please try again later.",
          });
        }
      } else if (error.request) {
        setError({
          type: "error",
          title: "Network Error",
          message: "Please check your connection and try again.",
        });
      } else {
        setError({
          type: "error",
          title: "Unexpected Error",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
      dispatch(setSearchedJobs([]));
    } finally {
      setIsLoading(false);
    }
  }

  const searchJobHandler = () => {
    searchJob();
  };

  const handleJobSelect = (jobName) => {
    if (!selectedJobTitles.includes(jobName)) {
      const newSelectedJobs = [...selectedJobTitles, jobName];
      setSelectedJobTitles(newSelectedJobs);
      setJobSearch(""); // Clear the input after selection
      setShowJobDropdown(false);

      // Scroll to the end of the job input container to show the newly added job
      setTimeout(() => {
        if (jobInputContainerRef.current) {
          jobInputContainerRef.current.scrollLeft =
            jobInputContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  };

  const handleJobRemove = (jobToRemove) => {
    setSelectedJobTitles(
      selectedJobTitles.filter((job) => job !== jobToRemove)
    );
  };

  const handleCitySelect = (cityName) => {
    if (!selectedCities.includes(cityName)) {
      const newSelectedCities = [...selectedCities, cityName];
      setSelectedCities(newSelectedCities);
      setCitySearch(""); // Clear the input after selection
      setShowCityDropdown(false);

      // Scroll to the end of the city input container to show the newly added city
      setTimeout(() => {
        if (cityInputContainerRef.current) {
          cityInputContainerRef.current.scrollLeft =
            cityInputContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  };

  const handleCityRemove = (cityToRemove) => {
    setSelectedCities(selectedCities.filter((city) => city !== cityToRemove));
  };

  const handleJobInputChange = (e) => {
    setJobSearch(e.target.value);
    setShowJobDropdown(true);
  };

  const handleJobInputFocus = () => {
    setShowJobDropdown(true);
  };

  const handleCityInputChange = (e) => {
    setCitySearch(e.target.value);
    setShowCityDropdown(true);
  };

  const handleCityInputFocus = () => {
    setShowCityDropdown(true);
  };

  const dismissError = () => {
    setError(null);
  };

  const getErrorStyles = (type) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300";
      default:
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300";
    }
  };

  const getErrorIcon = (type) => {
    switch (type) {
      case "error":
        return (
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
        );
      case "warning":
        return (
          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        );
      case "info":
        return (
          <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        );
      default:
        return (
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
        );
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/bg1.jpeg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 dark:bg-purple-900 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24 md:py-32">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="px-6 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border-purple-200 mb-8"
            >
              <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-400 font-semibold">
                No. 1 Job Hunt Website
              </span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white dark:text-white">
              Search, Apply &
              <span className="block mt-2">
                Get Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 relative">
                  Dream Jobs
                  <svg
                    className="absolute bottom-0 left-0 w-full h-3 -mb-1 text-purple-200 dark:text-purple-900"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      fill="currentColor"
                      d="M0,5 C30,15 70,15 100,5 L100,20 L0,20 Z"
                    ></path>
                  </svg>
                </span>
              </span>
            </h1>

            <div className="min-h-16 mb-4">
              {!error ? (
                <p className="text-lg text-white dark:text-gray-300 max-w-xl leading-relaxed">
                  Find the perfect role in top companies worldwide. Your next
                  career step is just a search away.
                </p>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-xl mx-auto mb-4"
                  >
                    <div
                      className={`rounded-lg border p-3 shadow-md ${getErrorStyles(
                        error.type
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getErrorIcon(error.type)}
                          <div>
                            <h5 className="text-sm font-medium">
                              {error.title}
                            </h5>
                            <p className="text-sm mt-1">{error.message}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={dismissError}
                          className="h-6 w-6 rounded-full hover:bg-opacity-20"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="relative w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 transition-all dark:hover:shadow-purple-900/20">
                {/* Job Title Multi-Selector */}
                <div className="relative flex-1 w-full" ref={jobDropdownRef}>
                  <div className="flex items-center w-full">
                    <Search className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div
                      className="relative flex-1 h-12 overflow-hidden"
                    >
                      <div
                        ref={jobInputContainerRef}
                        className="absolute inset-0 flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2 px-2 no-scrollbar"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <div className="flex items-center gap-2 flex-nowrap mr-4">
                          {selectedJobTitles.map((job, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="inline-flex items-center justify-between px-2 py-1 text-sm text-black dark:text-white bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                            >
                              {job}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleJobRemove(job)}
                                className="h-4 w-4 ml-1 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          <Input
                            type="text"
                            placeholder={
                              selectedJobTitles.length
                                ? ""
                                : "Select job types (e.g., Python Developer)"
                            }
                            value={jobSearch}
                            onChange={handleJobInputChange}
                            onFocus={handleJobInputFocus}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && filteredJobs.length > 0) {
                                handleJobSelect(filteredJobs[0]);
                              }
                            }}
                            className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base w-full min-w-24"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {showJobDropdown && jobSearch && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                      {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                          <div
                            key={job}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleJobSelect(job);
                            }}
                          >
                            {job}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          No job titles found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* City Multi-Selector */}
                <div className="relative flex-1 w-full" ref={cityDropdownRef}>
                  <div className="flex items-center">
                    <MapPin className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div
                      className="relative flex-1 h-12 overflow-hidden"
                    >
                      <div
                        ref={cityInputContainerRef}
                        className="absolute inset-0 flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2 px-2 no-scrollbar"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <div className="flex items-center gap-2 flex-nowrap mr-4">
                          {selectedCities.map((city, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="inline-flex items-center justify-between px-2 py-1 text-sm text-black dark:text-white bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                            >
                              {city}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCityRemove(city)}
                                className="h-4 w-4 ml-1 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          <Input
                            type="text"
                            placeholder={
                              selectedCities.length
                                ? ""
                                : "Select cities (e.g., Agra)"
                            }
                            value={citySearch}
                            onChange={handleCityInputChange}
                            onFocus={handleCityInputFocus}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                filteredCities.length > 0
                              ) {
                                handleCitySelect(filteredCities[0].name);
                              }
                            }}
                            className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base w-full min-w-24"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {showCityDropdown && citySearch && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <div
                            key={city.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleCitySelect(city.name);
                            }}
                          >
                            {city.name} ({city.state})
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          No cities found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Experience Level Dropdown */}
                <div className="flex items-center flex-1 w-full">
                  <Clock className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                  <Select
                    value={experienceLevel}
                    onValueChange={setExperienceLevel}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="flex-1 border-none shadow-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base">
                      <SelectValue placeholder="Experience (e.g., 1-2 years)" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceOptions.map((option) => (
                        <SelectItem
                          key={option.value || option.label}
                          value={option.value || "0"}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <Button
                  onClick={searchJobHandler}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-6 transition-all w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      <span className="inline text-sm font-medium">
                        Searching...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline md:inline mr-2 text-sm font-medium">
                        Search
                      </span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/20">
                <span className="bg-purple-500/80 text-white px-3 py-1 rounded-full font-semibold">
                  10,000+
                </span>
                <span className="ml-3">Jobs Listed</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/20">
                <span className="bg-purple-500/80 text-white px-3 py-1 rounded-full font-semibold">
                  8,000+
                </span>
                <span className="ml-3">Companies</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/20">
                <span className="bg-purple-500/80 text-white px-3 py-1 rounded-full font-semibold">
                  95%
                </span>
                <span className="ml-3">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;