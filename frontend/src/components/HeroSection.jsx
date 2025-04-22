import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedJobs } from '@/redux/browseJob.slice.js';
import { Search, Briefcase, ArrowRight, Loader2, MapPin, AlertCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { cities } from '../lib/state-cities.js';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allJobs } = useSelector(store => store.job);

    // Filter cities based on citySearch input
    const filteredCities = cities
        .filter((city) => city.name.toLowerCase().startsWith(citySearch.toLowerCase()))
        .slice(0, 10); // Limit to 10 results for performance

    async function searchJob() {
        setError(null);
        if (isLoading) return;
        setIsLoading(true);

        try {
            const url = `${JOB_API_END_POINT}/search?jobTitle=${jobType}&city=${location}`;
            const res = await axios.get(url, { withCredentials: true });

            if (res.data.success) {
                dispatch(setSearchedJobs(res.data.jobs));
                navigate('/browse');
            } else {
                dispatch(setSearchedJobs([]));
                setError({
                    type: 'info',
                    title: 'No Jobs Found',
                    message: 'We couldn\'t find any jobs matching your criteria. Try adjusting your search.'
                });
            }
        } catch (error) {
            console.error('Error while searching for jobs:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError({
                        type: 'warning',
                        title: 'Authentication Required',
                        message: 'Please log in to search for jobs.'
                    });
                } else if (error.response.status === 404) {
                    setError({
                        type: 'info',
                        title: '',
                        message: 'Unable to find any jobs matching your search criteria.'
                    });
                } else {
                    setError({
                        type: 'error',
                        title: 'Server Error',
                        message: error.response.data.message || 'Something went wrong. Please try again later.'
                    });
                }
            } else if (error.request) {
                setError({
                    type: 'error',
                    title: 'Network Error',
                    message: 'Please check your connection and try again.'
                });
            } else {
                setError({
                    type: 'error',
                    title: 'Unexpected Error',
                    message: 'An unexpected error occurred. Please try again later.'
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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    };

    const handleCityClick = (cityName) => {
        setLocation(cityName);
        setCitySearch(cityName);
        setShowCityDropdown(false);
    };

    const handleCityInputChange = (e) => {
        setCitySearch(e.target.value);
        setLocation(e.target.value); // Update location as user types
        setShowCityDropdown(true);
    };

    const handleCityInputFocus = () => {
        if (citySearch) {
            setShowCityDropdown(true);
        }
    };

    const handleClickOutside = () => {
        setShowCityDropdown(false);
    };

    const dismissError = () => {
        setError(null);
    };

    const getErrorStyles = (type) => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300';
            case 'warning':
                return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300';
            default:
                return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300';
        }
    };

    const getErrorIcon = (type) => {
        switch (type) {
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
            case 'info':
                return <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
        }
    };

    return (
        <div>
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/bg1.jpeg')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                                Get Your{' '}
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

                        {/* Error message area that replaces the previous text */}
                        <div className="min-h-16 mb-4">
                            {!error ? (
                                <p className="text-lg text-white dark:text-gray-300 max-w-xl leading-relaxed">
                                    Find the perfect role in top companies worldwide. Your next career step is just a search
                                    away.
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
                                        <div className={`rounded-lg border p-3 shadow-md ${getErrorStyles(error.type)}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getErrorIcon(error.type)}
                                                    <div>
                                                        <h5 className="text-sm font-medium">{error.title}</h5>
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

                        <div className="relative w-full max-w-xl">
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 transition-all hover:shadow-purple-100 dark:hover:shadow-purple-900/20">
                                <div className="flex items-center flex-1 w-full">
                                    <Search className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <Input
                                        type="text"
                                        placeholder="Job type (e.g. Developer, Designer)"
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent pl-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="flex items-center flex-1 w-full relative">
                                    <MapPin className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <Input
                                        type="text"
                                        placeholder="Search city (e.g., Agra)"
                                        value={citySearch}
                                        onChange={handleCityInputChange}
                                        onFocus={handleCityInputFocus}
                                        onBlur={() => setTimeout(handleClickOutside, 200)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent pl-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                                        disabled={isLoading}
                                    />
                                    {showCityDropdown && citySearch && (
                                        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                                            {filteredCities.length > 0 ? (
                                                filteredCities.map((city) => (
                                                    <div
                                                        key={city.id}
                                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            handleCityClick(city.name);
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

                                <Button
                                    onClick={searchJobHandler}
                                    className="rounded-full bg-purple-700 hover:bg-purple-800 px-6 py-6 transition-all w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            <span className="hidden sm:inline text-sm font-medium">Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline mr-2 text-sm font-medium">Find Jobs</span>
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


































