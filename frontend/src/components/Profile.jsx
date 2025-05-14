import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Clock,
  Download,
  Trash2,
  Pen,
  X,
  ArrowLeft,
} from "lucide-react";
import { useRef, useState, useCallback } from "react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropUtil";
import { useNavigate } from "react-router-dom";
import Footer from "./shared/Footer";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setShowCropper(false);
      setOpen(true);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
  };

  // Handle file selection
  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    console.log(file, "check file");
    setResumeFile(file || null);
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a resume file", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      resumeFile.type !== "application/pdf" ||
      resumeFile.size > 2 * 1024 * 1024
    ) {
      toast.error("Please upload a valid PDF resume (up to 2MB)", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const res = await axios.patch(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setResumeFile(null);
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to upload resume", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(
        error.response?.data?.message ||
          "Internal server error while uploading resume",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // Handle resume view/download
  const handleViewResume = () => {
    if (user?.profile?.resume) {
      window.open(user.profile.resume, "_blank", "noopener,noreferrer");
    }
  };

  // Create refs for each section
  const resumeRef = useRef(null);
  const resumeHeadlineRef = useRef(null);
  const keySkillsRef = useRef(null);
  const employmentRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Format date to display as "Month DD, YYYY"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format employment date (handling the specific format in the data)
  const formatEmploymentDate = (month, year) => {
    if (!year) return "";
    return `${month || ""} ${year}`;
  };

  const navigate = useNavigate();

  // Calculate duration between two dates (or to present)
  const calculateDuration = (
    startMonth,
    startYear,
    endMonth,
    endYear,
    isCurrent
  ) => {
    if (!startYear) return "";

    const start = new Date(startYear, getMonthNumber(startMonth) || 0, 1);
    const end = isCurrent
      ? new Date()
      : endYear
      ? new Date(endYear, getMonthNumber(endMonth) || 0, 1)
      : new Date();

    const diffYears = end.getFullYear() - start.getFullYear();
    const diffMonths = end.getMonth() - start.getMonth();

    let months = diffMonths;
    let years = diffYears;

    if (diffMonths < 0) {
      months = 12 + diffMonths;
      years--;
    }

    return `${years > 0 ? `${years} year${years !== 1 ? "s" : ""}` : ""} ${
      months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : ""
    }`.trim();
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    if (!monthName) return 0;
    const months = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    return months[monthName] || 0;
  };

  // If user data is not available, display a fallback UI
  if (!user || !user.profile) {
    return (
      <div className="flex flex-col bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6 m-4 text-center">
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  const dispatch = useDispatch();

  // Function to handle the resume deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your resume?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.get(
        `${USER_API_END_POINT}/resume/${user._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Resume deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        // Create a new user object with resume set to null
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            resume: "",
            resumeOriginalName: "",
          },
        };

        dispatch(setUser(updatedUser));
      } else {
        toast.error(response.data.message || "Failed to delete resume", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error(
        error.response?.data?.message ||
          "Internal server error while deleting resume",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleDownloadResume = async () => {
    if (!user?.profile?.resume) {
      toast.error("No resume available to download", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await axios.get(user?.profile?.resume, {
        responseType: "blob",
      });
      const fileName = user.profile.resumeOriginalName || "resume.pdf";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Resume downloaded successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Profile Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 m-4">
        <div className="flex mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 group transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>
        </div>
        <div className="flex items-start gap-6">
          {/* Profile Image with 100% completion ring */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 cursor-pointer group">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                {user.profile.profilePhoto ? (
                  <>
                    <img
                      src={user.profile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/60 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
                    >
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all">
                        Update Photo
                      </span>
                    </label>
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xl font-semibold">
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {user.firstname} {user.lastname}
              </h1>
              <button
                className="text-blue-500 flex items-center gap-1"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pen className="h-4 w-4" />
                Edit profile
              </button>
              <UpdateProfileDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                croppedImage={croppedImage}
              />
            </div>
            <p className="text-gray-700">
              {user.profile.jobRole || "Full Stack Developer"}
            </p>
            <p className="text-gray-600">
              at {user.profile.organization || "Freelancing"}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">Location Info</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{user.phoneNumber}</span>
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  Experience:{" "}
                  {user.profile.employment && user.profile.employment.length > 0
                    ? `${
                        user.profile.employment[0].totalExperienceYears || 0
                      } Years ${
                        user.profile.employment[0].totalExperienceMonths || 0
                      } Months`
                    : "0 Years"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{user.email}</span>
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">
                  {user.profile.employment &&
                  user.profile.employment.length > 0 &&
                  user.profile.employment[0].salary
                    ? `₹ ${user.profile.employment[0].salary},00,000`
                    : "₹ 6,00,000"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  {user.profile.employment &&
                  user.profile.employment.length > 0 &&
                  user.profile.employment[0].noticePeriod
                    ? `${user.profile.employment[0].noticePeriod} Days notice period`
                    : "15 Days or less notice period"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="flex gap-4 m-4">
        {/* Left Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm p-4 sticky top-4 self-start">
          <h2 className="text-lg font-semibold mb-4">Quick links</h2>

          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(resumeRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Resume
              </button>
            </li>
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(resumeHeadlineRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Resume headline
              </button>
            </li>
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(keySkillsRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Key skills
              </button>
            </li>
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(employmentRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Employment
              </button>
            </li>
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(educationRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Education
              </button>
            </li>
            <li className="flex justify-between items-center">
              <button
                onClick={() => scrollToSection(projectsRef)}
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                Projects
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Resume Section */}
          <div
            ref={resumeRef}
            id="resume"
            className="bg-white rounded-lg shadow-sm p-6 mb-4 scroll-mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resume</h2>
            </div>

            <div className="mb-6">
              {user.profile.resume && (
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">
                    {user.profile.resumeOriginalName}
                  </span>
                  <div className="flex gap-2">
                    <Download
                      size={20}
                      className="text-blue-500 cursor-pointer hover:text-blue-600"
                      onClick={handleDownloadResume}
                      title="Download Resume"
                    />
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer hover:text-red-600"
                      onClick={handleDelete}
                    />
                  </div>
                </div>
              )}

              <div className="border border-dashed border-gray-300 rounded-lg p-8 mt-4 flex flex-col items-center justify-center">
                {user.profile.resume ? (
                  <a
                    href={user.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <label className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200">
                      View Resume
                    </label>
                  </a>
                ) : (
                  <p className="text-gray-500 mb-4">
                    You need to add your resume
                  </p>
                )}
              </div>

              {/* Resume Upload Form */}

              <form
                onSubmit={handleResumeUpload}
                className="mt-6 space-y-6 p-6 bg-white shadow-lg rounded-lg"
              >
                <div>
                  <label
                    htmlFor="file"
                    className="text-sm font-medium text-gray-700"
                  >
                    Upload Resume (PDF)
                  </label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={fileChangeHandler}
                    className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {user?.profile?.resume && !resumeFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      Current resume:{" "}
                      {user.profile.resumeOriginalName || "Resume uploaded"}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full px-6 py-3 text-sm font-semibold shadow-md transition-transform transform hover:scale-105"
                >
                  Upload Resume
                </button>
              </form>
            </div>

            {/* Resume Headline */}
            <div
              ref={resumeHeadlineRef}
              id="resume-headline"
              className="mt-6 scroll-mt-8"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Resume headline</h3>
                <button className="text-gray-500">
                  {/* Add edit functionality if needed */}
                </button>
              </div>
              <p className="text-gray-700 ">
                {user.profile.jobRole || "Full Stack Web Developer"} |{" "}
                {user.profile.skills &&
                Array.isArray(user.profile.skills) &&
                user.profile.skills.length > 0 &&
                typeof user.profile.skills[0] === "string" &&
                user.profile.skills[0].toLowerCase().includes("python")
                  ? "Python Developer"
                  : "MERN Stack Specialist"}
              </p>
            </div>

            {/* Key Skills */}
            <div
              ref={keySkillsRef}
              id="key-skills"
              className="mt-6 scroll-mt-8"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Key skills</h3>
                <button className="text-gray-500">
                  {/* Add edit functionality if needed */}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No skills added yet</span>
                )}
              </div>
            </div>

            {/* Employment */}
            <div
              ref={employmentRef}
              id="employment"
              className="mt-6 scroll-mt-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Employment</h3>
              </div>

              {user.profile.employment && user.profile.employment.length > 0 ? (
                user.profile.employment.map((job, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b pb-6 border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {job.jobTitle}
                          </h4>
                          <button className="text-gray-500">
                            {/* Add edit functionality if needed */}
                          </button>
                        </div>
                        <p className="text-gray-700">{job.companyName}</p>
                        <div className="text-gray-500 text-sm mt-1">
                          <span className="inline-block mr-2">
                            {job.employmentType}
                          </span>
                          |
                          <span className="inline-block mx-2">
                            {formatEmploymentDate(
                              job.joiningDateMonth,
                              job.joiningDateYear
                            )}{" "}
                            to{" "}
                            {job.isCurrentEmployment
                              ? "Present"
                              : formatEmploymentDate(
                                  job.endingDateMonth,
                                  job.endingDateYear
                                )}
                          </span>
                          (
                          {calculateDuration(
                            job.joiningDateMonth,
                            job.joiningDateYear,
                            job.endingDateMonth,
                            job.endingDateYear,
                            job.isCurrentEmployment
                          )}
                          )
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                          {job.noticePeriod
                            ? `${job.noticePeriod} Days Notice Period`
                            : "15 Days or less Notice Period"}
                        </div>
                        <p className="text-gray-700 mt-2">{job.jobProfile}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No employment records added yet
                  </p>
                </div>
              )}
            </div>

            {/* Education */}
            <div ref={educationRef} id="education" className="mt-8 scroll-mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Education</h3>
              </div>

              {user.profile.education && user.profile.education.length > 0 ? (
                user.profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b pb-6 border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {edu.educationLevel}
                          </h4>
                          <button className="text-gray-500">
                            {/* Add edit functionality if needed */}
                          </button>
                        </div>
                        <p className="text-gray-700">{edu.university}</p>
                        <div className="text-gray-500 text-sm mt-1">
                          <span className="inline-block mr-2">
                            {edu.courseType}
                          </span>
                          |
                          <span className="inline-block mx-2">
                            {edu.startingYear} to {edu.endingYear}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">
                          {edu.course}, {edu.specialization}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No education records added yet
                  </p>
                </div>
              )}
            </div>

            {/* Projects */}
            <div ref={projectsRef} id="projects" className="mt-8 scroll-mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Projects</h3>
              </div>

              {user.profile.projects && user.profile.projects.length > 0 ? (
                user.profile.projects.map((project, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b pb-6 border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {project.projectTitle}
                          </h4>
                          <button className="text-gray-500">
                            {/* Add edit functionality if needed */}
                          </button>
                        </div>
                        <p className="text-gray-700">
                          {project.tagInstitution}
                        </p>
                        <div className="text-gray-500 text-sm mt-1">
                          <span className="inline-block mr-2">
                            Client: {project.client}
                          </span>
                          |
                          <span className="inline-block mx-2">
                            Status: {project.projectStatus}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{project.details}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No projects added yet</p>
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Certificates</h3>
              </div>

              {user.profile.certificates &&
              user.profile.certificates.length > 0 ? (
                user.profile.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b pb-6 border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {cert.certificateName}
                          </h4>
                          <button className="text-gray-500">
                            {/* Add edit functionality if needed */}
                          </button>
                        </div>
                        <p className="text-gray-700">
                          {cert.issuingOrganization}
                        </p>
                        <div className="text-gray-500 text-sm mt-1">
                          <span className="inline-block mr-2">
                            Issued: {formatDate(cert.issueDate)}
                          </span>
                          |
                          <span className="inline-block mx-2">
                            Credential ID: {cert.credentialId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No certificates added yet
                  </p>
                </div>
              )}
            </div>

            {/* Online Profiles */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Online Profiles</h3>
              </div>

              {user.profile.onlineProfiles &&
              user.profile.onlineProfiles.length > 0 ? (
                user.profile.onlineProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="mb-6 border-b pb-6 border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {profile.socialProfileName}
                          </h4>
                          <button className="text-gray-500">
                            {/* Add edit functionality if needed */}
                          </button>
                        </div>
                        <a
                          href={profile.url}
                          className="text-blue-500 text-sm break-all"
                        >
                          {profile.url}
                        </a>
                        <p className="text-gray-700 mt-2">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No online profiles added yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Diversity & Inclusion Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start"></div>
        <div className="flex gap-4 mt-4"></div>
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 w-full max-w-lg relative shadow-2xl transform transition-all scale-100 hover:scale-105">
            <button
              onClick={handleCancelCrop}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              <X className="h-7 w-7" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Crop Your Profile Photo
            </h2>
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-8 flex space-x-6">
              <button
                onClick={handleCrop}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Crop & Save
              </button>
              <button
                onClick={handleCancelCrop}
                className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <UpdateProfileDialog
        open={open}
        setOpen={setOpen}
        croppedImage={croppedImage}
      />
      <Footer />
    </div>
  );
};

export default Profile;
