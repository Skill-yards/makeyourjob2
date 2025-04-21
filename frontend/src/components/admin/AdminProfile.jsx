import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, Building, Briefcase, X } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import CompaniesTable from "./CompaniesTable";
import UpdateProfileDialog from "../UpdateProfileDialog";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import Cropper from "react-easy-crop";
import { Input } from "../ui/input";
import { getCroppedImg } from "../../utils/cropUtil"; // Adjust path if different

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [imageSrc, setImageSrc] = useState(null); // Selected image for cropping
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Fetch companies on mount
  useGetAllCompanies();

  // Log croppedImage changes for debugging
  useEffect(() => {
    if (croppedImage) {
      console.log("croppedImage updated:", croppedImage.slice(0, 50) + "...");
    }
  }, [croppedImage]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name, file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
        console.log("imageSrc set:", reader.result.slice(0, 50) + "...");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

  // Update cropped area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    console.log("Cropped area updated:", croppedAreaPixels);
  }, []);

  // Generate cropped image and open dialog
  const handleCrop = useCallback(async () => {
    try {
      console.log(
        "Starting crop with imageSrc:",
        imageSrc?.slice(0, 50) + "...",
        "croppedAreaPixels:",
        croppedAreaPixels
      );
      if (!imageSrc || !croppedAreaPixels) {
        throw new Error("Missing imageSrc or croppedAreaPixels");
      }
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      console.log("Cropped image set:", croppedImageUrl.slice(0, 50) + "...");
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
    console.log("Cropping canceled, croppedImage reset to null");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
          <div
            className="h-32 relative bg-cover bg-center p-5"
            style={{
              backgroundImage: "url('/jobs.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",

              width: "100%",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <CardContent className="relative pt-16 pb-8 px-6">
            <div className="absolute -top-14 left-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-indigo-300">
                  <AvatarImage
                    src={
                      croppedImage ||
                      user?.profile?.profilePhoto ||
                      "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                    }
                    alt="profile photo"
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
            <div className="flex justify-between items-start mt-4">
              <div className="ml-36">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.firstname} {user?.lastname}
                </h1>
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
                <span className="text-sm">
                  {user?.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Building className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">
                  {user?.profile?.organization || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Briefcase className="h-5 w-5 text-indigo-500" />
                <span className="text-sm">
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
    </div>
  );
};

export default AdminProfile;
