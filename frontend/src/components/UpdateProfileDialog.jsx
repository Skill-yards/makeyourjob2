import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  PlusCircle,
  X,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Globe,
  Award,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "./ui/avatar";
import PropTypes from "prop-types";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const UpdateProfileDialog = ({ open, setOpen, croppedImage }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Initialize form state with user data
  const [input, setInput] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    organization: user?.profile?.organization || "",
    jobRole: user?.profile?.jobRole || "",
    file: null,
    employment: user?.profile?.employment || [],
    education: user?.profile?.education || [],
    projects: user?.profile?.projects || [],
    onlineProfiles: user?.profile?.onlineProfiles || [],
    certificates: user?.profile?.certificates || [],
  });
  // console.log(input.profile.jobRole,"check data jobRole c")

  // Handle initial skill parsing
  useEffect(() => {
    if (user?.profile?.skills && Array.isArray(user.profile.skills)) {
      setInput((prev) => ({
        ...prev,
        skills: user.profile.skills,
      }));
    }
  }, [user]);

  // Generic input change handler
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Select change handler
  const handleSelectChange = (name, value) => {
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // File change handler
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    setErrors({ ...errors, file: "" });
  };

  // Skills change handler with improved validation
  const handleSkillsChange = (e) => {
    const skillsText = e.target.value;
    // Split by commas, trim each skill, remove empty strings
    const skillsArray = skillsText
      .split(",")
      .map((skill) => skill.trim()) // Trim leading/trailing spaces
      .filter((skill) => skill.length > 0); // Remove empty strings
    setInput({ ...input, skills: skillsArray });
    setErrors({ ...errors, skills: "" });
    // const skillsText = e.target.value;
    // // Split by commas, trim each skill, remove empty strings and strings with only spaces
    // const skillsArray = skillsText
    //   .split(",")
    //   .map((skill) => skill)
    //   .filter((skill) => skill.length > 0 && skill !== " "); // Ensure no empty or space-only skills
    // setInput({ ...input, skills: skillsArray });
    // setErrors({ ...errors, skills: "" });
  };

  // Validate all inputs
  const validateInputs = () => {
    const newErrors = {};

    // Required fields validation
    if (!input.firstname.trim()) newErrors.firstname = "First name is required";
    if (!input.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!input.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(input.email))
      newErrors.email = "Invalid email format";
    if (!input.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!input.gender) newErrors.gender = "Gender is required";

    // Role specific validation
    if (user?.role === "candidate") {
      if (!input.bio?.trim()) newErrors.bio = "Bio is required";
      if (input.skills.length === 0)
        newErrors.skills = "At least one skill is required";

      // Validate complex fields
      if (input.employment.length > 0) {
        input.employment.forEach((job, index) => {
          if (!job.companyName?.trim())
            newErrors[`employment[${index}].companyName`] =
              "Company name is required";
          if (!job.jobTitle?.trim())
            newErrors[`employment[${index}].jobTitle`] =
              "Job title is required";
          if (!job.employmentType)
            newErrors[`employment[${index}].employmentType`] =
              "Employment type is required";
          if (isNaN(job.totalExperienceYears) || job.totalExperienceYears < 0)
            newErrors[`employment[${index}].totalExperienceYears`] =
              "Valid years required";
          if (
            isNaN(job.totalExperienceMonths) ||
            job.totalExperienceMonths < 0 ||
            job.totalExperienceMonths > 11
          )
            newErrors[`employment[${index}].totalExperienceMonths`] =
              "Valid months required (0-11)";
          if (!job.joiningDateMonth)
            newErrors[`employment[${index}].joiningDateMonth`] =
              "Joining month is required";
          if (!job.joiningDateYear)
            newErrors[`employment[${index}].joiningDateYear`] =
              "Joining year is required";
          if (
            !job.isCurrentEmployment &&
            (!job.endingDateMonth || !job.endingDateYear)
          )
            newErrors[`employment[${index}].endingDate`] =
              "End date is required for past jobs";
        });
      }

      // Education validation
      if (input.education.length > 0) {
        input.education.forEach((edu, index) => {
          if (!edu.educationLevel?.trim())
            newErrors[`education[${index}].educationLevel`] =
              "Education level is required";
          if (!edu.university?.trim())
            newErrors[`education[${index}].university`] =
              "University is required";
          if (!edu.course?.trim())
            newErrors[`education[${index}].course`] = "Course is required";
          if (!edu.specialization?.trim())
            newErrors[`education[${index}].specialization`] =
              "Specialization is required";
          if (!edu.courseType)
            newErrors[`education[${index}].courseType`] =
              "Course type is required";
          if (!edu.startingYear)
            newErrors[`education[${index}].startingYear`] =
              "Starting year is required";
          if (!edu.endingYear)
            newErrors[`education[${index}].endingYear`] =
              "Ending year is required";
          if (!edu.gradingSystem?.trim())
            newErrors[`education[${index}].gradingSystem`] =
              "Grading system is required";
        });
      }

      // Projects validation
      if (input.projects.length > 0) {
        input.projects.forEach((project, index) => {
          if (!project.projectTitle?.trim())
            newErrors[`projects[${index}].projectTitle`] =
              "Project title is required";
          if (!project.tagInstitution?.trim())
            newErrors[`projects[${index}].tagInstitution`] =
              "Institution is required";
          if (!project.client?.trim())
            newErrors[`projects[${index}].client`] = "Client is required";
          if (!project.projectStatus)
            newErrors[`projects[${index}].projectStatus`] =
              "Project status is required";
          if (!project.workedFromYear)
            newErrors[`projects[${index}].workedFromYear`] =
              "Start year is required";
          if (!project.workedFromMonth)
            newErrors[`projects[${index}].workedFromMonth`] =
              "Start month is required";
        });
      }

      // Online profiles validation
      if (input.onlineProfiles.length > 0) {
        input.onlineProfiles.forEach((profile, index) => {
          if (!profile.socialProfileName?.trim())
            newErrors[`onlineProfiles[${index}].socialProfileName`] =
              "Profile name is required";
          if (!profile.url?.trim())
            newErrors[`onlineProfiles[${index}].url`] = "URL is required";
          else if (
            !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
              profile.url
            )
          )
            newErrors[`onlineProfiles[${index}].url`] = "Invalid URL format";
        });
      }

      // Certificates validation
      if (input.certificates.length > 0) {
        input.certificates.forEach((cert, index) => {
          if (!cert.certificateName?.trim())
            newErrors[`certificates[${index}].certificateName`] =
              "Certificate name is required";
          if (!cert.issuingOrganization?.trim())
            newErrors[`certificates[${index}].issuingOrganization`] =
              "Organization is required";
        });
      }
    } else if (user?.role === "recruiter") {
      if (!input.organization?.trim())
        newErrors.organization = "Organization is required";
      if (!input.jobRole?.trim()) newErrors.jobRole = "Job role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding new complex field items
  const handleAddItem = (field) => {
    let newItem;
    switch (field) {
      case "employment":
        newItem = {
          isCurrentEmployment: false,
          employmentType: "Full-time",
          totalExperienceYears: 0,
          totalExperienceMonths: 0,
          companyName: "",
          jobTitle: "",
          joiningDateMonth: months[0],
          joiningDateYear: new Date().getFullYear().toString(), // Convert to string
          endingDateMonth: "",
          endingDateYear: "",
          salary: "",
          skillsUsed: [],
          jobProfile: "",
          noticePeriod: "",
        };
        break;
      case "education":
        newItem = {
          educationLevel: "",
          university: "",
          course: "",
          specialization: "",
          courseType: "Full time",
          startingYear: (new Date().getFullYear() - 4).toString(), // Convert to string
          endingYear: new Date().getFullYear().toString(), // Convert to string
          gradingSystem: "",
        };
        break;
      case "projects":
        newItem = {
          projectTitle: "",
          tagInstitution: "",
          client: "",
          projectStatus: "In progress",
          workedFromYear: new Date().getFullYear().toString(), // Convert to string
          workedFromMonth: months[0],
          endingDateMonth: "",
          details: "",
        };
        break;
      case "onlineProfiles":
        newItem = {
          socialProfileName: "",
          url: "",
          description: "",
        };
        break;
      case "certificates":
        newItem = {
          certificateName: "",
          issuingOrganization: "",
          issueDate: "",
          credentialId: "",
          credentialUrl: "",
        };
        break;
      default:
        return;
    }

    setInput((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  // Handle removing complex field items
  const handleRemoveItem = (field, index) => {
    setInput((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Handle complex field changes
  const handleComplexFieldChange = (field, index, key, value) => {
    setInput((prev) => {
      const updatedItems = [...prev[field]];
      updatedItems[index] = {
        ...updatedItems[index],
        [key]: value,
      };
      return {
        ...prev,
        [field]: updatedItems,
      };
    });

    // Clear any related errors
    if (errors[`${field}[${index}].${key}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${field}[${index}].${key}`];
        return newErrors;
      });
    }
  };

  // Submit form handler
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submit handelr call");

    if (!validateInputs()) {
      toast.error("Please fill all required fields correctly");

      // Find the first tab with errors and switch to it
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const tabsWithErrors = {
          personal: [
            "firstname",
            "lastname",
            "email",
            "phoneNumber",
            "gender",
            "bio",
            "skills",
            "organization",
            "jobRole",
          ],
          employment: ["employment"],
          education: ["education"],
          projects: ["projects"],
          profiles: ["onlineProfiles"],
          certificates: ["certificates"],
        };

        for (const [tab, fields] of Object.entries(tabsWithErrors)) {
          if (
            errorKeys.some((errorKey) =>
              fields.some((field) => errorKey.startsWith(field))
            )
          ) {
            setActiveTab(tab);
            break;
          }
        }
      }

      return;
    }

    const formData = new FormData();
    formData.append("firstname", input.firstname);
    formData.append("lastname", input.lastname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("gender", input.gender);
    formData.append("jobRole", input.jobRole);
    console.log(formData, "check data files ");

    // Handle profile photo
    if (croppedImage) {
      if (
        typeof croppedImage === "string" &&
        croppedImage.startsWith("blob:")
      ) {
        try {
          const response = await fetch(croppedImage);
          const blob = await response.blob();
          const profileImageFile = new File([blob], "profile-image.jpg", {
            type: "image/jpeg",
          });
          console.log(blob);
          formData.append("profilePhoto", profileImageFile);
        } catch (error) {
          toast.error("Failed to process profile image");
          return;
        }
      } else if (croppedImage instanceof File) {
        formData.append("profilePhoto", croppedImage);
      }
    }

    // Add role-specific data
    if (user?.role === "candidate") {
      formData.append("bio", input.bio);
      formData.append("skills", JSON.stringify(input.skills));

      // Add complex fields as JSON
      formData.append("employment", JSON.stringify(input.employment));
      formData.append("education", JSON.stringify(input.education));
      formData.append("projects", JSON.stringify(input.projects));
      formData.append("onlineProfiles", JSON.stringify(input.onlineProfiles));
      formData.append("certificates", JSON.stringify(input.certificates));

      // Add resume file if present
      if (input.file) formData.append("file", input.file);
    } else if (user?.role === "recruiter") {
      formData.append("organization", input.organization);
      formData.append("jobRole", input.jobRole);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate year options from 1970 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1970; year--) {
      years.push(year.toString()); // Convert to string
    }
    return years;
  };

  const years = generateYearOptions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white p-6 border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setOpen(false)}
              disabled={loading}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Update Profile
            </DialogTitle>
            <div className="w-10" />
          </div>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Update your {user?.role === "recruiter" ? "recruiter" : "candidate"}{" "}
            profile details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="px-6 pb-6">
          <div className="flex flex-col items-center mb-6 mt-4">
            <Avatar className="h-24 w-24 border-2 border-indigo-500 shadow-md">
              <AvatarImage
                src={croppedImage || user?.profile?.profilePhoto || ""}
                alt={user?.firstname || "Profile"}
                className="object-cover"
              />
            </Avatar>
            <span className="text-sm text-gray-500 mt-2">
              {croppedImage
                ? "New profile photo selected"
                : "Current profile photo"}
            </span>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-1">
                Personal
              </TabsTrigger>
              {user?.role === "candidate" && (
                <>
                  <TabsTrigger
                    value="employment"
                    className="flex items-center gap-1"
                  >
                    <Briefcase className="h-4 w-4" />
                    Work
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="flex items-center gap-1"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="flex items-center gap-1"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="profiles"
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    Profiles
                  </TabsTrigger>
                  <TabsTrigger
                    value="certificates"
                    className="flex items-center gap-1"
                  >
                    <Award className="h-4 w-4" />
                    Certs
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* PERSONAL INFO TAB */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstname"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={input.firstname}
                    onChange={changeEventHandler}
                    className={`mt-1 ${
                      errors.firstname ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.firstname}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="lastname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={input.lastname}
                    onChange={changeEventHandler}
                    className={`mt-1 ${
                      errors.lastname ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.lastname}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. +1234567890"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Label
                    htmlFor="jobRole"
                    className="text-sm font-medium text-gray-700"
                  >
                    Job Role *
                  </Label>
                  <Input
                    id="jobRole"
                    name="jobRole"
                    type="text"
                    value={input.jobRole}
                    onChange={changeEventHandler}
                    className={`mt-1 ${errors.jobRole ? "border-red-500" : ""}`}
                    placeholder="Enter your job role"
                  />
                  {errors.jobRole && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.jobRole}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700"
                  >
                    Gender *
                  </Label>
                  <Select
                    value={input.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger
                      className={`mt-1 ${
                        errors.gender ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* User type specific fields */}
              {user?.role === "candidate" ? (
                <>
                  <div className="mt-4">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-700"
                    >
                      Bio *
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      className={`mt-1 h-24 ${
                        errors.bio ? "border-red-500" : ""
                      }`}
                      placeholder="Write a brief description about yourself"
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Label
                      htmlFor="skills"
                      className="text-sm font-medium text-gray-700"
                    >
                      Skills * (comma-separated)
                    </Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={input.skills.join(", ")} // Convert array to comma-separated string
                      onChange={handleSkillsChange}
                      placeholder="e.g., HTML, CSS, JavaScript, React"
                      className={`mt-1 ${
                        errors.skills ? "border-red-500" : ""
                      }`}
                    />
                    {errors.skills && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.skills}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {input.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* <div className="mt-4">
                    <Label
                      htmlFor="skills"
                      className="text-sm font-medium text-gray-700"
                    >
                      Skills * (comma-separated)
                    </Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={input.skills}
                      onChange={handleSkillsChange}
                      placeholder="e.g., HTML, CSS, JavaScript, React"
                      className={`mt-1 ${
                        errors.skills ? "border-red-500" : ""
                      }`}
                    />
                    {errors.skills && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.skills}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {input.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div> */}
                  <div className="mt-4">
                    <Label
                      htmlFor="file"
                      className="text-sm font-medium text-gray-700"
                    >
                      Resume (PDF)
                    </Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept="application/pdf"
                      onChange={fileChangeHandler}
                      className="mt-1"
                    />
                    {user?.profile?.resume && !input.file && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current resume:{" "}
                        {user.profile.resumeOriginalName || "Resume uploaded"}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label
                      htmlFor="organization"
                      className="text-sm font-medium text-gray-700"
                    >
                      Organization *
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={input.organization}
                      onChange={changeEventHandler}
                      className={`mt-1 ${
                        errors.organization ? "border-red-500" : ""
                      }`}
                    />
                    {errors.organization && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.organization}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="jobRole"
                      className="text-sm font-medium text-gray-700"
                    >
                      Job Role *
                    </Label>
                    <Input
                      id="jobRole"
                      name="jobRole"
                      value={input.jobRole}
                      onChange={changeEventHandler}
                      className={`mt-1 ${
                        errors.jobRole ? "border-red-500" : ""
                      }`}
                    />
                    {errors.jobRole && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.jobRole}
                      </p>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            {/* EMPLOYMENT TAB */}
            {user?.role === "candidate" && (
              <TabsContent value="employment" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Work Experience
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleAddItem("employment")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Position
                  </Button>
                </div>

                {input.employment.length === 0 ? (
                  <Card className="border border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        No work experience added yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleAddItem("employment")}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Work
                        Experience
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {input.employment.map((job, index) => (
                      <AccordionItem
                        key={index}
                        value={`job-${index}`}
                        className="border rounded-lg mb-3 p-2"
                      >
                        <div className="flex justify-between items-center">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <h4 className="text-md font-medium">
                                {job.jobTitle || "New Position"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {job.companyName || "Company"}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem("employment", index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label
                                htmlFor={`employment[${index}].companyName`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Company Name *
                              </Label>
                              <Input
                                id={`employment[${index}].companyName`}
                                name={`employment[${index}].companyName`}
                                type="text"
                                value={job.companyName}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`employment[${index}].companyName`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`employment[${index}].companyName`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`employment[${index}].companyName`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].jobTitle`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Job Title *
                              </Label>
                              <Input
                                id={`employment[${index}].jobTitle`}
                                name={`employment[${index}].jobTitle`}
                                type="text"
                                value={job.jobTitle}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "jobTitle",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`employment[${index}].jobTitle`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`employment[${index}].jobTitle`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`employment[${index}].jobTitle`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].employmentType`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Employment Type *
                              </Label>
                              <Select
                                value={job.employmentType}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "employmentType",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[
                                      `employment[${index}].employmentType`
                                    ]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select employment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Full-time">
                                    Full-time
                                  </SelectItem>
                                  <SelectItem value="Internship">
                                    Internship
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors[
                                `employment[${index}].employmentType`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `employment[${index}].employmentType`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].totalExperienceYears`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Total Experience (Years) *
                              </Label>
                              <Input
                                id={`employment[${index}].totalExperienceYears`}
                                name={`employment[${index}].totalExperienceYears`}
                                type="number"
                                value={job.totalExperienceYears}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "totalExperienceYears",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[
                                    `employment[${index}].totalExperienceYears`
                                  ]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[
                                `employment[${index}].totalExperienceYears`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `employment[${index}].totalExperienceYears`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].totalExperienceMonths`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Total Experience (Months) *
                              </Label>
                              <Input
                                id={`employment[${index}].totalExperienceMonths`}
                                name={`employment[${index}].totalExperienceMonths`}
                                type="number"
                                value={job.totalExperienceMonths}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "totalExperienceMonths",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[
                                    `employment[${index}].totalExperienceMonths`
                                  ]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[
                                `employment[${index}].totalExperienceMonths`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `employment[${index}].totalExperienceMonths`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].joiningDateMonth`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Joining Month *
                              </Label>
                              <Select
                                value={job.joiningDateMonth}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "joiningDateMonth",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[
                                      `employment[${index}].joiningDateMonth`
                                    ]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select joining month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[
                                `employment[${index}].joiningDateMonth`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `employment[${index}].joiningDateMonth`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].joiningDateYear`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Joining Year *
                              </Label>
                              <Select
                                value={job.joiningDateYear?.toString()} // Ensure string value
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "joiningDateYear",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[
                                      `employment[${index}].joiningDateYear`
                                    ]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select joining year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[
                                `employment[${index}].joiningDateYear`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `employment[${index}].joiningDateYear`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].isCurrentEmployment`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Currently Working Here
                              </Label>
                              <Switch
                                id={`employment[${index}].isCurrentEmployment`}
                                name={`employment[${index}].isCurrentEmployment`}
                                checked={job.isCurrentEmployment}
                                onCheckedChange={(checked) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "isCurrentEmployment",
                                    checked
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            {!job.isCurrentEmployment && (
                              <>
                                <div>
                                  <Label
                                    htmlFor={`employment[${index}].endingDateMonth`}
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Ending Month
                                  </Label>
                                  <Select
                                    value={job.endingDateMonth}
                                    onValueChange={(value) =>
                                      handleComplexFieldChange(
                                        "employment",
                                        index,
                                        "endingDateMonth",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={`mt-1 ${
                                        errors[
                                          `employment[${index}].endingDateMonth`
                                        ]
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    >
                                      <SelectValue placeholder="Select ending month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors[
                                    `employment[${index}].endingDateMonth`
                                  ] && (
                                    <p className="text-sm text-red-600 mt-1">
                                      {
                                        errors[
                                          `employment[${index}].endingDateMonth`
                                        ]
                                      }
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`employment[${index}].endingDateYear`}
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Ending Year
                                  </Label>
                                  <Select
                                    value={job.endingDateYear?.toString()} // Ensure string value
                                    onValueChange={(value) =>
                                      handleComplexFieldChange(
                                        "employment",
                                        index,
                                        "endingDateYear",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={`mt-1 ${
                                        errors[
                                          `employment[${index}].endingDateYear`
                                        ]
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    >
                                      <SelectValue placeholder="Select ending year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors[
                                    `employment[${index}].endingDateYear`
                                  ] && (
                                    <p className="text-sm text-red-600 mt-1">
                                      {
                                        errors[
                                          `employment[${index}].endingDateYear`
                                        ]
                                      }
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                            <div>
                              <Label
                                htmlFor={`employment[${index}].salary`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Salary
                              </Label>
                              <Input
                                id={`employment[${index}].salary`}
                                name={`employment[${index}].salary`}
                                type="number"
                                value={job.salary}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "salary",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div className="mt-4">
                              <Label
                                htmlFor="skills"
                                className="text-sm font-medium text-gray-700"
                              >
                                Skills * (comma-separated or press Enter)
                              </Label>
                              <Textarea
                                id="skills"
                                name="skills"
                                value={input.skills.join(", ")}
                                onChange={handleSkillsChange}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent newline
                                    handleSkillsChange(e, true);
                                  }
                                }}
                                placeholder="e.g., HTML, CSS, JavaScript, React (press Enter or use commas)"
                                className={`mt-1 ${
                                  errors.skills ? "border-red-500" : ""
                                }`}
                              />
                              {errors.skills && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors.skills}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {input.skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="px-2 py-1 flex items-center gap-1"
                                  >
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setInput((prev) => ({
                                          ...prev,
                                          skills: prev.skills.filter(
                                            (_, i) => i !== index
                                          ),
                                        }));
                                      }}
                                      className="ml-1 text-gray-500 hover:text-red-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].jobProfile`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Job Profile
                              </Label>
                              <Textarea
                                id={`employment[${index}].jobProfile`}
                                name={`employment[${index}].jobProfile`}
                                value={job.jobProfile}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "jobProfile",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`employment[${index}].noticePeriod`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Notice Period
                              </Label>
                              <Input
                                id={`employment[${index}].noticePeriod`}
                                name={`employment[${index}].noticePeriod`}
                                type="text"
                                value={job.noticePeriod}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "employment",
                                    index,
                                    "noticePeriod",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )}

            {/* EDUCATION TAB */}
            {user?.role === "candidate" && (
              <TabsContent value="education" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Education
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleAddItem("education")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>

                {input.education.length === 0 ? (
                  <Card className="border border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <GraduationCap className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        No education added yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleAddItem("education")}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Education
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {input.education.map((edu, index) => (
                      <AccordionItem
                        key={index}
                        value={`education-${index}`}
                        className="border rounded-lg mb-3 p-2"
                      >
                        <div className="flex justify-between items-center">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <h4 className="text-md font-medium">
                                {edu.course || "New Course"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {edu.university || "University"}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem("education", index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label
                                htmlFor={`education[${index}].educationLevel`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Education Level *
                              </Label>
                              <Input
                                id={`education[${index}].educationLevel`}
                                name={`education[${index}].educationLevel`}
                                type="text"
                                value={edu.educationLevel}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "educationLevel",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`education[${index}].educationLevel`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`education[${index}].educationLevel`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].educationLevel`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].university`}
                                className="text-sm font-medium text-gray-700"
                              >
                                University *
                              </Label>
                              <Input
                                id={`education[${index}].university`}
                                name={`education[${index}].university`}
                                type="text"
                                value={edu.university}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "university",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`education[${index}].university`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`education[${index}].university`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].university`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].course`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Course *
                              </Label>
                              <Input
                                id={`education[${index}].course`}
                                name={`education[${index}].course`}
                                type="text"
                                value={edu.course}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "course",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`education[${index}].course`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`education[${index}].course`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].course`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].specialization`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Specialization *
                              </Label>
                              <Input
                                id={`education[${index}].specialization`}
                                name={`education[${index}].specialization`}
                                type="text"
                                value={edu.specialization}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "specialization",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`education[${index}].specialization`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`education[${index}].specialization`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].specialization`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].courseType`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Course Type *
                              </Label>
                              <Select
                                value={edu.courseType}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "courseType",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`education[${index}].courseType`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select course type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Full time">
                                    Full time
                                  </SelectItem>
                                  <SelectItem value="Part time">
                                    Part time
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors[`education[${index}].courseType`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].courseType`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].startingYear`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Starting Year *
                              </Label>
                              <Select
                                value={edu.startingYear?.toString()} // Ensure string value
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "startingYear",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`education[${index}].startingYear`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select starting year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`education[${index}].startingYear`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].startingYear`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].endingYear`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Ending Year *
                              </Label>
                              <Select
                                value={edu.endingYear?.toString()} // Ensure string value
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "endingYear",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`education[${index}].endingYear`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select ending year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`education[${index}].endingYear`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].endingYear`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`education[${index}].gradingSystem`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Grading System *
                              </Label>
                              <Input
                                id={`education[${index}].gradingSystem`}
                                name={`education[${index}].gradingSystem`}
                                type="text"
                                value={edu.gradingSystem}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "education",
                                    index,
                                    "gradingSystem",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`education[${index}].gradingSystem`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`education[${index}].gradingSystem`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`education[${index}].gradingSystem`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )}

            {/* PROJECTS TAB */}
            {user?.role === "candidate" && (
              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Projects
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleAddItem("projects")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Project
                  </Button>
                </div>

                {input.projects.length === 0 ? (
                  <Card className="border border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <FolderGit2 className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        No projects added yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleAddItem("projects")}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Project
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {input.projects.map((project, index) => (
                      <AccordionItem
                        key={index}
                        value={`project-${index}`}
                        className="border rounded-lg mb-3 p-2"
                      >
                        <div className="flex justify-between items-center">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <h4 className="text-md font-medium">
                                {project.projectTitle || "New Project"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {project.tagInstitution || "Institution"}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem("projects", index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label
                                htmlFor={`projects[${index}].projectTitle`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Project Title *
                              </Label>
                              <Input
                                id={`projects[${index}].projectTitle`}
                                name={`projects[${index}].projectTitle`}
                                type="text"
                                value={project.projectTitle}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "projectTitle",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`projects[${index}].projectTitle`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`projects[${index}].projectTitle`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].projectTitle`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].tagInstitution`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Institution *
                              </Label>
                              <Input
                                id={`projects[${index}].tagInstitution`}
                                name={`projects[${index}].tagInstitution`}
                                type="text"
                                value={project.tagInstitution}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "tagInstitution",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`projects[${index}].tagInstitution`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`projects[${index}].tagInstitution`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].tagInstitution`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].client`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Client *
                              </Label>
                              <Input
                                id={`projects[${index}].client`}
                                name={`projects[${index}].client`}
                                type="text"
                                value={project.client}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "client",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`projects[${index}].client`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`projects[${index}].client`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].client`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].projectStatus`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Project Status *
                              </Label>
                              <Select
                                value={project.projectStatus}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "projectStatus",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`projects[${index}].projectStatus`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select project status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="In progress">
                                    In progress
                                  </SelectItem>
                                  <SelectItem value="Finished">
                                    Finished
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors[`projects[${index}].projectStatus`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].projectStatus`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].workedFromYear`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Start Year *
                              </Label>
                              <Select
                                value={project.workedFromYear?.toString()} // Ensure string value
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "workedFromYear",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`projects[${index}].workedFromYear`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select start year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`projects[${index}].workedFromYear`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].workedFromYear`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].workedFromMonth`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Start Month *
                              </Label>
                              <Select
                                value={project.workedFromMonth}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "workedFromMonth",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`projects[${index}].workedFromMonth`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select start month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`projects[${index}].workedFromMonth`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].workedFromMonth`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].endingDateMonth`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Ending Month
                              </Label>
                              <Select
                                value={project.endingDateMonth}
                                onValueChange={(value) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "endingDateMonth",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`mt-1 ${
                                    errors[`projects[${index}].endingDateMonth`]
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Select ending month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`projects[${index}].endingDateMonth`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`projects[${index}].endingDateMonth`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`projects[${index}].details`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Details
                              </Label>
                              <Textarea
                                id={`projects[${index}].details`}
                                name={`projects[${index}].details`}
                                value={project.details}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "projects",
                                    index,
                                    "details",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )}

            {/* ONLINE PROFILES TAB */}
            {user?.role === "candidate" && (
              <TabsContent value="profiles" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Online Profiles
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleAddItem("onlineProfiles")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Profile
                  </Button>
                </div>

                {input.onlineProfiles.length === 0 ? (
                  <Card className="border border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Globe className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        No online profiles added yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleAddItem("onlineProfiles")}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Online
                        Profile
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {input.onlineProfiles.map((profile, index) => (
                      <AccordionItem
                        key={index}
                        value={`profile-${index}`}
                        className="border rounded-lg mb-3 p-2"
                      >
                        <div className="flex justify-between items-center">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <h4 className="text-md font-medium">
                                {profile.socialProfileName || "New Profile"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {profile.url || "URL"}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem("onlineProfiles", index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label
                                htmlFor={`onlineProfiles[${index}].socialProfileName`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Profile Name *
                              </Label>
                              <Input
                                id={`onlineProfiles[${index}].socialProfileName`}
                                name={`onlineProfiles[${index}].socialProfileName`}
                                type="text"
                                value={profile.socialProfileName}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "onlineProfiles",
                                    index,
                                    "socialProfileName",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[
                                    `onlineProfiles[${index}].socialProfileName`
                                  ]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[
                                `onlineProfiles[${index}].socialProfileName`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `onlineProfiles[${index}].socialProfileName`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`onlineProfiles[${index}].url`}
                                className="text-sm font-medium text-gray-700"
                              >
                                URL *
                              </Label>
                              <Input
                                id={`onlineProfiles[${index}].url`}
                                name={`onlineProfiles[${index}].url`}
                                type="text"
                                value={profile.url}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "onlineProfiles",
                                    index,
                                    "url",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[`onlineProfiles[${index}].url`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[`onlineProfiles[${index}].url`] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[`onlineProfiles[${index}].url`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`onlineProfiles[${index}].description`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Description
                              </Label>
                              <Textarea
                                id={`onlineProfiles[${index}].description`}
                                name={`onlineProfiles[${index}].description`}
                                value={profile.description}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "onlineProfiles",
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )}

            {/* CERTIFICATES TAB */}
            {user?.role === "candidate" && (
              <TabsContent value="certificates" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Certificates
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleAddItem("certificates")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Certificate
                  </Button>
                </div>

                {input.certificates.length === 0 ? (
                  <Card className="border border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Award className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-center">
                        No certificates added yet
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => handleAddItem("certificates")}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {input.certificates.map((cert, index) => (
                      <AccordionItem
                        key={index}
                        value={`certificate-${index}`}
                        className="border rounded-lg mb-3 p-2"
                      >
                        <div className="flex justify-between items-center">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div>
                              <h4 className="text-md font-medium">
                                {cert.certificateName || "New Certificate"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {cert.issuingOrganization || "Organization"}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem("certificates", index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label
                                htmlFor={`certificates[${index}].certificateName`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Certificate Name *
                              </Label>
                              <Input
                                id={`certificates[${index}].certificateName`}
                                name={`certificates[${index}].certificateName`}
                                type="text"
                                value={cert.certificateName}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "certificates",
                                    index,
                                    "certificateName",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[
                                    `certificates[${index}].certificateName`
                                  ]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[
                                `certificates[${index}].certificateName`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `certificates[${index}].certificateName`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`certificates[${index}].issuingOrganization`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Issuing Organization *
                              </Label>
                              <Input
                                id={`certificates[${index}].issuingOrganization`}
                                name={`certificates[${index}].issuingOrganization`}
                                type="text"
                                value={cert.issuingOrganization}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "certificates",
                                    index,
                                    "issuingOrganization",
                                    e.target.value
                                  )
                                }
                                className={`mt-1 ${
                                  errors[
                                    `certificates[${index}].issuingOrganization`
                                  ]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {errors[
                                `certificates[${index}].issuingOrganization`
                              ] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {
                                    errors[
                                      `certificates[${index}].issuingOrganization`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor={`certificates[${index}].issueDate`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Issue Date
                              </Label>
                              <Input
                                id={`certificates[${index}].issueDate`}
                                name={`certificates[${index}].issueDate`}
                                type="date"
                                value={cert.issueDate}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "certificates",
                                    index,
                                    "issueDate",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`certificates[${index}].credentialId`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Credential ID
                              </Label>
                              <Input
                                id={`certificates[${index}].credentialId`}
                                name={`certificates[${index}].credentialId`}
                                type="text"
                                value={cert.credentialId}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "certificates",
                                    index,
                                    "credentialId",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`certificates[${index}].credentialUrl`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Credential URL
                              </Label>
                              <Input
                                id={`certificates[${index}].credentialUrl`}
                                name={`certificates[${index}].credentialUrl`}
                                type="text"
                                value={cert.credentialUrl}
                                onChange={(e) =>
                                  handleComplexFieldChange(
                                    "certificates",
                                    index,
                                    "credentialUrl",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )}
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  croppedImage: PropTypes.any,
};

export default UpdateProfileDialog;
