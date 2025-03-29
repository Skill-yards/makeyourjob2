import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Clock, Briefcase, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { toast } from 'sonner';

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const getCompanyInitials = (companyName) => {
        if (!companyName) return "CO";
        return companyName.split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const truncateDescription = (description, maxLength = 120) => {
        if (!description) return '';
        return description.length > maxLength 
            ? `${description.substring(0, maxLength)}...` 
            : description;
    };

    const handleSaveForLater = () => {
        // Get existing saved jobs from localStorage or initialize empty array
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        
        // Check if job is already saved
        const isAlreadySaved = savedJobs.some(savedJob => savedJob._id === job._id);
        
        if (!isAlreadySaved) {
            // Create job object to save
            const jobToSave = {
                _id: job._id,
                title: job.title,
                company: {
                    name: job.company?.name,
                    logo: job.company?.logo
                },
                jobType: job.jobType,
                salary: job.salary,
                position: job.position,
                createdAt: job.createdAt
            };

            // Add new job to array and save to localStorage
            const updatedSavedJobs = [...savedJobs, jobToSave];
            localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));

            // Show success toast
            toast.success(
                <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-green-600" />
                    <div>
                        <span className="font-semibold">Job Saved!</span>
                        <p className="text-sm">You can view "{job.title}" in your saved jobs later.</p>
                    </div>
                </div>,
                {
                    duration: 3000,
                    style: {
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                    }
                }
            );
        } else {
            // Show info toast if job is already saved
            toast.info(
                <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-600" />
                    <span>This job is already saved in your list.</span>
                </div>,
                {
                    duration: 2000,
                    style: {
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                    }
                }
            );
        }
    };

    return (
        <Card className="w-full hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200">
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                <div className="flex gap-3">
                    <Avatar className="h-12 w-12 rounded-md border border-gray-200">
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name || "Company"} />
                        <AvatarFallback className="rounded-md bg-purple-100 text-purple-700 font-semibold">
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{job?.title}</h3>
                            {job?.featured && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                                    Featured
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                            <span className="font-medium text-gray-700">{job?.company?.name}</span>
                            <span className="mx-1.5">•</span>
                            <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>India</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600 flex items-center gap-1 mr-1.5">
                                <Clock className="h-2.5 w-2.5" />
                                {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-600">
                    <Bookmark className="h-5 w-5" />
                </Button>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {truncateDescription(job?.description)}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-purple-50 border-purple-100 text-purple-700 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {job?.jobType || "Full Time"}
                    </Badge>
                    
                    <Badge variant="outline" className="bg-green-50 border-green-100 text-green-700 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {job?.salary || "0"}LPA
                    </Badge>
                    
                    <Badge variant="outline" className="bg-blue-50 border-blue-100 text-blue-700">
                        {job?.position || "0"} Position{job?.position !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-3 flex items-center justify-between flex-wrap gap-2">
                <Button 
                    variant="default" 
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5"
                    onClick={() => navigate(`/description/${job?._id}`)}
                >
                    <ExternalLink className="h-4 w-4" />
                    View Details
                </Button>
                
                <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={handleSaveForLater}
                >
                    <Bookmark className="h-4 w-4 mr-1.5" />
                    Save For Later
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Job;