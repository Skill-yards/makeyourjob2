import { useEffect, useState } from 'react';
import { Badge } from './../ui/badge';
import { Button } from './../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { useNavigate, useParams } from 'react-router-dom';
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
} from 'lucide-react';
import { Skeleton } from './../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./../ui/dialog";
import { DialogTitle } from './../ui/dialog';

const AdminSingleWithApply = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${JOB_API_END_POINT}/admin-get/${jobId}`, { withCredentials: true });
        
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
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                {singleJob?.jobTitle}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.numberOfPositions} Positions
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.jobType}
                </Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  <span className="mr-1">₹</span>
                  {singleJob?.salaryRange 
                    ? `${singleJob.salaryRange.minSalary} - ${singleJob.salaryRange.maxSalary} LPA`
                    : 'Salary not specified'}
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {singleJob?.workplacePlane} ({singleJob?.workLocation?.city}, {singleJob?.workLocation?.state})
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {singleJob?.company?.logo && (
                <img 
                  src={singleJob.company.logo} 
                  alt={`${singleJob.company.name} logo`}
                  className="h-12 w-12 object-contain rounded-full self-end"
                />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Job Details */}
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Role</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Work Location</h3>
                  <p className="text-gray-600 mt-1">
                    {singleJob?.workplacePlane} ({singleJob?.workLocation 
                      ? `${singleJob.workLocation.city}, ${singleJob.workLocation.state}, ${singleJob.workLocation.area}, ${singleJob.workLocation.streetAddress}, ${singleJob.workLocation.pincode}`
                      : singleJob?.location})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <span className="text-emerald-600 text-lg">₹</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Salary</h3>
                  <p className="text-gray-600 mt-1">
                    {singleJob?.salaryRange 
                      ? `${singleJob.salaryRange.minSalary} - ${singleJob.salaryRange.maxSalary} LPA`
                      : 'Salary not specified'}
                  </p>
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
                  <p className="text-gray-600 mt-1">{singleJob?.applications?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Posted Date</h3>
                  <p className="text-gray-600 mt-1">
                    {new Date(singleJob?.postedDate || singleJob?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-200 transition-colors">
                  <Award className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Experience Level</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.experienceLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Category</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.jobCategory}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Job Info */}
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Additional Information</h3>
            <div className="text-gray-700 space-y-2">
              {singleJob?.status && <p><strong>Status:</strong> {singleJob.status}</p>}
              {singleJob?.deadline && (
                <p><strong>Application Deadline:</strong> {new Date(singleJob.deadline).toLocaleDateString()}</p>
              )}
              {singleJob?.numberOfPositions && <p><strong>Positions:</strong> {singleJob.numberOfPositions}</p>}
            </div>
          </div>

          {/* Company Details */}
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Company Name</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600 mt-1">{singleJob?.workLocation 
                    ? `${singleJob.workLocation.city}, ${singleJob.workLocation.state}`
                    : singleJob?.location}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Website</h3>
                  <a href={singleJob?.company?.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 mt-1 hover:underline">
                    {singleJob?.company?.website || 'Not specified'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Details */}
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Posted By
          </h2>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-8">
            <Avatar>
              <AvatarImage src={singleJob?.created_by?.profile?.avatar} alt={singleJob?.created_by?.fullname} />
              <AvatarFallback>{singleJob?.created_by?.fullname?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-800">{singleJob?.created_by?.fullname}</p>
              <p className="text-sm text-gray-600">{singleJob?.created_by?.email}</p>
              <p className="text-sm text-gray-600">{singleJob?.created_by?.role}</p>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{singleJob?.jobDescription}</p>
          </div>

          {/* Skills */}
          {singleJob?.skills?.length > 0 && (
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {singleJob.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-gray-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {singleJob?.benefits?.length > 0 && (
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {singleJob.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Applicants */}
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Applicants ({singleJob?.applications?.length || 0})
          </h2>
          {singleJob?.applications?.length > 0 ? (
            <div className="space-y-4">
              {singleJob.applications.map((application) => (
                <div key={application._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={application.applicant?.profile?.avatar} alt={application.applicant?.fullname} />
                      <AvatarFallback>{application.applicant?.fullname?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{application.applicant?.fullname}</p>
                      <p className="text-sm text-gray-600">{application.applicant?.email}</p>
                      <p className="text-sm text-gray-600">{application.applicant?.phoneNumber}</p>
                      {application.applicant?.profile?.skills && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {application.applicant.profile.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
            <p className="text-gray-600">No applicants yet for this job.</p>
          )}
        </CardContent>
      </Card>
      <SuccessDialog />
    </div>
  );
};

export default AdminSingleWithApply;