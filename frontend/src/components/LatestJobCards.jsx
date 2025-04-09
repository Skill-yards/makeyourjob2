import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Briefcase, MapPin, Clock, DollarSign, Users, ExternalLink, BookmarkPlus, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Random company logo color for demo
  const logoColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-600', 'bg-rose-500', 'bg-amber-500'];
  const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];

  // Check if the job was posted recently (within the last 7 days)
  const isRecent = Math.random() > 0.7; // Demo purposes only - replace with actual logic

  return (
    <Card 
      className="group h-full transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900 relative overflow-hidden bg-white dark:bg-gray-800"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      {/* Background pattern for visual interest */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 dark:from-purple-900/30 to-transparent rounded-bl-full opacity-50"></div>
      
      {/* Recent job badge */}
      {isRecent && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium">
            New
          </Badge>
        </div>
      )}

      <CardHeader className="p-5 pb-0 flex flex-row items-start gap-4">
        <Avatar className={cn("rounded-md h-12 w-12 flex items-center justify-center text-white", randomColor)}>
          {job?.company?.name?.charAt(0) || 'C'}
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
            {job?.company?.name || "Company Name"}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{job?.location || "India"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
          {job?.title || "Job Title"}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {truncateText(job?.description, 100) || "Job description goes here..."}
        </p>
        
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-3.5 w-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />
            <span>{job?.position || "3"} Positions</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />
            <span>{job?.jobType || "Full-time"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <IndianRupee className="h-3.5 w-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />
            <span>{job?.salary || "8-10"} LPA</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />
            <span>{job?.experience || "2-5"} years</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pt-0 pb-5 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 font-medium">
            {job?.position} Positions
          </Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800 font-medium">
            {job?.jobType || "Full-time"}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 font-medium">
            {job?.salary || "8-10"}LPA
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 text-gray-500 hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-400"
            onClick={(e) => {
              e.stopPropagation();
              // Add bookmark functionality
            }}
          >
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
      
      {/* Border accent at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </Card>
  );
};

export default LatestJobCards;