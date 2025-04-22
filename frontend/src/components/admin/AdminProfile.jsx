// import { useState, useCallback, useEffect } from "react";
// import { useSelector } from "react-redux";
// import Navbar from "../shared/Navbar";
// import { Card, CardContent } from "../ui/card";
// import { Button } from "../ui/button";
// import { Contact, Mail, Pen, Building, Briefcase, X } from "lucide-react";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import CompaniesTable from "./CompaniesTable";
// import UpdateProfileDialog from "../UpdateProfileDialog";
// import useGetAllCompanies from "@/hooks/useGetAllCompanies";
// import Cropper from "react-easy-crop";
// import { Input } from "../ui/input";
// import { getCroppedImg } from "../../utils/cropUtil"; // Adjust path if different

// const AdminProfile = () => {
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const [imageSrc, setImageSrc] = useState(null); // Selected image for cropping
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [showCropper, setShowCropper] = useState(false);

//   // Fetch companies on mount
//   useGetAllCompanies();

//   // Log croppedImage changes for debugging
//   useEffect(() => {
//     if (croppedImage) {
//       console.log("croppedImage updated:", croppedImage.slice(0, 50) + "...");
//     }
//   }, [croppedImage]);

//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       console.log("Selected file:", file.name, file.type);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImageSrc(reader.result);
//         setShowCropper(true);
//         console.log("imageSrc set:", reader.result.slice(0, 50) + "...");
//       };
//       reader.readAsDataURL(file);
//     } else {
//       console.log("No file selected");
//     }
//   };

//   // Update cropped area
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//     console.log("Cropped area updated:", croppedAreaPixels);
//   }, []);

//   // Generate cropped image and open dialog
//   const handleCrop = useCallback(async () => {
//     try {
//       console.log(
//         "Starting crop with imageSrc:",
//         imageSrc?.slice(0, 50) + "...",
//         "croppedAreaPixels:",
//         croppedAreaPixels
//       );
//       if (!imageSrc || !croppedAreaPixels) {
//         throw new Error("Missing imageSrc or croppedAreaPixels");
//       }
//       const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
//       setCroppedImage(croppedImageUrl);
//       console.log("Cropped image set:", croppedImageUrl.slice(0, 50) + "...");
//       setShowCropper(false);
//       setOpen(true); // Open UpdateProfileDialog
//     } catch (e) {
//       console.error("Error cropping image:", e);
//     }
//   }, [imageSrc, croppedAreaPixels]);

//   // Cancel cropping
//   const handleCancelCrop = () => {
//     setShowCropper(false);
//     setImageSrc(null);
//     setCroppedImage(null);
//     console.log("Cropping canceled, croppedImage reset to null");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       <Navbar />
//       <div className="max-w-5xl mx-auto p-6 space-y-8">
//         <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
//           <div
//             className="h-32 relative bg-cover bg-center p-5"
//             style={{
//               backgroundImage: "url('/jobs.jpg')",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",

//               width: "100%",
//             }}
//           >
//             <div className="absolute inset-0 bg-black/10"></div>
//           </div>

//           <CardContent className="relative pt-16 pb-8 px-6">
//             <div className="absolute -top-14 left-6">
//               <div className="relative group">
//                 <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300">
//                   <AvatarImage
//                     src={
//                       croppedImage ||
//                       user?.profile?.profilePhoto ||
//                       "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
//                     }
//                     alt="profile photo"
//                   />
//                 </Avatar>
//                 <label
//                   htmlFor="profilePhoto"
//                   className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
//                 >
//                   <span className="text-white text-sm opacity-0 group-hover:opacity-100">
//                     Change Photo
//                   </span>
//                 </label>
//                 <Input
//                   id="profilePhoto"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-between items-start mt-4">
//               <div className="ml-36">
//                 <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//                   {user?.firstname} {user?.lastname}
//                 </h1>
//               </div>
//               <Button
//                 onClick={() => setOpen(true)}
//                 className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-5 py-2 shadow-md flex items-center gap-2"
//               >
//                 <Pen className="h-4 w-4" />
//                 Edit Profile
//               </Button>
//             </div>
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
//                 <Mail className="h-5 w-5 text-indigo-500" />
//                 <span className="text-sm">{user?.email}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
//                 <Contact className="h-5 w-5 text-indigo-500" />
//                 <span className="text-sm">
//                   {user?.phoneNumber || "Not provided"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
//                 <Building className="h-5 w-5 text-indigo-500" />
//                 <span className="text-sm">
//                   {user?.profile?.organization || "Not provided"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
//                 <Briefcase className="h-5 w-5 text-indigo-500" />
//                 <span className="text-sm">
//                   {user?.profile?.jobRole || "Not provided"}
//                 </span>
//               </div>
//             </div>
//             <div className="mt-8">
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <span className="h-1 w-3 bg-indigo-500 rounded-full"></span>
//                 Your Company
//               </h2>
//               <CompaniesTable />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <UpdateProfileDialog
//         open={open}
//         setOpen={setOpen}
//         croppedImage={croppedImage}
//       />
//       {showCropper && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={handleCancelCrop}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-6 w-6" />
//             </button>
//             <h2 className="text-lg font-semibold mb-4">Crop Profile Photo</h2>
//             <div className="relative w-full h-64">
//               <Cropper
//                 image={imageSrc}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropShape="round"
//                 showGrid={false}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//               />
//             </div>
//             <div className="mt-4 flex space-x-4">
//               <Button
//                 onClick={handleCrop}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white"
//               >
//                 Crop & Save
//               </Button>
//               <Button
//                 onClick={handleCancelCrop}
//                 variant="outline"
//                 className="border-gray-300 text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProfile;




