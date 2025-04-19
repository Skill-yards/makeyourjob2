import  { useEffect, useState, useRef } from 'react';
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
  });
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({}); // Store references to input fields for auto-focus and scrolling

  const validateField = (name, value) => {
    const newErrors = {};

    // Required field validations
    if (name === 'name' && !value) newErrors.name = 'Company name is required.';
    if (name === 'description' && !value) newErrors.description = 'Description is required.';
    if (name === 'website' && !value) newErrors.website = 'Website is required.';
    if (name === 'location' && !value) newErrors.location = 'Location is required.';
    if (name === 'gstNumber' && !value) newErrors.gstNumber = 'GST number is required.';
    if (name === 'cinNumber' && !value) newErrors.cinNumber = 'CIN number is required.';
    if (name === 'panNumber' && !value) newErrors.panNumber = 'PAN number is required.';
    if (name === 'foundedYear' && !value) newErrors.foundedYear = 'Founded year is required.';
    if (name === 'employeeCount' && !value) newErrors.employeeCount = 'Employee count is required.';
    if (name === 'industry' && !value) newErrors.industry = 'Industry is required.';
    if (name === 'contactEmail' && !value) newErrors.contactEmail = 'Contact email is required.';
    if (name === 'contactPhone' && !value) newErrors.contactPhone = 'Contact phone is required.';
    if (name === 'file' && !value && !singleCompany?.logo) newErrors.file = 'Company logo is required.';
    if (name === 'gstDocument' && !value && !singleCompany?.gstDocument) newErrors.gstDocument = 'GST document is required.';
    if (name === 'cinDocument' && !value && !singleCompany?.cinDocument) newErrors.cinDocument = 'CIN document is required.';
    if (name === 'panDocument' && !value && !singleCompany?.panDocument) newErrors.panDocument = 'PAN document is required.';

    // Format validations
    if (name === 'website' && value && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com).';
    }
    if (name === 'gstNumber' && value && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value)) {
      newErrors.gstNumber = 'Invalid GST number format (e.g., 22AAAAA0000A1Z5).';
    }
    if (name === 'cinNumber' && value && !/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(value)) {
      newErrors.cinNumber = 'Invalid CIN number format (e.g., L17110MH1990PLC054828).';
    }
    if (name === 'panNumber' && value && !/^[A-Z]{5}\d{4}[A-Z]$/.test(value)) {
      newErrors.panNumber = 'Invalid PAN number format (e.g., ABCDE1234F).';
    }
    if (name === 'foundedYear' && value) {
      const year = Number(value);
      if (year < 1800 || year > new Date().getFullYear())
        newErrors.foundedYear = `Year must be between 1800 and ${new Date().getFullYear()}.`;
    }
    if (name === 'contactEmail' && value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      newErrors.contactEmail = 'Please enter a valid email address.';
    }
    if (name === 'contactPhone' && value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
      newErrors.contactPhone = 'Please enter a valid phone number (e.g., +1234567890).';
    }

    return newErrors;
  };

  const validateAllInputs = () => {
    const newErrors = {};

    Object.keys(input).forEach((key) => {
      const fieldErrors = validateField(key, input[key]);
      Object.assign(newErrors, fieldErrors);
    });

    setErrors(newErrors);

    // Auto-focus and scroll to the first field with an error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
        inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));

    // If there's an error, scroll to and focus the field
    if (fieldErrors[name] && inputRefs.current[name]) {
      inputRefs.current[name].focus();
      inputRefs.current[name].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const changeFileHandler = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    setInput({ ...input, [name]: file });
    const fieldErrors = validateField(name, file);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));

    // If there's an error, scroll to and focus the field
    if (fieldErrors[name] && inputRefs.current[name]) {
      inputRefs.current[name].focus();
      inputRefs.current[name].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectChange = (name, value) => {
    setInput({ ...input, [name]: value });
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));

    // If there's an error, scroll to and focus the field
    if (fieldErrors[name] && inputRefs.current[name]) {
      inputRefs.current[name].focus();
      inputRefs.current[name].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleYearSelect = (year) => {
    const yearStr = year.toString();
    setInput({ ...input, foundedYear: yearStr });
    const fieldErrors = validateField('foundedYear', yearStr);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
    setShowCalendar(false);

    // If there's an error, scroll to and focus the field
    if (fieldErrors.foundedYear && inputRefs.current.foundedYear) {
      inputRefs.current.foundedYear.focus();
      inputRefs.current.foundedYear.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateAllInputs()) {
      toast.error('Please correct the errors in the form before submitting.');
      return;
    }

    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key]) formData.append(key, input[key]);
    });

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
      const errorMsg = error.response?.data?.message || 'Failed to update company. Please try again later.';
      const errorDetails = error.response?.data?.errors || [];
      setErrors(errorDetails.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {}));
      toast.error(errorMsg);

      // Scroll to and focus the first server-side error field
      if (errorDetails.length > 0) {
        const firstErrorField = errorDetails[0].path;
        if (inputRefs.current[firstErrorField]) {
          inputRefs.current[firstErrorField].focus();
          inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
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
      });
    }
  }, [singleCompany]);

  // Generate years for calendar dropdown (1800 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1800 + 1 }, (_, i) => currentYear - i);

  // Helper to render file links
  const renderFileLink = (field, label) => {
    const file = input[field];
    const existingUrl = singleCompany?.[field];
    if (file) {
      return (
        <a
          href={URL.createObjectURL(file)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          {file.name}
        </a>
      );
    }
    if (existingUrl) {
      return (
        <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
          View {label}
        </a>
      );
    }
    return null;
  };

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
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.name = el)}
                    className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., TechCorp"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Website *
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.website = el)}
                    className={`mt-1 ${errors.website ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., https://techcorp.com"
                    required
                  />
                  {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description *
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.description = el)}
                    className={`mt-1 ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., A leading tech company..."
                    required
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.location = el)}
                    className={`mt-1 ${errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">
                    GST Number *
                  </Label>
                  <Input
                    id="gstNumber"
                    type="text"
                    name="gstNumber"
                    value={input.gstNumber}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.gstNumber = el)}
                    className={`mt-1 ${errors.gstNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    required
                  />
                  {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="cinNumber" className="text-sm font-medium text-gray-700">
                    CIN Number *
                  </Label>
                  <Input
                    id="cinNumber"
                    type="text"
                    name="cinNumber"
                    value={input.cinNumber}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.cinNumber = el)}
                    className={`mt-1 ${errors.cinNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., L17110MH1990PLC054828"
                    required
                  />
                  {errors.cinNumber && <p className="text-red-500 text-xs mt-1">{errors.cinNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">
                    PAN Number *
                  </Label>
                  <Input
                    id="panNumber"
                    type="text"
                    name="panNumber"
                    value={input.panNumber}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.panNumber = el)}
                    className={`mt-1 ${errors.panNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., ABCDE1234F"
                    required
                  />
                  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                </div>
                <div className="relative">
                  <Label htmlFor="foundedYear" className="text-sm font-medium text-gray-700">
                    Founded Year *
                  </Label>
                  <div className="relative">
                    <Input
                      id="foundedYear"
                      type="text"
                      name="foundedYear"
                      value={input.foundedYear}
                      onChange={changeEventHandler}
                      onBlur={handleBlur}
                      ref={(el) => (inputRefs.current.foundedYear = el)}
                      className={`mt-1 pr-10 ${errors.foundedYear ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                  <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">
                    Employee Count *
                  </Label>
                  <Select
                    value={input.employeeCount}
                    onValueChange={(value) => handleSelectChange('employeeCount', value)}
                    required
                  >
                    <SelectTrigger
                      ref={(el) => (inputRefs.current.employeeCount = el)}
                      className={`mt-1 ${errors.employeeCount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    >
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
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                    Industry *
                  </Label>
                  <Select
                    value={input.industry}
                    onValueChange={(value) => handleSelectChange('industry', value)}
                    required
                  >
                    <SelectTrigger
                      ref={(el) => (inputRefs.current.industry = el)}
                      className={`mt-1 ${errors.industry ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Design', 'Product Management', 'Customer Support', 'IT', 'Operations', 'Other'].map(
                        (category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    name="contactEmail"
                    value={input.contactEmail}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.contactEmail = el)}
                    className={`mt-1 ${errors.contactEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., contact@techcorp.com"
                    required
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Contact Phone *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="text"
                    name="contactPhone"
                    value={input.contactPhone}
                    onChange={changeEventHandler}
                    onBlur={handleBlur}
                    ref={(el) => (inputRefs.current.contactPhone = el)}
                    className={`mt-1 ${errors.contactPhone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="e.g., +1234567890"
                    required
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
                <div>
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                    Company Logo *
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    ref={(el) => (inputRefs.current.file = el)}
                    className={`mt-1 ${errors.file ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    required={!singleCompany?.logo}
                  />
                  {renderFileLink('logo', 'Company Logo') && (
                    <p className="text-sm mt-1">
                      Current file: {renderFileLink('logo', 'Company Logo')}
                    </p>
                  )}
                  {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                </div>
                <div>
                  <Label htmlFor="gstDocument" className="text-sm font-medium text-gray-700">
                    GST Document *
                  </Label>
                  <Input
                    id="gstDocument"
                    type="file"
                    name="gstDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    ref={(el) => (inputRefs.current.gstDocument = el)}
                    className={`mt-1 ${errors.gstDocument ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    required={!singleCompany?.gstDocument}
                  />
                  {renderFileLink('gstDocument', 'GST Document') && (
                    <p className="text-sm mt-1">
                      Current file: {renderFileLink('gstDocument', 'GST Document')}
                    </p>
                  )}
                  {errors.gstDocument && <p className="text-red-500 text-xs mt-1">{errors.gstDocument}</p>}
                </div>
                <div>
                  <Label htmlFor="cinDocument" className="text-sm font-medium text-gray-700">
                    CIN Document *
                  </Label>
                  <Input
                    id="cinDocument"
                    type="file"
                    name="cinDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    ref={(el) => (inputRefs.current.cinDocument = el)}
                    className={`mt-1 ${errors.cinDocument ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    required={!singleCompany?.cinDocument}
                  />
                  {renderFileLink('cinDocument', 'CIN Document') && (
                    <p className="text-sm mt-1">
                      Current file: {renderFileLink('cinDocument', 'CIN Document')}
                    </p>
                  )}
                  {errors.cinDocument && <p className="text-red-500 text-xs mt-1">{errors.cinDocument}</p>}
                </div>
                <div>
                  <Label htmlFor="panDocument" className="text-sm font-medium text-gray-700">
                    PAN Document *
                  </Label>
                  <Input
                    id="panDocument"
                    type="file"
                    name="panDocument"
                    accept="application/pdf,image/*"
                    onChange={changeFileHandler}
                    ref={(el) => (inputRefs.current.panDocument = el)}
                    className={`mt-1 ${errors.panDocument ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    required={!singleCompany?.panDocument}
                  />
                  {renderFileLink('panDocument', 'PAN Document') && (
                    <p className="text-sm mt-1">
                      Current file: {renderFileLink('panDocument', 'PAN Document')}
                    </p>
                  )}
                  {errors.panDocument && <p className="text-red-500 text-xs mt-1">{errors.panDocument}</p>}
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