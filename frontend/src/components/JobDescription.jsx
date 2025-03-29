import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useParams } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        setShowSuccessDialog(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(app => app.applicant === user?._id));
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Success Dialog
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
            The hiring team will review your profile and get back to you soon.
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-[28rem] w-full rounded-lg" />
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

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl border-none overflow-hidden bg-gradient-to-b from-white to-slate-50">
        {/* Header Section */}
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                {singleJob?.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.position} Positions
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.jobType}
                </Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied || isLoading}
              className={`w-full sm:w-auto transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium shadow-md ${
                isApplied 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isApplied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Already Applied
                </>
              ) : (
                'Apply Now'
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Job Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Role</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Salary</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.salary} LPA</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Total Applicants</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.applications?.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Posted Date</h3>
                  <p className="text-gray-600 mt-1">{new Date(singleJob?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Experience</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.experience} years</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{singleJob?.description}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Success Dialog */}
      <SuccessDialog />
    </div>
  );
};

export default JobDescription;