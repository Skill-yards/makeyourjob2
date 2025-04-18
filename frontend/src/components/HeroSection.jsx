import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Search, Briefcase, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setSearchedJobs } from '@/redux/browseJob.slice.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const HeroSection = () => {
    const [jobType, setJobType] = useState("");
    const [location, setLocation] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.jobBrowse);
    const { allJobs } = useSelector(store => store.job);

    console.log(allJobs, "all jobs in hero section");

    async function searchJob() {
        try {
            const url = `${JOB_API_END_POINT}/search?jobTitle=${jobType}&city=${location}`;
            const res = await axios.get(url, {
                withCredentials: true
            });
            console.log(res, "check");

            if (res.data.success) {
                dispatch(setSearchedJobs(res.data.jobs));
                navigate("/browse");
            } else {
                dispatch(setSearchedJobs(allJobs));
                console.log("No jobs found");
            }
        } catch (error) {
            console.log(error, "error while searching");
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

    return (
        <div>
            <div className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 dark:bg-purple-900 blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24 md:py-32">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <Badge variant="outline" className="px-6 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border-purple-200 mb-8 animate-pulse-once">
                            <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                            <span className="text-purple-700 dark:text-purple-400 font-semibold">No. 1 Job Hunt Website</span>
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                            Search, Apply & 
                            <span className="block mt-2">Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 relative">
                                Dream Jobs
                                <svg className="absolute bottom-0 left-0 w-full h-3 -mb-1 text-purple-200 dark:text-purple-900" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path fill="currentColor" d="M0,5 C30,15 70,15 100,5 L100,20 L0,20 Z"></path>
                                </svg>
                            </span></span>
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
                            Find the perfect role in top companies worldwide. Your next career step is just a search away.
                        </p>

                        <div className="relative w-full max-w-2xl">
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 transition-all hover:shadow-purple-100 dark:hover:shadow-purple-900/20">
                                <div className="flex items-center flex-1">
                                    <Search className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <Input
                                        type="text"
                                        placeholder="Job type (e.g. Developer, Designer)"
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent pl-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                                    />
                                </div>
                                <div className="flex items-center flex-1">
                                    <MapPin className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="w-full border-none shadow-none focus:ring-0 bg-transparent">
                                            <SelectValue placeholder="Select a state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            {indianStates.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {loading ? <Loader2 /> : (
                                    <Button 
                                        onClick={searchJobHandler} 
                                        className="rounded-full bg-purple-700 hover:bg-purple-800 px-6 py-6 transition-all"
                                    >
                                        <span className="hidden sm:inline mr-2 text-sm font-medium">Find Jobs</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">10,000+</span>
                                <span className="ml-3">Jobs Listed</span>
                            </div>
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">8,000+</span>
                                <span className="ml-3">Companies</span>
                            </div>
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">95%</span>
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