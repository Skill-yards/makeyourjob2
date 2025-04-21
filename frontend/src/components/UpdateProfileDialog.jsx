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
  const [errors, setErrors] = useState({});
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  console.log(user,"check for user");
  

  const [input, setInput] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '', // Only for recruiter
    bio: user?.profile?.bio || '', // Only for candidate
    skills: user?.profile?.skills?.join(', ') || '', // Only for candidate
    organization: user?.profile?.organization || '', // Only for recruiter
    jobRole: user?.profile?.jobRole || '', // Only for recruiter
    file: null, // For resume (candidates only)
  });

  const validateInputs = () => {
    const newErrors = {};
    if (!input.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!input.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!input.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(input.email)) newErrors.email = 'Invalid email format';
    
    if (user?.role === 'candidate') {
      if (!input.bio.trim()) newErrors.bio = 'Bio is required';
      if (!input.skills.trim()) newErrors.skills = 'Skills are required';
    } else if (user?.role === 'recruiter') {
      if (!input.phone) newErrors.phone = 'Phone number is required';
      if (!input.organization.trim()) newErrors.organization = 'Organization is required';
      if (!input.jobRole.trim()) newErrors.jobRole = 'Job role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    console.log('Resume file selected:', file?.name, file?.type);
    setInput({ ...input, file });
    setErrors({ ...errors, file: '' });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    const formData = new FormData();
    formData.append('firstname', input.firstname);
    formData.append('lastname', input.lastname);
    formData.append('email', input.email);

    if (croppedImage) {
      if (typeof croppedImage === 'string' && croppedImage.startsWith('blob:')) {
        try {
          const response = await fetch(croppedImage);
          const blob = await response.blob();
          const profileImageFile = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
          formData.append('profilePhoto', profileImageFile);
          console.log('Profile Photo File:', profileImageFile); // Debug log
        } catch (error) {
          toast.error('Failed to process profile image');
          return;
        }
      } else if (croppedImage instanceof File) {
        formData.append('profilePhoto', croppedImage);
        console.log('Profile Photo File (direct):', croppedImage); // Debug log
      }
    }

    if (user?.role === 'candidate') {
      formData.append('bio', input.bio);
      formData.append('skills', input.skills);
      if (input.file) formData.append('file', input.file);
    } else if (user?.role === 'recruiter') {
      formData.append('phone', input.phone);
      formData.append('organization', input.organization);
      formData.append('jobRole', input.jobRole);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log(formData, 'Form Data:', res.data); // Debug log
      
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        console.log('Updated user logo:', res.data.user.profile.profilePhoto);
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] max-w-[600px] max-h-[80vh] overflow-y-auto p-6 bg-white rounded-xl shadow-2xl">
        <DialogHeader className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="p-1 hover:bg-gray-100"
            onClick={() => setOpen(false)}
            disabled={loading}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <DialogTitle className="text-2xl font-semibold text-gray-800 flex-1 text-center">
            Update Profile
          </DialogTitle>
          <div className="w-10" />
        </DialogHeader>
        <DialogDescription className="text-center text-gray-600 mb-4">
          Update your {user?.role === 'recruiter' ? 'recruiter' : 'candidate'} profile details below.
        </DialogDescription>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24 border-2 border-indigo-500">
              <AvatarImage
                src={croppedImage || user?.profile?.profilePhoto || ''}
                alt={user?.role === 'recruiter' ? 'Logo' : 'Profile'}
              />
            </Avatar>
            <span className="text-sm text-gray-500">
              {croppedImage
                ? `New ${user?.role === 'recruiter' ? 'logo' : 'profile photo'} selected`
                : `Current ${user?.role === 'recruiter' ? 'logo' : 'profile photo'}`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
                aria-invalid={!!errors.firstname}
                aria-describedby="firstname-error"
              />
              {errors.firstname && (
                <p id="firstname-error" className="text-sm text-red-600 mt-1">
                  {errors.firstname}
                </p>
              )}
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
                aria-invalid={!!errors.lastname}
                aria-describedby="lastname-error"
              />
              {errors.lastname && (
                <p id="lastname-error" className="text-sm text-red-600 mt-1">
                  {errors.lastname}
                </p>
              )}
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
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            {user?.role === 'recruiter' && (
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={input.phone}
                  onChange={changeEventHandler}
                  className="mt-1"
                  aria-invalid={!!errors.phone}
                  aria-describedby="phone-error"
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            )}
            {user?.role === 'candidate' && (
              <>
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={changeEventHandler}
                    className="mt-1"
                    aria-invalid={!!errors.bio}
                    aria-describedby="bio-error"
                  />
                  {errors.bio && (
                    <p id="bio-error" className="text-sm text-red-600 mt-1">
                      {errors.bio}
                    </p>
                  )}
                </div>
                <div>
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
                    aria-invalid={!!errors.skills}
                    aria-describedby="skills-error"
                  />
                  {errors.skills && (
                    <p id="skills-error" className="text-sm text-red-600 mt-1">
                      {errors.skills}
                    </p>
                  )}
                </div>
                <div>
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
                <div>
                  <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={input.organization}
                    onChange={changeEventHandler}
                    className="mt-1"
                    aria-invalid={!!errors.organization}
                    aria-describedby="organization-error"
                  />
                  {errors.organization && (
                    <p id="organization-error" className="text-sm text-red-600 mt-1">
                      {errors.organization}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="jobRole" className="text-sm font-medium text-gray-700">
                    Job Role
                  </Label>
                  <Input
                    id="jobRole"
                    name="jobRole"
                    value={input.jobRole}
                    onChange={changeEventHandler}
                    className="mt-1"
                    aria-invalid={!!errors.jobRole}
                    aria-describedby="jobRole-error"
                  />
                  {errors.jobRole && (
                    <p id="jobRole-error" className="text-sm text-red-600 mt-1">
                      {errors.jobRole}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-6">
            <div className="flex space-x-3 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border-gray-300"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
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