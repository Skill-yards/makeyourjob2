import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, Building, Briefcase, X, ArrowLeft } from "lucide-react";

import { Avatar, AvatarImage } from "../ui/avatar";
import CompaniesTable from "./CompaniesTable";
import UpdateProfileDialog from "../UpdateProfileDialog";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import Cropper from "react-easy-crop";
import { Input } from "../ui/input";
import { getCroppedImg } from "../../utils/cropUtil"; // Adjust path if different
import Footer from "../shared/Footer";

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [imageSrc, setImageSrc] = useState(null); // Selected image for cropping
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const navigate = useNavigate();

  // Fetch companies on mount
  useGetAllCompanies();

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

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
      console.error("Error cropping image:", e);
    }
  }, [imageSrc, croppedAreaPixels]);

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className=" mx-auto p-6 space-y-8">
        {/* Back Button */}
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="mb-4 group flex items-center gap-2 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5  " />
          <span className="font-medium">Back</span>
        </Button>
        
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform  transition-transform duration-300">
          <div
            className="h-32 relative first:bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: "url('/logo-removebg-preview.png')" }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <CardContent className="relative pt-16 pb-8 px-6">
            <div className="absolute -top-14 left-6 md:left-6 sm:left-4">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300 sm:h-20 sm:w-20">
                  <AvatarImage
                    src={
                      croppedImage ||
                      user?.profile?.profilePhoto ||
                      "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                    }
                    alt="profile"
                  />
                </Avatar>
                <label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                >
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100">
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
            <div className="flex flex-col md:flex-row justify-between items-start mt-4 md:items-center">
              <div className="ml-0 md:ml-36 sm:ml-24 mt-4 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.firstname} {user?.lastname}
                </h1>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-4 py-2 mt-4 md:mt-0 shadow-md flex items-center gap-2 text-sm"
              >
                <Pen className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Contact className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">
                  {user?.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Building className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">
                  {user?.profile?.organization || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Briefcase className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <span className="text-sm truncate">
                  {user?.profile?.jobRole || "Not provided"}
                </span>
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
      <UpdateProfileDialog
        open={open}
        setOpen={setOpen}
        croppedImage={croppedImage}
      />
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg relative">
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
            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleCrop}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
              >
                Crop & Save
              </Button>
              <Button
                onClick={handleCancelCrop}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
       <Footer/>
    </div>
  );
};

export default AdminProfile;