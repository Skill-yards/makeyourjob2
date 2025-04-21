import  { useState, useCallback } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Footer from './shared/Footer';
import { getCroppedImg } from '../utils/cropUtil'; // Adjust path if different
import Cropper from 'react-easy-crop';
import { Input } from './ui/input';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [imageSrc, setImageSrc] = useState(null); // Selected image for cropping
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

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
      setOpen(true); // Open UpdateProfileDialog
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24">
          </div>
          <CardContent className="relative pt-12 pb-8 px-6">
            <div className="absolute -top-16 left-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300">
                  <AvatarImage
                    src={
                      croppedImage ||
                      user?.profile?.profilePhoto ||
                      'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
                    }
                    alt="profile"
                  />
                </Avatar>
                <label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                >
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100">Change Photo</span>
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
            <div className="flex justify-between items-start mt-4">
              <div className="ml-36">
                <h1 className="text-2xl font-semibold text-gray-800">{user?.firstname} {user?.lastname}</h1>
                <p className="text-gray-600 mt-1">{user?.profile?.bio || 'No bio available'}</p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="hover:bg-indigo-50 transition-colors"
              >
                <Pen className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-indigo-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Contact className="h-5 w-5 text-indigo-500" />
                <span>{user?.phoneNumber || 'Not provided'}</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No skills added</span>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800">Resume</h2>
              {user?.profile?.resume ? (
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:underline mt-2"
                >
                  <FileText className="h-5 w-5" />
                  {user.profile.resumeOriginalName || 'View Resume'}
                </a>
              ) : (
                <span className="text-gray-500 mt-2">No resume uploaded</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applied Jobs Section */}
        <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Applied Jobs</CardTitle>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={handleCancelCrop}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Crop Profile Photo</h2>
            <div className="relative w-full h-64">
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
            <div className="mt-4 flex space-x-4">
              <Button
                onClick={handleCrop}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Crop & Save
              </Button>
              <Button
                onClick={handleCancelCrop}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;