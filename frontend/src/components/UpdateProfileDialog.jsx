import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from './ui/avatar';
import PropTypes from 'prop-types';

const UpdateProfileDialog = ({ open, setOpen, croppedImage }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    organization: user?.profile?.organization || '',
    jobRole: user?.profile?.jobRole || '',
    file: null, // For resume (candidates only)
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    console.log('Resume file selected:', file?.name, file?.type);
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstname', input.firstname);
    formData.append('lastname', input.lastname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);

    // Add the cropped logo if available
    if (croppedImage) {
      console.log(croppedImage,"sjhdjhihsa")
      if (typeof croppedImage === 'string' && croppedImage.startsWith('data:')) {
        try {
          const response = await fetch(croppedImage);
          const blob = await response.blob();
          const logoFile = new File([blob], 'organization-logo.jpg', { type: 'image/jpeg' });
          // console.log('Logo file created:', logoFile.name, logoFile.type);
          formData.append('file', logoFile); // Match backend's req.file
        } catch (error) {
          console.error('Error converting croppedImage to File:', error);
          toast.error('Failed to process logo image');
          return;
        }
      } else if (croppedImage instanceof File) {
        formData.append('file', croppedImage);
      }
    }

    if (user?.role === 'candidate') {
      formData.append('bio', input.bio);
      formData.append('skills', input.skills);
      if (input.file) {
        formData.append('file', input.file); // Resume for candidates
      }
    } else if (user?.role === 'recruiter') {
      formData.append('organization', input.organization || '');
      formData.append('jobRole', input.jobRole || '');
    }

    try {
      setLoading(true);
      console.log('Sending profile update request...');
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      console.log('Update response:', res.data);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        console.log('Updated user logo:', res.data.user.profile.profilePhoto);
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[50vw] max-w-[60vw] max-h-[70vh] overflow-y-auto p-6 bg-white rounded-xl shadow-xl">
        <DialogHeader className="relative flex items-center justify-between">
          <Button
            variant="ghost"
            className="p-1 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <DialogTitle className="text-2xl font-semibold text-gray-800 flex-1 text-center">
            Update Profile
          </DialogTitle>
          <div className="w-10"></div>
        </DialogHeader>
        <DialogDescription className="text-center text-gray-600">
          Make changes to your profile or organization logo here. Click update when you're done.
        </DialogDescription>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Organization Logo Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-indigo-500">
              <AvatarImage
                src={croppedImage || user?.profile?.organizationLogo || ''}
                alt="Organization Logo"
              />
            </Avatar>
            <div className="text-sm text-gray-500">
              {croppedImage ? 'New logo selected' : 'Current organization logo'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                value={input.firstname}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                value={input.lastname}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            {user?.role === 'candidate' && (
              <>
                <div className="md:col-span-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={changeEventHandler}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                    Skills (comma-separated)
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    placeholder="e.g., HTML, CSS, JavaScript"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                    Resume
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={fileChangeHandler}
                    className="mt-1"
                  />
                </div>
              </>
            )}
            {user?.role === 'recruiter' && (
              <>
                <div className="md:col-span-2">
                  <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={input.organization}
                    onChange={changeEventHandler}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="jobRole" className="text-sm font-medium text-gray-700">
                    Job Role
                  </Label>
                  <Input
                    id="jobRole"
                    name="jobRole"
                    value={input.jobRole}
                    onChange={changeEventHandler}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-6">
            <div className="flex space-x-2 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  croppedImage: PropTypes.string,
};

export default UpdateProfileDialog;