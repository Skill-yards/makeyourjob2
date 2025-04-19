import { useEffect, useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
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
  Share2,
  Heart,
  BookmarkPlus,
  ArrowRight,
  GraduationCap,
  Star,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// Sample similar jobs data (replace with API call)
const mockSimilarJobs = [
  {
    _id: "1",
    jobTitle: "Frontend Developer",
    companyName: "TechCorp",
    workLocation: { city: "Bengaluru", state: "Karnataka" },
    jobType: "Full-time",
    jobCategory: "Engineering",
    salaryRange: { min: 8, max: 12, currency: "INR", frequency: "yearly" },
  },
  {
    _id: "2",
    jobTitle: "Backend Engineer",
    companyName: "Innovate Inc.",
    workLocation: { city: "Hyderabad", state: "Telangana" },
    jobType: "Full-time",
    jobCategory: "Engineering",
    salaryRange: { min: 10, max: 15, currency: "INR", frequency: "yearly" },
  },
  {
    _id: "3",
    jobTitle: "Full Stack Developer",
    companyName: "GrowEasy",
    workLocation: { city: "Remote" },
    jobType: "Contract",
    jobCategory: "Engineering",
    salaryRange: { min: 12, max: 18, currency: "INR", frequency: "yearly" },
  },
];

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isSimilarJobsLoading, setIsSimilarJobsLoading] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize profile completion check
  const profileStatus = useMemo(() => {
    if (!user) return { isComplete: false, missingFields: ["login"] };
    const { email, phoneNumber, profile } = user;
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!phoneNumber) missingFields.push("phone number");
    if (!profile?.resume) missingFields.push("resume");
    if (!profile?.skills?.length) missingFields.push("skills");
    return { isComplete: missingFields.length === 0, missingFields };
  }, [user]);

  // Handle job application
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    if (!profileStatus.isComplete) {
      toast.error(`Complete your profile: ${profileStatus.missingFields.join(", ")} required`);
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

  // Fetch similar jobs
  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setIsSimilarJobsLoading(true);
        // Replace with actual API call
        // const res = await axios.get(`${JOB_API_END_POINT}/similar/${jobId}`, {
        //   params: { category: singleJob?.jobCategory, skills: singleJob?.skills.join(",") },
        //   withCredentials: true,
        // });
        // if (res.data.success) {
        //   setSimilarJobs(res.data.jobs);
        // }

        // Using mock data for now
        setSimilarJobs(mockSimilarJobs.filter((job) => job._id !== jobId));
      } catch (error) {
        console.error("Failed to fetch similar jobs:", error);
        setSimilarJobs([]);
      } finally {
        setIsSimilarJobsLoading(false);
      }
    };
    console.log(similarJobs,"check similar jobs");
    

    if (singleJob?.jobCategory) {
      fetchSimilarJobs();
    }
  }, [jobId, singleJob?.jobCategory]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return "Today";
    if (diffDays <= 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format salary
  const getSalaryDisplay = (job) =>
    job?.salaryRange?.min && job?.salaryRange?.max
      ? `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency} / ${job.salaryRange.frequency}`
      : "Not disclosed";

  // Success dialog
  const SuccessDialog = () => (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>
        <DialogHeader className="pt-12">
          <DialogTitle className="text-center text-2xl font-bold text-gray-800 mt-4">
            Application Submitted!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2 max-w-sm mx-auto">
            Your application has been successfully submitted to {singleJob?.companyName}. You'll hear from the hiring team soon.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{singleJob?.jobTitle}</p>
                  <p className="text-xs text-gray-500">{singleJob?.companyName}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-0">
                Applied
              </Badge>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/applications");
              }}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl shadow-md transition hover:shadow-lg border-0"
            >
              View Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-24 rounded-full mr-4" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
          </div>
          <Skeleton className="h-60 w-full rounded-xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl mt-6" />
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6">
          <Card className="border-destructive shadow-xl rounded-xl">
            <CardContent className="pt-6 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
            </CardContent>
            <CardContent>
              <Button
                onClick={() => navigate("/jobs")}
                variant="outline"
                className="text-gray-600 hover:text-gray-800 border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition"
              >
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <Link to="/jobs" className="hover:text-indigo-600 transition">Jobs</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{singleJob?.jobTitle}</span>
          </div>

          {/* Floating action buttons on mobile */}
          <div className="fixed bottom-4 right-4 sm:hidden z-10 space-y-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg rounded-full p-3 flex items-center justify-center transition w-12 h-12"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? <Heart className="h-6 w-6 fill-red-500 text-red-500" /> : <BookmarkPlus className="h-6 w-6" />}
            </button>
            <button
              onClick={isApplied || isApplying ? null : applyJobHandler}
              disabled={isApplied || isApplying || profileStatus.missingFields.length > 0}
              className={`shadow-lg rounded-full p-3 flex items-center justify-center transition w-12 h-12 ${
                isApplied
                  ? "bg-green-100 text-green-600"
                  : isApplying || profileStatus.missingFields.length > 0
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
              }`}
              aria-label={isApplied ? "Applied" : "Apply for job"}
            >
              {isApplying ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isApplied ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <ArrowRight className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Back button */}
          <div className="flex items-center mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="text-gray-600 hover:text-gray-800 border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition mr-4 bg-white"
              aria-label="Go back to jobs"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>

            {/* Share and Save buttons - desktop */}
            <div className="hidden sm:flex ml-auto">
              <Button
                variant="outline"
                className="text-gray-600 hover:text-gray-800 border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition bg-white"
                onClick={() => navigator.clipboard.writeText(window.location.href) && toast.success("Link copied to clipboard")}
                aria-label="Share job link"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Job
              </Button>
              <Button
                variant="outline"
                className={`ml-3 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition ${
                  isSaved
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    : "text-gray-600 hover:text-gray-800 border-gray-300 bg-white"
                }`}
                onClick={() => setIsSaved(!isSaved)}
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                {isSaved ? (
                  <>
                    <Heart className="h-4 w-4 mr-2 fill-red-500" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save Job
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job Details Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Job Header Card */}
              <Card className="overflow-hidden border-0 shadow-xl bg-white rounded-2xl">
                <div className="relative">
                  <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
                  <div className="absolute top-8 left-6 w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                    {singleJob?.company?.logo ? (
                      <img
                        src={singleJob.company.logo}
                        alt={`${singleJob.companyName} logo`}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100?text=Logo";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                        <Building className="h-12 w-12 text-indigo-600" />
                      </div>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-0 pt-14 pl-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {singleJob?.jobType}
                      </Badge>
                      <Badge className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                        {singleJob?.workplacePlane}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        {formatDate(singleJob?.postedDate)}
                      </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{singleJob?.jobTitle}</h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Link to={`/company/${singleJob?.company?._id}`} className="font-medium hover:text-indigo-600 transition">
                        {singleJob?.companyName}
                      </Link>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          {singleJob?.workLocation?.city || "Remote"}
                          {singleJob?.workLocation?.state && `, ${singleJob.workLocation.state}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 pb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-100 rounded-md">
                          <DollarSign className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">Salary</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{getSalaryDisplay(singleJob)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-amber-100 rounded-md">
                          <GraduationCap className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">Experience</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {singleJob?.experienceLevel ? `${singleJob.experienceLevel} years` : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-purple-100 rounded-md">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">Vacancies</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{singleJob?.numberOfPositions || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Job Description</h3>
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed">{singleJob?.jobDescription || "N/A"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {singleJob?.skills?.length > 0 ? (
                          singleJob.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-indigo-100 text-indigo-800 border-0 px-3 py-1.5 rounded-lg text-sm"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">No specific skills mentioned</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">Benefits & Perks</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {singleJob?.benefits?.length > 0 ? (
                          singleJob.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <div className="p-1.5 bg-green-100 rounded-md">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="text-gray-800">{benefit}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No benefits specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information Card */}
              <Card className="overflow-hidden border-0 shadow-xl bg-white rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">About the Company</h3>
                    <Link
                      to={`/company/${singleJob?.company?._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      View Company
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {singleJob?.company?.logo ? (
                        <img
                          src={singleJob.company.logo}
                          alt={`${singleJob.companyName} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-gray-500" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900">{singleJob?.companyName}</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {singleJob?.company?.industry || "Technology"} • {singleJob?.company?.employeeCount || "Unknown"} employees
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="text-gray-500 text-sm ml-2">4.0 • 25 reviews</span>
                      </div>
                      <p className="text-gray-700 mt-3">
                        {singleJob?.company?.description || "No company description available."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Sidebar */}
            <div className="space-y-6">
              {/* Job Actions Card */}
              <Card className="overflow-hidden border-0 shadow-xl bg-white rounded-2xl sticky top-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Apply for this position</h3>

                  <div className="space-y-4">
                    {/* Apply button for desktop */}
                    <Button
                      onClick={isApplied || isApplying ? null : applyJobHandler}
                      disabled={isApplied || isApplying || profileStatus.missingFields.length > 0}
                      className={`w-full py-6 rounded-xl text-base font-semibold shadow-lg transition ${
                        isApplied
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : isApplying
                          ? "bg-gray-200 text-gray-600"
                          : profileStatus.missingFields.length > 0
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                      }`}
                      aria-label={isApplied ? "Application submitted" : "Apply now"}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Applying...
                        </>
                      ) : isApplied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Application Submitted
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>

                    {profileStatus.missingFields.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">Complete your profile</h4>
                            <p className="text-xs text-red-700 mt-1">
                              Please add the following required information:
                            </p>
                            <ul className="mt-2 space-y-1">
                              {profileStatus.missingFields.map((field, index) => (
                                <li key={index} className="flex items-center text-xs text-red-700">
                                  {field === "email" && <Mail className="h-3 w-3 mr-1" />}
                                  {field === "phone number" && <Phone className="h-3 w-3 mr-1" />}
                                  {field === "resume" && <FileText className="h-3 w-3 mr-1" />}
                                  {field === "skills" && <ListChecks className="h-3 w-3 mr-1" />}
                                  {field}
                                </li>
                              ))}
                            </ul>
                            <Link
                              to="/profile"
                              className="text-xs font-medium text-red-800 hover:text-red-900 underline mt-2 inline-block"
                            >
                              Complete Profile →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Job overview for quick reference */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Job Overview</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Posted:</span>
                          <span className="font-medium text-gray-900">{formatDate(singleJob?.postedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Job Type:</span>
                          <span className="font-medium text-gray-900">{singleJob?.jobType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-gray-900">{singleJob?.workLocation?.city || "Remote"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-gray-900">{singleJob?.jobCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applications:</span>
                          <span className="font-medium text-gray-900">{singleJob?.applications?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge
                            className={`${
                              singleJob?.status === "Open"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {singleJob?.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Similar Jobs Section */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Similar Jobs</h4>
                      <div className="space-y-3">
                        {isSimilarJobsLoading ? (
                          <>
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                          </>
                        ) : similarJobs.length > 0 ? (
                          similarJobs.slice(0, 3).map((job) => (
                            <Card key={job._id} className="border-0 shadow-sm bg-white rounded-xl">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="text-sm font-semibold text-gray-900">{job.jobTitle}</h5>
                                    <p className="text-xs text-gray-600 mt-1">{job.companyName}</p>
                                    <div className="flex items-center text-xs text-gray-600 mt-1">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>{job.workLocation?.city || "Remote"}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600 mt-1">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      <span>{getSalaryDisplay(job)}</span>
                                    </div>
                                  </div>
                                  <Link
                                    to={`/jobs/${job._id}`}
                                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center"
                                  >
                                    View Job
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No similar jobs found.</p>
                        )}
                      </div>
                      {similarJobs.length > 3 && (
                        <Link
                          to="/jobs"
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mt-3"
                        >
                          View More Jobs
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <SuccessDialog />
      <Footer />
    </>
  );
};

export default JobDescription;