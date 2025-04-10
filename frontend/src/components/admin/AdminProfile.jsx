import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Contact, FileText, Mail, Pen, Building, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';
import Footer from '../shared/Footer';
import { Avatar, AvatarImage } from '../ui/avatar';
import CompaniesTable from './CompaniesTable';
import UpdateProfileDialog from '../UpdateProfileDialog';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Fetch companies on mount to ensure fresh data
  useGetAllCompanies();

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
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300">
                <AvatarImage
                  src={user?.profile?.profilePhoto || 'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'}
                  alt="profile"
                />
              </Avatar>
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