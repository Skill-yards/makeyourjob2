import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';
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
  const [showCalendar, setShowCalendar] = useState(false);

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

    // Required field validations
    if (!input.name) newErrors.name = "Company name is required.";
    if (!input.description) newErrors.description = "Description is required.";
    if (!input.website) newErrors.website = "Website is required.";
    if (!input.location) newErrors.location = "Location is required.";
    if (!input.gstNumber) newErrors.gstNumber = "GST number is required.";
    if (!input.cinNumber) newErrors.cinNumber = "CIN number is required.";
    if (!input.panNumber) newErrors.panNumber = "PAN number is required.";
    if (!input.foundedYear) newErrors.foundedYear = "Founded year is required.";
    if (!input.employeeCount) newErrors.employeeCount = "Employee count is required.";
    if (!input.industry) newErrors.industry = "Industry is required.";
    if (!input.contactEmail) newErrors.contactEmail = "Contact email is required.";
    if (!input.contactPhone) newErrors.contactPhone = "Contact phone is required.";
    if (!input.file) newErrors.file = "Company logo is required.";
    if (!input.gstDocument) newErrors.gstDocument = "GST document is required.";
    if (!input.cinDocument) newErrors.cinDocument = "CIN document is required.";
    if (!input.panDocument) newErrors.panDocument = "PAN document is required.";
    if (!input.registrationDocument) newErrors.registrationDocument = "Registration document is required.";

    // Format validations
    if (input.website && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(input.website)) {
      newErrors.website = "Invalid website URL.";
    }
    
    // GST Number: 15-character format (2 digits, 5 letters, 4 digits, 1 letter, 1 letter/digit, 'Z', 1 letter/digit)
    if (input.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(input.gstNumber)) {
      newErrors.gstNumber = "Invalid GST number.";
    }
    
    // CIN Number: 21-character format (L/U, 5 digits, 2 letters, 4 digits, 3 letters, 6 digits)
    if (input.cinNumber && !/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(input.cinNumber)) {
      newErrors.cinNumber = "Invalid CIN number.";
    }
    
    // PAN Number: 10-character format (5 letters, 4 digits, 1 letter)
    if (input.panNumber && !/^[A-Z]{5}\d{4}[A-Z]$/.test(input.panNumber)) {
      newErrors.panNumber = "Invalid PAN number.";
    }
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
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const changeFileHandler = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    setInput({ ...input, [name]: file });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSelectChange = (name, value) => {
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleYearSelect = (year) => {
    setInput({ ...input, foundedYear: year.toString() });
    setErrors({ ...errors, foundedYear: '' });
    setShowCalendar(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      toast.error("Please fill all required fields correctly.");
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
    formData.append('file', input.file);
    formData.append('gstDocument', input.gstDocument);
    formData.append('cinDocument', input.cinDocument);
    formData.append('panDocument', input.panDocument);
    formData.append('registrationDocument', input.registrationDocument);

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
      console.error('Error updating company:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update company. Please try again.';
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

  // Generate years for calendar dropdown (1800 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1800 + 1 }, (_, i) => currentYear - i);

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
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g., TechCorp"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website *</Label>
                  <Input
                    id="website"
                    type="text"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.website ? 'border-red-500' : ''}`}
                    placeholder="e.g., https://techcorp.com"
                    required
                  />
                  {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description *</Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="e.g., A leading tech company..."
                    required
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
                  <Input
                    id="location"
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : ''}`}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    type="text"
                    name="gstNumber"
                    value={input.gstNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.gstNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    required
                  />
                  {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="cinNumber" className="text-sm font-medium text-gray-700">CIN Number *</Label>
                  <Input
                    id="cinNumber"
                    type="text"
                    name="cinNumber"
                    value={input.cinNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.cinNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., L17110MH1990PLC054828"
                    required
                  />
                  {errors.cinNumber && <p className="text-red-500 text-xs mt-1">{errors.cinNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    type="text"
                    name="panNumber"
                    value={input.panNumber}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.panNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g., ABCDE1234F"
                    required
                  />
                  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                </div>
                <div className="relative">
                  <Label htmlFor="foundedYear" className="text-sm font-medium text-gray-700">Founded Year *</Label>
                  <div className="relative">
                    <Input
                      id="foundedYear"
                      type="text"
                      name="foundedYear"
                      value={input.foundedYear}
                      onChange={changeEventHandler}
                      className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-10 ${errors.foundedYear ? 'border-red-500' : ''}`}
                      placeholder="e.g., 1990"
                      readOnly
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  {showCalendar && (
                    <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      {years.map((year) => (
                        <div
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.foundedYear && <p className="text-red-500 text-xs mt-1">{errors.foundedYear}</p>}
                </div>
                <div>
                  <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">Employee Count *</Label>
                  <Select
                    value={input.employeeCount}
                    onValueChange={(value) => handleSelectChange('employeeCount', value)}
                    required
                  >
                    <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.employeeCount ? 'border-red-500' : ''}`}>
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
                  {errors.employeeCount && <p className="text-red-500 text-xs mt-1">{errors.employeeCount}</p>}
                </div>
                <div>
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">Industry *</Label>
                  <Select
                    value={input.industry}
                    onValueChange={(value) => handleSelectChange('industry', value)}
                    required
                  >
                    <SelectTrigger className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.industry ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Design', 'Product Management', 'Customer Support', 'IT', 'Operations', 'Other'].map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    name="contactEmail"
                    value={input.contactEmail}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.contactEmail ? 'border-red-500' : ''}`}
                    placeholder="e.g., contact@techcorp.com"
                    required
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    type="text"
                    name="contactPhone"
                    value={input.contactPhone}
                    onChange={changeEventHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.contactPhone ? 'border-red-500' : ''}`}
                    placeholder="e.g., +1234567890"
                    required
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
                <div>
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">Company Logo *</Label>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.file ? 'border-red-500' : ''}`}
                    required={!input.file}
                  />
                  {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                </div>
                <div>
                  <Label htmlFor="gstDocument" className="text-sm font-medium text-gray-700">GST Document *</Label>
                  <Input
                    id="gstDocument"
                    type="file"
                    name="gstDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.gstDocument ? 'border-red-500' : ''}`}
                    required={!input.gstDocument}
                  />
                  {errors.gstDocument && <p className="text-red-500 text-xs mt-1">{errors.gstDocument}</p>}
                </div>
                <div>
                  <Label htmlFor="cinDocument" className="text-sm font-medium text-gray-700">CIN Document *</Label>
                  <Input
                    id="cinDocument"
                    type="file"
                    name="cinDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.cinDocument ? 'border-red-500' : ''}`}
                    required={!input.cinDocument}
                  />
                  {errors.cinDocument && <p className="text-red-500 text-xs mt-1">{errors.cinDocument}</p>}
                </div>
                <div>
                  <Label htmlFor="panDocument" className="text-sm font-medium text-gray-700">PAN Document *</Label>
                  <Input
                    id="panDocument"
                    type="file"
                    name="panDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.panDocument ? 'border-red-500' : ''}`}
                    required={!input.panDocument}
                  />
                  {errors.panDocument && <p className="text-red-500 text-xs mt-1">{errors.panDocument}</p>}
                </div>
                <div>
                  <Label htmlFor="registrationDocument" className="text-sm font-medium text-gray-700">Registration Document *</Label>
                  <Input
                    id="registrationDocument"
                    type="file"
                    name="registrationDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    className={`mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${errors.registrationDocument ? 'border-red-500' : ''}`}
                    required={!input.registrationDocument}
                  />
                  {errors.registrationDocument && <p className="text-red-500 text-xs mt-1">{errors.registrationDocument}</p>}
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