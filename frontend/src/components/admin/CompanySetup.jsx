import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    gstNumber: '',
    cinNumber: '',
    panNumber: '',
    foundedYear: '',
    employeeCount: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    file: null,
    gstDocument: null,
    cinDocument: null,
    panDocument: null,
    registrationDocument: null,
  });

  const [errors, setErrors] = useState({});

  const validateInput = () => {
    const newErrors = {};

    if (!input.name) newErrors.name = "Company name is required.";
    if (input.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(input.website)) newErrors.website = "Invalid website URL.";
    if (input.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(input.gstNumber)) newErrors.gstNumber = "Invalid GST number format.";
    if (input.cinNumber && !/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(input.cinNumber)) newErrors.cinNumber = "Invalid CIN number format.";
    if (input.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(input.panNumber)) newErrors.panNumber = "Invalid PAN number format.";
    if (input.foundedYear) {
      const year = Number(input.foundedYear);
      if (year < 1800 || year > new Date().getFullYear()) newErrors.foundedYear = `Year must be between 1800 and ${new Date().getFullYear()}.`;
    }
    if (input.contactEmail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.contactEmail)) newErrors.contactEmail = "Invalid email format.";
    if (input.contactPhone && !/^\+?[1-9]\d{1,14}$/.test(input.contactPhone)) newErrors.contactPhone = "Invalid phone number format.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const changeFileHandler = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    setInput({ ...input, [name]: file });
  };

  const handleSelectChange = (name, value) => {
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    formData.append('gstNumber', input.gstNumber);
    formData.append('cinNumber', input.cinNumber);
    formData.append('panNumber', input.panNumber);
    formData.append('foundedYear', input.foundedYear);
    formData.append('employeeCount', input.employeeCount);
    formData.append('industry', input.industry);
    formData.append('contactEmail', input.contactEmail);
    formData.append('contactPhone', input.contactPhone);
    if (input.file) formData.append('file', input.file);
    if (input.gstDocument) formData.append('gstDocument', input.gstDocument);
    if (input.cinDocument) formData.append('cinDocument', input.cinDocument);
    if (input.panDocument) formData.append('panDocument', input.panDocument);
    if (input.registrationDocument) formData.append('registrationDocument', input.registrationDocument);

    try {
      setLoading(true);
      const res = await axios.put(`${COMPANY_API_END_POINT}/company/update/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Failed to update company';
      const errorDetails = error.response?.data?.errors || [];
      setErrors(errorDetails.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {}));
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || '',
        description: singleCompany.description || '',
        website: singleCompany.website || '',
        location: singleCompany.location || '',
        gstNumber: singleCompany.gstNumber || '',
        cinNumber: singleCompany.cinNumber || '',
        panNumber: singleCompany.panNumber || '',
        foundedYear: singleCompany.foundedYear || '',
        employeeCount: singleCompany.employeeCount || '',
        industry: singleCompany.industry || '',
        contactEmail: singleCompany.contactEmail || '',
        contactPhone: singleCompany.contactPhone || '',
        file: null,
        gstDocument: null,
        cinDocument: null,
        panDocument: null,
        registrationDocument: null,
      });
    }
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-20"></div>
          <CardHeader className="relative pt-6 pb-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800">Company Setup</CardTitle>
              <Button
                onClick={() => navigate('/admin/profile')}
                variant="outline"
                className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Company Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g., TechCorp"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.website ? 'border-red-500' : ''}`}
                    placeholder="e.g., https://techcorp.com"
                  />
                  {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., A leading tech company..."
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">GST Number</Label>
                  <Input
                    id="gstNumber"
                    type="text"
                    name="gstNumber"
                    value={input.gstNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.gstNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., 22AAAAA0000A1Z5"
                  />
                  {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="cinNumber" className="text-sm font-medium text-gray-700">CIN Number</Label>
                  <Input
                    id="cinNumber"
                    type="text"
                    name="cinNumber"
                    value={input.cinNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.cinNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., L17110MH1990PLC054828"
                  />
                  {errors.cinNumber && <p className="text-red-500 text-xs mt-1">{errors.cinNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">PAN Number</Label>
                  <Input
                    id="panNumber"
                    type="text"
                    name="panNumber"
                    value={input.panNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.panNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., ABCDE1234F"
                  />
                  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="foundedYear" className="text-sm font-medium text-gray-700">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    name="foundedYear"
                    value={input.foundedYear}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.foundedYear ? 'border-red-500' : ''}`}
                    placeholder="e.g., 1990"
                  />
                  {errors.foundedYear && <p className="text-red-500 text-xs mt-1">{errors.foundedYear}</p>}
                </div>
                <div>
                  <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">Employee Count</Label>
                  <Select
                    value={input.employeeCount}
                    onValueChange={(value) => handleSelectChange('employeeCount', value)}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201-500">201-500</SelectItem>
                      <SelectItem value="501-1000">501-1000</SelectItem>
                      <SelectItem value="1000+">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">Industry</Label>
                  <Input
                    id="industry"
                    type="text"
                    name="industry"
                    value={input.industry}
                    onChange={changeEventHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    name="contactEmail"
                    value={input.contactEmail}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.contactEmail ? 'border-red-500' : ''}`}
                    placeholder="e.g., contact@techcorp.com"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="text"
                    name="contactPhone"
                    value={input.contactPhone}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.contactPhone ? 'border-red-500' : ''}`}
                    placeholder="e.g., +1234567890"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
                <div>
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">Company Logo</Label>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="gstDocument" className="text-sm font-medium text-gray-700">GST Document</Label>
                  <Input
                    id="gstDocument"
                    type="file"
                    name="gstDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="cinDocument" className="text-sm font-medium text-gray-700">CIN Document</Label>
                  <Input
                    id="cinDocument"
                    type="file"
                    name="cinDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="panDocument" className="text-sm font-medium text-gray-700">PAN Document</Label>
                  <Input
                    id="panDocument"
                    type="file"
                    name="panDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDocument" className="text-sm font-medium text-gray-700">Registration Document</Label>
                  <Input
                    id="registrationDocument"
                    type="file"
                    name="registrationDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Update Company'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanySetup;