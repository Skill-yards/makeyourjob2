import  { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Footer from './shared/Footer';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const {user } = useSelector((store) => store.auth);

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
              <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                <AvatarImage
                  src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                  alt="profile"
                />
              </Avatar>
            </div>
            <div className="flex justify-between items-start mt-4">
              <div className="ml-36">
                <h1 className="text-2xl font-semibold text-gray-800">{user?.firstname} {user?.lastname}</h1>
                <p className="text-gray-600 mt-1">{user?.profile?.bio || "No bio available"}</p>
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
                <span>{user?.phoneNumber || "Not provided"}</span>
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
                  {user.profile.resumeOriginalName || "View Resume"}
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

      <UpdateProfileDialog open={open} setOpen={setOpen} />
        {/* Footer */}
        <Footer />
    </div>
  );
};

export default Profile;