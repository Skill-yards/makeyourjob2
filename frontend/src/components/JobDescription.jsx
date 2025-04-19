import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import {
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Tag,
  Award,
  Home,
  Mail,
  Phone,
  FileText,
  ListChecks,
  ArrowLeft,
  Building,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check profile completion
  const checkProfileCompletion = () => {
    if (!user) return { isComplete: false, missingFields: ["login"] };
    const { email, phoneNumber, profile } = user;
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!phoneNumber) missingFields.push("phone number");
    if (!profile?.resume) missingFields.push("resume");
    if (!profile?.skills?.length) missingFields.push("skills");
    return { isComplete: missingFields.length === 0, missingFields };
  };

  // Handle job application
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    const { isComplete, missingFields } = checkProfileCompletion();
    if (!isComplete) {
      toast.error(`Complete your profile: ${missingFields.join(", ")} required`);
      navigate("/profile");
      return;
    }

    try {
      setIsApplying(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { email: user.email },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [...singleJob.applications, { applicant: user?._id }],
          })
        );
        setShowSuccessDialog(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setIsApplying(false);
    }
  };

  // Fetch job details
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some((app) => app.applicant === user?._id)
          );
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Format date
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

  // Format salary
  const getSalaryDisplay = () =>
    singleJob?.salaryRange?.min && singleJob?.salaryRange?.max
      ? `${singleJob.salaryRange.min} - ${singleJob.salaryRange.max} ${singleJob.salaryRange.currency} / ${singleJob.salaryRange.frequency}`
      : "N/A";

  // Success dialog
  const SuccessDialog = () => (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-gray-800 mt-4">
            Application Submitted!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Your application has been submitted. You'll hear from the hiring team soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-md transition hover:shadow-lg"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
        <Skeleton className="h-12 w-3/4 mb-4 rounded-lg" />
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
        <Card className="border-destructive shadow-xl rounded-xl">
          <CardContent className="pt-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { missingFields } = checkProfileCompletion();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-none bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="space-y-3">
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                    {singleJob?.jobTitle}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {singleJob?.numberOfPositions} Vacancies
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full shadow-sm">
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      {singleJob?.jobType}
                    </Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      {getSalaryDisplay()}
                    </Badge>
                    <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm">
                      <Home className="h-3.5 w-3.5 mr-1" />
                      {singleJob?.workplacePlane}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={isApplied || isApplying ? null : applyJobHandler}
                  disabled={isApplied || isApplying || (user && missingFields.length > 0)}
                  className={`w-full sm:w-40 rounded-full px-6 py-2 text-sm font-semibold shadow-lg transition-all ${
                    isApplied
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                      : isApplying
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : user && missingFields.length > 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : isApplied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Applied
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
                {user && missingFields.length > 0 && (
                  <div className="text-sm text-red-600 text-center sm:text-right">
                    <p>
                      Please{" "}
                      <Link to="/profile" className="underline hover:text-red-800 font-medium">
                        complete your profile
                      </Link>
                      :
                    </p>
                    <ul className="list-disc pl-4 mt-1">
                      {missingFields.map((field, index) => (
                        <li key={index} className="flex items-center gap-1">
                          {field === "email" && <Mail className="h-3 w-3" />}
                          {field === "phone number" && <Phone className="h-3 w-3" />}
                          {field === "resume" && <FileText className="h-3 w-3" />}
                          {field === "skills" && <ListChecks className="h-3 w-3" />}
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="pt-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
              Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-violet-100 rounded-full group-hover:bg-violet-200">
                    <Briefcase className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Job Title</h3>
                    <p className="text-gray-600">{singleJob?.jobTitle || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-600">
                      {singleJob?.workLocation?.area ? `${singleJob.workLocation.area}, ` : ""}
                      {singleJob?.workLocation?.city || "N/A"}
                      {singleJob?.workLocation?.state && `, ${singleJob.workLocation.state}`}
                      {singleJob?.workLocation?.pincode && ` ${singleJob.workLocation.pincode}`}
                      {singleJob?.workLocation?.country && `, ${singleJob.workLocation.country}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-emerald-100 rounded-full group-hover:bg-emerald-200">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Salary</h3>
                    <p className="text-gray-600">{getSalaryDisplay()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-amber-100 rounded-full group-hover:bg-amber-200">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Job Type</h3>
                    <p className="text-gray-600">{singleJob?.jobType || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-indigo-100 rounded-full group-hover:bg-indigo-200">
                    <Home className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Workplace Type</h3>
                    <p className="text-gray-600">{singleJob?.workplacePlane || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-rose-100 rounded-full group-hover:bg-rose-200">
                    <Award className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Experience Level</h3>
                    <p className="text-gray-600">
                      {singleJob?.experienceLevel ? `${singleJob.experienceLevel} years` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-purple-100 rounded-full group-hover:bg-purple-200">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Vacancies</h3>
                    <p className="text-gray-600">{singleJob?.numberOfPositions || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-teal-100 rounded-full group-hover:bg-teal-200">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Posted Date</h3>
                    <p className="text-gray-600">{formatDate(singleJob?.postedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-orange-100 rounded-full group-hover:bg-orange-200">
                    <Tag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Job Category</h3>
                    <p className="text-gray-600">{singleJob?.jobCategory || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Total Applicants</h3>
                    <p className="text-gray-600">{singleJob?.applications?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-cyan-100 rounded-full group-hover:bg-cyan-200">
                    <Building className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Company</h3>
                    <p className="text-gray-600">{singleJob?.companyName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition">
                  <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Status</h3>
                    <p className="text-gray-600">{singleJob?.status || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-10 space-y-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-xl mb-4 text-gray-800">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{singleJob?.description || "N/A"}</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-xl mb-4 text-gray-800">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {singleJob?.skills?.length > 0 ? (
                    singleJob.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-700">N/A</span>
                  )}
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-xl mb-4 text-gray-800">Benefits</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {singleJob?.benefits?.length > 0 ? (
                    singleJob.benefits.map((benefit, index) => (
                      <li key={index} className="mb-2">{benefit}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <SuccessDialog />
      </div>
      <Footer />
    </>
  );
};

export default JobDescription;