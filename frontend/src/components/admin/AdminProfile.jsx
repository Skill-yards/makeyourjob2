import  { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../shared/Navbar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Contact, Mail, Pen, Building, Briefcase, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { Avatar, AvatarImage } from '../ui/avatar';
import CompaniesTable from './CompaniesTable';
import UpdateProfileDialog from '../UpdateProfileDialog';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
// import { Navigate } from 'react-router-dom';

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profile?.profilePhoto || 'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch companies on mount
  useGetAllCompanies();

  // Sync local profile photo with Redux user data
  useEffect(() => {
    if (user?.profile?.profilePhoto) {
      setProfilePhoto(user.profile.profilePhoto);
    }
  }, [user]);

  // Trigger file input on logo click
  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Match UpdateProfileDialog's file field

    try {
      setUploading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setProfilePhoto(res.data.user.profile.profilePhoto); // Update local state
        dispatch(setUser(res.data.user)); // Update Redux state
        toast.success('Profile logo updated successfully!');
        // Navigate('/admin/profile')
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update profile logo. Please check the API endpoint.';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-32 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <CardContent className="relative pt-16 pb-8 px-6">
            <div className="absolute -top-14 left-6">
              <div className="relative group">
                <Avatar
                  className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300 cursor-pointer hover:ring-indigo-500 transition-all"
                  onClick={handleLogoClick}
                >
                  <AvatarImage src={profilePhoto} alt="profile" />
                  {uploading && (
                    <Loader2 className="absolute h-6 w-6 animate-spin text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to change logo
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start mt-4">
              <div className="ml-36">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.firstname} {user?.lastname}
                </h1>
                <p className="text-gray-600 mt-2 italic">{user?.profile?.bio || 'No bio available'}</p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-5 py-2 shadow-md flex items-center gap-2"
              >
                <Pen className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Contact className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">{user?.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Building className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">{user?.profile?.organization || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Briefcase className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">{user?.profile?.jobRole || 'Not provided'}</span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="h-1 w-3 bg-indigo-500 rounded-full"></span>
                Your Company
              </h2>
              <CompaniesTable />
            </div>
          </CardContent>
        </Card>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <Footer />
    </div>
  );
};

export default AdminProfile;