import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate, useParams, Link } from "react-router-dom"; // Added Link
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
  BookOpen,
  List,
  Home,
  Mail,
  Phone,
  FileText,
  ListChecks,
  ArrowLeft,
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
  const [error, setError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if profile is complete and return missing fields
  const checkProfileCompletion = () => {
    if (!user) return { isComplete: false, missingFields: ["login"] };
    const { email, phoneNumber, profile } = user;
    const missingFields = [];

    if (!email) missingFields.push("email");
    if (!phoneNumber) missingFields.push("phone number");
    if (!profile?.resume) missingFields.push("resume");
    if (!profile?.skills?.length) missingFields.push("skills");

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  };

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    const { isComplete, missingFields } = checkProfileCompletion();
    if (!isComplete) {
      toast.error(
        `Please complete your profile: ${missingFields.join(", ")} required`
      );
      navigate("/profile");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        setShowSuccessDialog(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSalaryDisplay = () => {
    if (
      singleJob?.salaryRangeDiversity?.min &&
      singleJob?.salaryRangeDiversity?.max
    ) {
      return `${singleJob.salaryRangeDiversity.min} - ${singleJob.salaryRangeDiversity.max} ${singleJob.salaryRangeDiversity.currency} / ${singleJob.salaryRangeDiversity.frequency}`;
    }
    return singleJob?.salary || "N/A";
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
            Thank you for your interest! Your application has been successfully
            submitted. The hiring team will review your profile soon.
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

  const { missingFields } = checkProfileCompletion();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-none overflow-hidden bg-gradient-to-b from-white to-slate-50">
          {/* Header Section */}
          <CardHeader className="pb-4 border-b">
            <div className="flex flex-col ">
              <div className="flex items-center justify-between  gap-8">
                <Button
                  onClick={() => navigate(-1)} // Go back to previous page
                  variant="outline"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-800 to-indigo-600">
                      {singleJob?.jobTitle || singleJob?.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {singleJob?.vacancies || singleJob?.position} Vacancies
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full"
                      >
                        <Briefcase className="h-3.5 w-3.5 mr-1" />
                        {singleJob?.jobType}
                      </Badge>
                      
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full"
                      >
                        {/* <DollarSign className="h-3.5 w-3.5 mr-1" /> */}
                        {getSalaryDisplay()}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                      >
                        <Home className="h-3.5 w-3.5 mr-1" />
                        {singleJob?.workplacePlane}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={isApplied ? null : applyJobHandler}
                      disabled={
                        isApplied ||
                        isLoading ||
                        (user && missingFields.length > 0)
                      }
                      className={`w-full sm:w-auto transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium shadow-md ${
                        isApplied
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                          : user && missingFields.length > 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
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
                        "Apply Now"
                      )}
                    </Button>
                    {user && missingFields.length > 0 && (
                      <div className="text-sm text-red-600 text-center sm:text-right">
                        <p>
                          Please{" "}
                          <Link
                            to="/profile"
                            className="underline hover:text-red-800"
                          >
                            complete your profile
                          </Link>
                          :
                        </p>
                        <ul className="list-disc pl-4">
                          {missingFields.map((field, index) => (
                            <li key={index} className="flex items-center gap-1">
                              {field === "email" && (
                                <Mail className="h-3 w-3" />
                              )}
                              {field === "phone number" && (
                                <Phone className="h-3 w-3" />
                              )}
                              {field === "resume" && (
                                <FileText className="h-3 w-3" />
                              )}
                              {field === "skills" && (
                                <ListChecks className="h-3 w-3" />
                              )}
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                    <h3 className="font-semibold text-gray-700">Job Title</h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.jobTitle || singleJob?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.workLocation?.city ||
                        singleJob?.location ||
                        "N/A"}
                      {singleJob?.workLocation?.state &&
                        `, ${singleJob.workLocation.state}`}
                      {singleJob?.workLocation?.country &&
                        `, ${singleJob.workLocation.country}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <span className="h-5 w-5 text-emerald-600 text-lg font-bold">
                      ₹
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Salary</h3>
                    <p className="text-gray-600 mt-1">{getSalaryDisplay()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Job Type</h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.jobType || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                    <Home className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Workplace Type
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.workplacePlane || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-200 transition-colors">
                    <Award className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Experience Level
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.experienceLevel || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Vacancies</h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.vacancies || singleJob?.position || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Posted Date</h3>
                    <p className="text-gray-600 mt-1">
                      {formatDate(
                        singleJob?.postedDate || singleJob?.createdAt
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Deadline</h3>
                    <p className="text-gray-600 mt-1">
                      {formatDate(singleJob?.deadline)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <Tag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Job Category
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.jobCategory || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition-colors">
                    <BookOpen className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Education Level
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.educationLevel || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Total Applicants
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {singleJob?.applications?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 space-y-6">
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {singleJob?.description || "N/A"}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Requirements
                </h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {singleJob?.requirements?.length > 0 ? (
                    singleJob.requirements.map((req, index) => (
                      <li key={index} className="mb-1">
                        {req}
                      </li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {singleJob?.skills?.length > 0 ? (
                    singleJob.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-indigo-100 text-indigo-800 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-700">N/A</span>
                  )}
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Benefits
                </h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {singleJob?.benefits?.length > 0 ? (
                    singleJob.benefits.map((benefit, index) => (
                      <li key={index} className="mb-1">
                        {benefit}
                      </li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Availability Frame
                </h3>
                <p className="text-gray-700">
                  <strong>Start:</strong>{" "}
                  {formatDate(singleJob?.availabilityFrame?.startDate)} <br />
                  <strong>End:</strong>{" "}
                  {formatDate(singleJob?.availabilityFrame?.endDate)}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {singleJob?.keywords?.length > 0 ? (
                    singleJob.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100 text-gray-800 px-3 py-1"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-700">N/A</span>
                  )}
                </div>
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
