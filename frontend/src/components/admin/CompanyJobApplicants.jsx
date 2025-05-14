import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
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
  Mail,
  Phone,
  Building,
  FileText,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const CompanyJobApplicants = () => {
  const { singleCompany } = useSelector((store) => store.company);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const companyId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const { company, jobs } = response.data;
          dispatch(setSingleCompany(company));
          setCompanyData({ ...company, jobs: jobs || [] });
        }
        console.log(response.data)
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
  <div>
    <Navbar/>
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl border-none overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                {singleCompany?.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {singleCompany?.location || 'N/A'}
                </Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  {singleCompany?.website || 'N/A'}
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {companyData?.jobs?.length || 0} Jobs
                </Badge>
                {singleCompany?.status && (
                  <Badge
                    variant="secondary"
                    className={`px-3 py-1 rounded-full ${
                      singleCompany.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : singleCompany.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {singleCompany.status}
                  </Badge>
                )}
              </div>
            </div>
            <Avatar className="h-16 w-16 border-2 border-indigo-200">
              <AvatarImage src={singleCompany?.logo} alt={singleCompany?.name} />
              <AvatarFallback>{singleCompany?.name?.charAt(0).toUpperCase() || 'C'}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>

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
                  <p className="text-gray-600 mt-1">{singleCompany?.description || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.location || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Website</h3>
                  <a
                    href={singleCompany?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 mt-1 hover:underline"
                  >
                    {singleCompany?.website || 'N/A'}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Founded Year</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.foundedYear || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Employee Count</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.employeeCount || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Industry</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.industry || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Contact Email</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.contactEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition-colors">
                  <Phone className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Contact Phone</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.contactPhone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">GST Number</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.gstNumber || 'N/A'}</p>
                  <a
                      href={singleCompany.cinDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 mt-1 hover:underline block"
                    >
                    View Certificate
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">CIN Number</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.cinNumber || 'N/A'}</p>
                  <a
                      href={singleCompany.cinDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 mt-1 hover:underline block"
                    >
                    View Certificate
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">PAN Number</h3>
                  <p className="text-gray-600 mt-1">{singleCompany?.panNumber || 'N/A'}</p>
                  <a
                      href={singleCompany.panDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 mt-1 hover:underline block"
                    >
                    View Certificate
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold pb-2 mb-6 text-gray-800 border-b border-gray-200">
            Available Jobs ({companyData?.jobs?.length || 0})
          </h2>

          {companyData?.jobs?.length > 0 ? (
            <div className="space-y-6">
              {companyData.jobs.map((job) => (
                <div key={job._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex flex-col gap-4">
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
                            {job.applications?.length || 0} Applicants
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

    <Footer/>
  </div>
  );
};

export default CompanyJobApplicants;