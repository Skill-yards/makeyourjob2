import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, ArrowLeft, FileText, User, Mail, Phone, Briefcase, Calendar, Tag, AlertCircle } from 'lucide-react';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';

const shortlistingStatus = ['Accepted', 'Rejected', 'Pending'];

const SingleApplicants = () => {
  const { applicantId, id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [applicantData, setApplicantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Pending'); // Initialize with default
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch applicant data
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        console.log('Fetching applicant:', { applicantId, jobId });
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${applicantId}`, { withCredentials: true });
        console.log('API Response:', res.data);
        if (res.data.success && res.data.application) {
          setApplicantData(res.data.application);
          const fetchedStatus = res.data.application.status
            ? shortlistingStatus.find(
                (s) => s.toLowerCase() === res.data.application.status.toLowerCase()
              ) || 'Pending'
            : 'Pending';
          setStatus(fetchedStatus);
        } else {
          setError('Failed to fetch applicant data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response?.data?.message || 'Error fetching applicant data');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [applicantId]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!status) return;
    setIsUpdating(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setApplicantData((prev) => ({ ...prev, status }));
        navigate(`/admin/jobs/${jobId}/applicants`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get badge variant for status
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-200"
            onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Applicants
          </Button>
          <Alert
            variant="destructive"
            className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 rounded-lg shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-700 dark:text-red-300 font-semibold text-base">
              Error
            </AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-200 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!applicantData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-200"
            onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Applicants
          </Button>
          <Alert
            variant="destructive"
            className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 rounded-lg shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-700 dark:text-red-300 font-semibold text-base">
              Not Found
            </AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-200 text-sm">
              Applicant not found.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const applicant = applicantData.applicant || {};
  const profile = applicant.profile || {};
  const fullname = `${applicant.firstname || ''} ${applicant.lastname || ''}`.trim() || 'N/A';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-200"
          onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Applicants
        </Button>

        <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-t-2xl">
            <CardTitle className="text-2xl font-bold">Applicant Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                {profile.profilePhoto ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profilePhoto} alt={fullname} />
                  </Avatar>
                ) : (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://via.placeholder.com/96" alt="No Photo" />
                  </Avatar>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{fullname}</h2>
                <p className="text-gray-600 dark:text-gray-400">{applicant.role || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-gray-800 dark:text-gray-100">{applicant.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-800 dark:text-gray-100">{applicant.phoneNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                  <p className="text-gray-800 dark:text-gray-100">{applicant.gender || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resume</p>
                  {profile.resume ? (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.resumeOriginalName || 'View Resume'}
                    </a>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-100">N/A</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                  <p className="text-gray-800 dark:text-gray-100">{profile.skills?.join(', ') || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bio</p>
                  <p className="text-gray-800 dark:text-gray-100">{profile.bio || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applied On</p>
                  <p className="text-gray-800 dark:text-gray-100">{formatDate(applicantData.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <Badge variant={getStatusVariant(status)} className="text-sm">
                    {status}
                  </Badge>
                </div>
              </div>
              {applicant.role === 'recruiter' && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                    <p className="text-gray-800 dark:text-gray-100">{profile.company || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4 items-center">
              <Select value={status} onValueChange={setStatus} disabled={isUpdating}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shortlistingStatus.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
                className="text-gray-800 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || !status}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SingleApplicants;