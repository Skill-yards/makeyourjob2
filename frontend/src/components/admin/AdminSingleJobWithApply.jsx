import { useEffect, useState } from 'react';
import { Badge } from './../ui/badge';
import { Button } from './../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Globe,
  User,
  Clock,
  Award,
  Tag,
  Share2,
  Bookmark,
  Star
} from 'lucide-react';
import { Skeleton } from './../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./../ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../ui/tabs";
import Navbar from '../shared/Navbar';

const AdminSingleWithApply = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${JOB_API_END_POINT}/admin-get/${jobId}`, { withCredentials: true });

        if (res.data.success) {
          console.log(res.data.job);
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(app => app.applicant === user?._id));
        } else {
          setError(res.data.message || 'Failed to load job details');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const handleApply = async () => {
    try {
      // Apply logic here
      setShowSuccessDialog(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Job removed from bookmarks' : 'Job saved to bookmarks');
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: singleJob.jobTitle,
        text: `Check out this ${singleJob.jobTitle} position at ${singleJob.companyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  const getStatusBgClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  const SuccessDialog = () => (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold mt-4">
            Application Submitted!
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Thank you for your interest! Your application has been successfully submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Great!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Loading state with shimmer effect
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-36 w-full mb-8 rounded-lg" />
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-6" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !singleJob) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
        <Card className="border-destructive shadow-lg">
          <CardContent className="pt-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <p className="font-medium">{error || 'Job not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format post date
  const postedDate = new Date(singleJob.postedDate);
  const today = new Date();
  const diffTime = Math.abs(today - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const formattedPostedDate = diffDays <= 1
    ? 'Today'
    : diffDays < 7
      ? `${diffDays} days ago`
      : postedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <Navbar />
      {/* Mobile Back Button */}
      <div className="mb-4 lg:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-slate-100">
          ← Back to Jobs
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2">
          {/* Job Header Card */}
          <Card className="shadow-md border-none overflow-hidden bg-white mb-6">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                  {singleJob.company?.logo ? (
                    <div className="h-16 w-16 p-1 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-sm">
                      <img
                        src={singleJob.company.logo}
                        alt={`${singleJob.companyName} logo`}
                        className="h-14 w-14 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {singleJob.companyName.charAt(0)}
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800">
                      {singleJob.jobTitle}
                    </CardTitle>
                    <div className="flex items-center text-slate-600">
                      <span className="font-medium">{singleJob.companyName}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {singleJob.workLocation.city}, {singleJob.workLocation.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {singleJob.jobType}
                </Badge>
                {singleJob.salaryRange?.min && singleJob.salaryRange?.max && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    {singleJob.salaryRange.min} - {singleJob.salaryRange.max} {singleJob.salaryRange.currency}/{singleJob.salaryRange.frequency}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  {singleJob.experienceLevel} years exp
                </Badge>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Posted {formattedPostedDate}
                </Badge>
              </div>
              {/* 
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`rounded-full px-6 shadow-md ${
                    isApplied 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                  }`}
                >
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleBookmark}
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={shareJob}
                  className="rounded-full border-slate-200 hover:bg-slate-50"
                >
                  <Share2 className="h-5 w-5 text-slate-400" />
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="details" className="text-sm font-medium">Details</TabsTrigger>
              <TabsTrigger value="company" className="text-sm font-medium">Company</TabsTrigger>
              <TabsTrigger value="applicants" className="text-sm font-medium">
                Applicants ({singleJob.applications?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-2">
              {/* Job Description */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{singleJob.description}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              {singleJob.skills?.length > 0 && (
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-slate-800">Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {singleJob.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 rounded-full px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {singleJob.benefits?.length > 0 && (
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-slate-800">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {singleJob.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="company" className="space-y-6 mt-2">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">About {singleJob.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">Company Name</h3>
                      <p className="text-slate-600">{singleJob.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">Location</h3>
                      <p className="text-slate-600">
                        {singleJob.company?.location || `${singleJob.workLocation.city}, ${singleJob.workLocation.country}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Globe className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">Website</h3>
                      {singleJob.company?.website ? (
                        <a
                          href={singleJob.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          {singleJob.company.website.replace(/^https?:\/\/(www\.)?/i, '')}
                        </a>
                      ) : (
                        <p className="text-slate-600">Not available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posted By */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">Posted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-slate-200">
                      <AvatarImage src={singleJob.created_by?.profile?.avatar} alt={singleJob.created_by?.fullname} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">{singleJob.created_by?.fullname?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-800">{singleJob.created_by?.fullname}</p>
                      <p className="text-sm text-slate-600">{singleJob.created_by?.email}</p>
                      <Badge variant="outline" className="mt-1 text-xs bg-slate-50">
                        {singleJob.created_by?.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applicants Tab */}
            <TabsContent value="applicants" className="space-y-6 mt-2">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Applicants ({singleJob.applications?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {singleJob.applications?.length > 0 ? (
                    <div className="space-y-4">
                      {singleJob.applications.map((application) => (
                        <div key={application._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white">
                              <AvatarImage src={application.applicant?.profile?.profilePhoto} alt={application.applicant?.fullname} />
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">{application.applicant?.fullname?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-slate-600">{application.applicant?.email}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Link to={`/admin/jobs/${jobId}/applicants/${application._id}`}>
                                    <Button variant="outline" size="sm" className="h-8 rounded-full">
                                      View Profile
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`h-8 rounded-full text-white ${getStatusBgClass(application.status)}`}
                                  >
                                    {application.status}
                                  </Button>
                                </div>
                              </div>
                              {application.applicant?.profile?.skills && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {application.applicant.profile.skills.slice(0, 5).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-slate-100 border-none text-slate-600">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No applicants yet for this job.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Job Summary & Actions */}
        <div className="space-y-6">
          {/* Job Summary Card */}
          <Card className="shadow-md border-slate-200 bg-white sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Job Type</h3>
                    <p className="text-slate-800">{singleJob.jobType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-full">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Work Location</h3>
                    <p className="text-slate-800">{singleJob.workplacePlane}</p>
                    <p className="text-sm text-slate-600">
                      {singleJob.workLocation.city}, {singleJob.workLocation.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-violet-50 rounded-full">
                    <DollarSign className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Salary Range</h3>
                    <p className="text-slate-800">
                      {singleJob.salaryRange?.min && singleJob.salaryRange?.max
                        ? `${singleJob.salaryRange.min} - ${singleJob.salaryRange.max} ${singleJob.salaryRange.currency}/${singleJob.salaryRange.frequency}`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-full">
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Experience Required</h3>
                    <p className="text-slate-800">{singleJob.experienceLevel} years</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-50 rounded-full">
                    <Tag className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Category</h3>
                    <p className="text-slate-800">{singleJob.jobCategory}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-50 rounded-full">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-700 text-sm">Available Positions</h3>
                    <p className="text-slate-800">{singleJob.numberOfPositions}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium text-slate-700 text-sm">Posted Date</h3>
                    <p className="text-slate-800">{formattedPostedDate}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* <div className="space-y-3">
                <Button 
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`w-full rounded-full shadow ${
                    isApplied 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                  }`}
                >
                  {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={toggleBookmark}
                    className="flex-1 rounded-full border-slate-200"
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    {bookmarked ? 'Saved' : 'Save Job'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={shareJob}
                    className="flex-1 rounded-full border-slate-200"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Similar Jobs Suggestion */}
          <Card className="shadow-md border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                        {singleJob.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">{singleJob.jobTitle}</h3>
                        <div className="flex items-center text-sm text-slate-500">
                          <span>{singleJob.companyName}</span>
                          <span className="mx-1">•</span>
                          <span>{singleJob.workLocation.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="w-full text-indigo-600">
                  View More Similar Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SuccessDialog />
    </div>
  );
};

export default AdminSingleWithApply;