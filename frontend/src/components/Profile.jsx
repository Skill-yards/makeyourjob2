import { useState, useCallback } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText, X, Briefcase, GraduationCap, Award, Globe, Code } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Footer from './shared/Footer';
import { getCroppedImg } from '../utils/cropUtil';
import Cropper from 'react-easy-crop';
import { Input } from './ui/input';
import { useSelector } from 'react-redux';



const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const {user} = useSelector(store=>store.auth);
  
  console.log(user,"check user come or not")

  // Use static data for now; replace with useSelector if dynamic
  // const user = staticUserData;

  // Handle image selection
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

  // Update cropped area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate cropped image and open dialog
  const handleCrop = useCallback(async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setShowCropper(false);
      setOpen(true);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels]);

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Profile Header Card */}
        <Card className="relative bg-white shadow-2xl rounded-2xl overflow-hidden border-none transform transition-all hover:scale-[1.01]">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-indigo-200 transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={croppedImage || user.profile.profilePhoto}
                    alt="profile"
                    className="object-cover"
                  />
                </Avatar>
                <label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
                >
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 font-medium">Change Photo</span>
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
          </div>
          <CardContent className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div className="ml-44">
                <h1 className="text-3xl font-bold text-gray-900">{user.firstname} {user.lastname}</h1>
                <p className="text-gray-600 mt-2 text-lg">{user.profile.bio}</p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 py-2 transition-all duration-300"
              >
                <Pen className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 text-gray-700">
                <Mail className="h-6 w-6 text-indigo-600" />
                <span className="text-lg">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <Contact className="h-6 w-6 text-indigo-600" />
                <span className="text-lg">{user.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skills, Resume, Certificates */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Code className="h-6 w-6 mr-2 text-indigo-600" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {user.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 text-lg transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  {user.profile.resumeOriginalName}
                </a>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-indigo-600" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.certificates.map((cert, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{cert.certificateName}</h3>
                    <p className="text-gray-600">{cert.issuingOrganization} • {cert.issueDate}</p>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View Credential
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Education, Employment, Projects, Online Profiles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Education */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{edu.educationLevel} in {edu.specialization}</h3>
                    <p className="text-gray-600">{edu.university} • {edu.startingYear} - {edu.endingYear}</p>
                    <p className="text-gray-500 text-sm">{edu.courseType} • {edu.gradingSystem}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Employment */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
                  Employment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.employment.map((emp, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{emp.jobTitle}</h3>
                    <p className="text-gray-600">
                      {emp.companyName} • {emp.joiningDateMonth} {emp.joiningDateYear} -{' '}
                      {emp.isCurrentEmployment ? 'Present' : `${emp.endingDateMonth} ${emp.endingDateYear}`}
                    </p>
                    <p className="text-gray-500 text-sm">{emp.employmentType} • {emp.jobProfile}</p>
                    <p className="text-gray-500 text-sm">Notice Period: {emp.noticePeriod} days</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Code className="h-6 w-6 mr-2 text-indigo-600" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{project.projectTitle}</h3>
                    <p className="text-gray-600">{project.tagInstitution} • {project.client}</p>
                    <p className="text-gray-500 text-sm">
                      {project.workedFromMonth} {project.workedFromYear} - {project.endingDateMonth} •{' '}
                      {project.projectStatus}
                    </p>
                    <p className="text-gray-600 mt-1">{project.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Online Profiles */}
            <Card className="bg-white shadow-xl rounded-2xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-indigo-600" />
                  Online Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.onlineProfiles.map((profile, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{profile.socialProfileName}</h3>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {profile.url}
                    </a>
                    <p className="text-gray-600 mt-1">{profile.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <Card className="bg-white shadow-xl rounded-2xl border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Applied Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <AppliedJobTable />
          </CardContent>
        </Card>
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} croppedImage={croppedImage} />

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <button
              onClick={handleCancelCrop}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Crop Profile Photo</h2>
            <div className="relative w-full h-80">
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2"
              >
                Crop & Save
              </Button>
              <Button
                onClick={handleCancelCrop}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-full px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;