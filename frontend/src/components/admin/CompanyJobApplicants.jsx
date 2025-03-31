import { useEffect, useState } from 'react';
import { Badge } from './../ui/badge';
import { Button } from './../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT, JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { setSingleCompany } from '@/redux/companySlice';
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
  Globe,
  User
} from 'lucide-react';
import { Skeleton } from './../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './../ui/avatar';

const CompanyJobApplicants = () => {
  const { singleCompany } = useSelector(store => store.company);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const companyId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch company and related jobs with applicants
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

        // Fetch all jobs and populate applicants
        const jobsRes = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
        if (jobsRes.data.success) {
          const companyJobs = jobsRes.data.jobs.filter(job => job.company?._id === companyId);
          
          // Fetch applicant details for each job
          const jobsWithApplicants = await Promise.all(companyJobs.map(async (job) => {
            if (job.applications?.length > 0) {
              const applicantIds = job.applications.map(app => app.applicant);
              const applicantsRes = await axios.post(
                `${APPLICATION_API_END_POINT}/getApplicants`,
                { applicantIds },
                { withCredentials: true }
              );
              return { ...job, applicants: applicantsRes.data.applicants || [] };
            }
            return { ...job, applicants: [] };
          }));
          
          setJobs(jobsWithApplicants);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load company details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId, dispatch]);

  const handleViewJob = (jobId) => {
    navigate(`/admin/jobs/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex gap-2 mb-6">
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
        {/* Company Header */}
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                {singleCompany?.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {singleCompany?.location}
                </Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  {singleCompany?.website}
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {jobs.length} Jobs
                </Badge>
              </div>
            </div>
            {singleCompany?.logo && (
              <img 
                src={singleCompany.logo} 
                alt={`${singleCompany.name} logo`} 
                className="h-16 w-16 object-contain rounded-full"
              />
            )}
          </div>
        </CardHeader>

        {/* Company Details */}
        <CardContent className="pt-6">
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
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.location}</p>
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
                  <a href={singleCompany?.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 mt-1 hover:underline">
                    {singleCompany?.website}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Created At</h3>
                  <p className="text-gray-600 mt-1">
                    {new Date(singleCompany?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Section with Applicants */}
          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Available Jobs ({jobs.length})
          </h2>
          
          {jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex flex-col gap-4">
                    {/* Job Details */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
                        <p className="text-gray-700 mt-2">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Briefcase className="h-3.5 w-3.5 mr-1" />
                            {job.jobType}
                          </Badge>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                            <DollarSign className="h-3.5 w-3.5 mr-1" />
                            {job.salary}
                          </Badge>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            {job.applicants?.length || 0} Applicants
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewJob(job._id)}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                      >
                        View Details
                      </Button>
                    </div>

                    {/* Applicants List */}
                    {job.applicants?.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-2">Applicants:</h4>
                        <div className="space-y-3">
                          {job.applicants.map((applicant) => (
                            <div key={applicant._id} className="flex items-center gap-3 p-2 bg-white rounded-md border">
                              <Avatar>
                                <AvatarImage src={applicant.profile?.avatar} alt={applicant.fullname} />
                                <AvatarFallback>{applicant.fullname?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{applicant.fullname}</p>
                                <p className="text-sm text-gray-600">{applicant.email}</p>
                                {applicant.profile?.skills && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {applicant.profile.skills.slice(0, 3).map((skill, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-2">No applicants yet for this job.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No jobs currently available for this company.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyJobApplicants;