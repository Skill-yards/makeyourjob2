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
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Profile Header Card */}
        <Card className="relative bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-gray-100/50 transition-all duration-300 hover:shadow-2xl">
          <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
            <div className="absolute -bottom-20 left-10">
              <div className="relative group">
                <Avatar className="h-36 w-36 border-4 border-white shadow-2xl ring-4 ring-blue-200/50 transition-transform group-hover:scale-110 duration-300">
                  <AvatarImage
                    src={croppedImage || user.profile.profilePhoto}
                    alt="profile"
                    className="object-cover transition-opacity group-hover:opacity-90"
                  />
                </Avatar>
                <label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/60 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
                >
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all">Update Photo</span>
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
          <CardContent className="pt-24 pb-10 px-10">
            <div className="flex justify-between items-start">
              <div className="ml-48">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.firstname} {user.lastname}</h1>
                <p className="text-gray-600 mt-3 text-lg font-medium max-w-2xl">{user.profile.bio}</p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Pen className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center gap-5 text-gray-700 hover:text-blue-600 transition-colors">
                <Mail className="h-7 w-7 text-blue-600" />
                <span className="text-lg font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-5 text-gray-700 hover:text-blue-600 transition-colors">
                <Contact className="h-7 w-7 text-blue-600" />
                <span className="text-lg font-medium">{user.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Skills, Resume, Certificates */}
          <div className="lg:col-span-1 space-y-10">
            {/* Skills */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Code className="h-7 w-7 mr-3 text-blue-600" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {user.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <FileText className="h-7 w-7 mr-3 text-blue-600" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors group"
                >
                  <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {user.profile.resumeOriginalName}
                </a>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Award className="h-7 w-7 mr-3 text-blue-600" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.certificates.map((cert, index) => (
                  <div key={index} className="mb-6 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{cert.certificateName}</h3>
                    <p className="text-gray-600">{cert.issuingOrganization} • {cert.issueDate}</p>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      View Credential
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Education, Employment, Projects, Online Profiles */}
          <div className="lg:col-span-2 space-y-10">
            {/* Education */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-7 w-7 mr-3 text-blue-600" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.education.map((edu, index) => (
                  <div key={index} className="mb-6 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{edu.educationLevel} in {edu.specialization}</h3>
                    <p className="text-gray-600 font-medium">{edu.university} • {edu.startingYear} - {edu.endingYear}</p>
                    <p className="text-gray-500 text-sm">{edu.courseType} • {edu.gradingSystem}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Employment */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-7 w-7 mr-3 text-blue-600" />
                  Employment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.employment.map((emp, index) => (
                  <div key={index} className="mb-6 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.jobTitle}</h3>
                    <p className="text-gray-600 font-medium">
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
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Code className="h-7 w-7 mr-3 text-blue-600" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.projects.map((project, index) => (
                  <div key={index} className="mb-6 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.projectTitle}</h3>
                    <p className="text-gray-600 font-medium">{project.tagInstitution} • {project.client}</p>
                    <p className="text-gray-500 text-sm">
                      {project.workedFromMonth} {project.workedFromYear} - {project.endingDateMonth} •{' '}
                      {project.projectStatus}
                    </p>
                    <p className="text-gray-600 mt-2 font-medium">{project.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Online Profiles */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Globe className="h-7 w-7 mr-3 text-blue-600" />
                  Online Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.profile.onlineProfiles.map((profile, index) => (
                  <div key={index} className="mb-6 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{profile.socialProfileName}</h3>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {profile.url}
                    </a>
                    <p className="text-gray-600 mt-2 font-medium">{profile.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl border border-gray-100/30 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">Applied Jobs</CardTitle>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 w-full max-w-lg relative shadow-2xl transform transition-all scale-100 hover:scale-105">
            <button
              onClick={handleCancelCrop}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              <X className="h-7 w-7" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Crop Your Profile Photo</h2>
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
              <Button
                onClick={handleCrop}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Crop & Save
              </Button>
              <Button
                onClick={handleCancelCrop}
                className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300"
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