import { useState, useCallback, useMemo } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText, X, ChevronDown, ChevronUp, Briefcase, Book, Code, Award, Link2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Footer from './shared/Footer';
import { getCroppedImg } from '../utils/cropUtil';
import Cropper from 'react-easy-crop';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify'; // For error notifications

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    employment: false,
    education: false,
    projects: false,
    certificates: false,
    onlineProfiles: false,
  });

  const { user } = useSelector((store) => store.auth);

  // Validate and handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
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
      console.error('Error cropping image:', e);
      toast.error('Failed to crop image. Please try again.');
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleCancelCrop = useCallback(() => {
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Memoize employment rendering to optimize performance
  const employmentContent = useMemo(() => (
    user?.profile?.employment?.length > 0 ? (
      user.profile.employment.map((emp, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
          <h3 className="text-lg font-medium text-gray-800">{emp.jobTitle}</h3>
          <p className="text-gray-600">{emp.companyName}</p>
          <p className="text-gray-500 text-sm">
            {emp.joiningDateMonth} {emp.joiningDateYear} -{' '}
            {emp.isCurrentEmployment
              ? 'Present'
              : `${emp.endingDateMonth || ''} ${emp.endingDateYear || ''}`}
          </p>
          <p className="text-gray-600 mt-2">{emp	jobProfile || 'No details'}</p>
          <div className="mt-2">
            <span className="text-gray-600 text-sm">Skills Used: </span>
            {emp.skillsUsed?.length > 0 ? (
              emp.skillsUsed.map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-indigo-100 text-indigo-800 mr-1 hover:bg-indigo-200 transition-colors"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">None</span>
            )}
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No employment history added</p>
    )
  ), [user?.profile?.employment]);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="h-40 md:h-56 bg-gradient-to-b from-transparent to-black/20"></div>
          <div className="absolute top-20 md:top-28 left-6 md:left-12">
            <div className="relative group">
              <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-xl ring-4 ring-indigo-300/50 transition-transform group-hover:scale-105">
                <AvatarImage
                  src={croppedImage || user?.profile?.profilePhoto || 'https://via.placeholder.com/150'}
                  alt={`${user?.firstname} ${user?.lastname}'s profile`}
                  className="object-cover"
                />
              </Avatar>
              <label
                htmlFor="profilePhoto"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
              >
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                  Change Photo
                </span>
              </label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="px-6 md:px-12 pb-10 pt-16 md:pt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="ml-0 md:ml-48">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                  {user?.firstname} {user?.lastname}
                </h1>
                <p className="text-indigo-100 mt-2 text-lg max-w-2xl">
                  {user?.profile?.bio || 'Add a bio to showcase your personality!'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 text-indigo-100">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-200" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Contact className="h-5 w-5 text-indigo-200" />
                    <span className="text-sm">{user?.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full px-6 py-2 shadow-md transition-all duration-300"
                aria-label="Edit profile"
              >
                <Pen className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Profile Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No skills added</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resume Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.profile?.resume ? (
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:underline font-medium"
                >
                  <FileText className="h-5 w-5" />
                  {user.profile.resumeOriginalName || 'View Resume'}
                </a>
              ) : (
                <span className="text-gray-500">No resume uploaded</span>
              )}
            </CardContent>
          </Card>

          {/* Role-Specific Info */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                {user?.role === 'recruiter' ? 'Organization' : 'Job Role'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.role === 'recruiter' ? (
                <p className="text-gray-700">{user?.profile?.organization || 'Not provided'}</p>
              ) : (
                <p className="text-gray-700">{user?.profile?.jobRole || 'Not provided'}</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Collapsible Sections */}
        <section className="space-y-6">
          {/* Employment History */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader
              className="cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('employment')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('employment')}
              tabIndex={0}
              role="button"
              aria-expanded={expandedSections.employment}
            >
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Employment History
              </CardTitle>
              {expandedSections.employment ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </CardHeader>
            <AnimatePresence>
              {expandedSections.employment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent>{employmentContent}</CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Education */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader
              className="cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('education')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('education')}
              tabIndex={0}
              role="button"
              aria-expanded={expandedSections.education}
            >
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Book className="h-5 w-5 text-indigo-600" />
                Education
              </CardTitle>
              {expandedSections.education ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </CardHeader>
            <AnimatePresence>
              {expandedSections.education && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent>
                    {user?.profile?.education?.length > 0 ? (
                      user.profile.education.map((edu, index) => (
                        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                          <h3 className="text-lg font-medium text-gray-800">{edu.course}</h3>
                          <p className="text-gray-600">{edu.university}</p>
                          <p className="text-gray-500 text-sm">
                            {edu.startingYear} - {edu.endingYear}
                          </p>
                          <p className="text-gray-600 mt-2">{edu.specialization}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {edu.courseType} • {edu.gradingSystem}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No education details added</p>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Projects */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader
              className="cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('projects')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('projects')}
              tabIndex={0}
              role="button"
              aria-expanded={expandedSections.projects}
            >
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600" />
                Projects
              </CardTitle>
              {expandedSections.projects ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </CardHeader>
            <AnimatePresence>
              {expandedSections.projects && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent>
                    {user?.profile?.projects?.length > 0 ? (
                      user.profile.projects.map((proj, index) => (
                        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                          <h3 className="text-lg font-medium text-gray-800">{proj.projectTitle}</h3>
                          <p className="text-gray-600">{proj.client}</p>
                          <p className="text-gray-500 text-sm">
                            {proj.workedFromMonth} {proj.workedFromYear}{' '}
                            {proj.projectStatus === 'In progress'
                              ? '- Ongoing'
                              : `- ${proj.endingDateMonth || ''} ${proj.workedFromYear}`}
                          </p>
                          <p className="text-gray-600 mt-2">{proj.details || 'No details'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No projects added</p>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Certificates */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader
              className="cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('certificates')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('certificates')}
              tabIndex={0}
              role="button"
              aria-expanded={expandedSections.certificates}
            >
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                Certificates
              </CardTitle>
              {expandedSections.certificates ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </CardHeader>
            <AnimatePresence>
              {expandedSections.certificates && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent>
                    {user?.profile?.certificates?.length > 0 ? (
                      user.profile.certificates.map((cert, index) => (
                        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                          <h3 className="text-lg font-medium text-gray-800">{cert.certificateName}</h3>
                          <p className="text-gray-600">{cert.issuingOrganization}</p>
                          <p className="text-gray-500 text-sm">
                            Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                          </p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline font-medium mt-2 inline-block"
                            >
                              View Credential
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No certificates added</p>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Online Profiles */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader
              className="cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('onlineProfiles')}
              onKeyDown={(e) => e.key === 'Enter' && toggleSection('onlineProfiles')}
              tabIndex={0}
              role="button"
              aria-expanded={expandedSections.onlineProfiles}
            >
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-indigo-600" />
                Online Profiles
              </CardTitle>
              {expandedSections.onlineProfiles ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </CardHeader>
            <AnimatePresence>
              {expandedSections.onlineProfiles && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent>
                    {user?.profile?.onlineProfiles?.length > 0 ? (
                      user.profile.onlineProfiles.map((profile, index) => (
                        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                          <h3 className="text-lg font-medium text-gray-800">{profile.socialProfileName}</h3>
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline font-medium"
                          >
                            {profile.url}
                          </a>
                          <p className="text-gray-600 mt-2">{profile.description || 'No description'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No online profiles added</p>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </section>

        {/* Applied Jobs */}
        <section>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Applied Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppliedJobTable />
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} croppedImage={croppedImage} />

      {/* Cropper Modal */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
            <button
              onClick={handleCancelCrop}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close cropper"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Crop Profile Photo</h2>
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
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
            <div className="mt-6 flex space-x-4">
              <Button
                onClick={handleCrop}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
              >
                Crop & Save
              </Button>
              <Button
                onClick={handleCancelCrop}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;