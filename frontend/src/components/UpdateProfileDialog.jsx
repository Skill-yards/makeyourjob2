import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, X, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
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
    file: null, // File input starts as null
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstname', input.firstname);
    formData.append('lastname', input.lastname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('bio', input.bio);
    formData.append('skills', input.skills); // Skills as a comma-separated string
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="min-w-[50vw] max-w-[60vw] max-h-[70vh] overflow-y-auto p-6 bg-white rounded-xl shadow-xl"
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Update Profile</DialogTitle>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 p-1 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5 text-gray-600" />
          </Button>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">First Name</Label>
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
              <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">Last Name</Label>
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
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
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills (comma-separated)</Label>
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
              <Label htmlFor="file" className="text-sm font-medium text-gray-700">Resume</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;