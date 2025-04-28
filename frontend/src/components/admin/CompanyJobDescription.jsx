import { useEffect, useState } from 'react';
import { Badge } from './../ui/badge';
import { Button } from './../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './../ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleCompany } from '@/redux/companySlice';
import { useDispatch, useSelector } from 'react-redux';

import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Users, 
  Calendar,
  AlertCircle,
  Globe,
  Building,
  Clock,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { Skeleton } from './../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './../ui/avatar';
import { Separator } from './../ui/separator';

const CompanyJobDescription = () => {
  const { singleCompany } = useSelector(store => store.company);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("company");

  const params = useParams();
  const companyId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch company and related jobs
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch company details
        const companyRes = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
        if (companyRes.data.success) {
          dispatch(setSingleCompany(companyRes.data.company));
        }

        // Fetch all jobs and filter by company
        const jobsRes = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
        if (jobsRes.data.success) {
          const companyJobs = jobsRes.data.jobs.filter(job => job.company?._id === companyId);
          setJobs(companyJobs);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load company details');
        toast.error("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId, dispatch]);

  const handleViewJob = (jobId) => {
    navigate(`/admin/jobs/${jobId}`);
  };

  // Function to create company name initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "CO";
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
        <Card className="border-destructive shadow-lg">
          <CardContent className="pt-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(singleCompany?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      {/* Company Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute -bottom-12 sm:-bottom-10 left-6 flex items-end">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={singleCompany?.logo} alt={singleCompany?.name} />
            <AvatarFallback className="bg-violet-100 text-violet-800 text-lg font-bold">
              {getInitials(singleCompany?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-12 sm:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{singleCompany?.name}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {singleCompany?.location}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
              <Building className="h-3.5 w-3.5 mr-1" />
              {jobs.length} Jobs Available
            </Badge>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={() => window.open(singleCompany?.website, '_blank')} className="gap-1.5">
            <Globe className="h-4 w-4" />
            Website
          </Button>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5">
            <Mail className="h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="company" className="text-sm">Company Info</TabsTrigger>
          <TabsTrigger value="jobs" className="text-sm">Available Jobs ({jobs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Company Overview</CardTitle>
              <CardDescription>Learn more about {singleCompany?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{singleCompany?.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Company Details</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{singleCompany?.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 rounded-full">
                        <Globe className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Website</p>
                        <a 
                          href={singleCompany?.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-violet-600 hover:text-violet-800 hover:underline flex items-center"
                        >
                          {singleCompany?.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 rounded-full">
                        <Calendar className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Established</p>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="border bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Company Stats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="border bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Jobs</span>
                        <div className="p-2 bg-violet-50 rounded-full">
                          <Briefcase className="h-4 w-4 text-violet-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{jobs.length}</p>
                    </div>
                    
                    <div className="border bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Jobs</span>
                        <div className="p-2 bg-green-50 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{jobs.filter(job => job.status !== 'closed').length}</p>
                    </div>
                    
                    <div className="border bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Applicants</span>
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}
                      </p>
                    </div>
                    
                    <div className="border bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average Salary</span>
                        <div className="p-2 bg-amber-50 rounded-full">
                          <DollarSign className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {jobs.length ? `$${Math.round(jobs.reduce((acc, job) => {
                          const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
                          return acc + (isNaN(salaryNum) ? 0 : salaryNum);
                        }, 0) / jobs.length).toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Available Positions</CardTitle>
              <CardDescription>
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available at {singleCompany?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job._id} className="overflow-hidden transition-all hover:border-violet-200 hover:shadow-md">
                      <CardContent className="p-0">
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                                <p className="text-sm text-gray-500">{singleCompany?.name} • {singleCompany?.location}</p>
                              </div>
                              
                              <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {job.jobType}
                                </Badge>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {job.salary}
                                </Badge>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </Badge>
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  <Users className="h-3 w-3 mr-1" />
                                  {job.applications?.length || 0} Applicants
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0">
                              <Button
                                onClick={() => handleViewJob(job._id)}
                                className="bg-violet-600 hover:bg-violet-700 px-4 w-full sm:w-auto sm:whitespace-nowrap"
                              >
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-slate-100 rounded-full mb-4">
                    <Briefcase className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">No Jobs Available</h3>
                  <p className="text-gray-500 max-w-md">
                    {singleCompany?.name} doesn't have any active job listings at the moment. Check back later for new opportunities.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyJobDescription;