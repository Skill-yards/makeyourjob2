import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const shortlistingStatus = ['Accepted', 'Rejected'];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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

  const handleRowClick = (applicantId) => {
    if (jobId) {
      navigate(`/admin/jobs/${jobId}/applicants/${applicantId}`);
    }
  };

  return (
    <div>
      <Table className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <TableCaption className="text-gray-600">A list of applicants for this job</TableCaption>
        <TableHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
          <TableRow>
            <TableHead className="text-white">Profile</TableHead>
            <TableHead className="text-white">Full Name</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Phone</TableHead>
            <TableHead className="text-white">Resume</TableHead>
            <TableHead className="text-white">Skills</TableHead>
            <TableHead className="text-white">Gender</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Bio</TableHead>
            <TableHead className="text-white">Applied On</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item) => {
            const applicant = item?.applicant || {};
            const profile = applicant?.profile || {};
            const fullname = `${applicant.firstname || ''} ${applicant.lastname || ''}`.trim() || 'N/A';
            const status = item.status || 'Pending';

            return (
              <TableRow
                key={item._id}
                className="hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(item._id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {profile?.profilePhoto ? (
                      <Avatar>
                        <AvatarImage src={profile.profilePhoto} alt={fullname} />
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src="https://via.placeholder.com/40" alt="No Photo" />
                      </Avatar>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-800">{fullname}</TableCell>
                <TableCell className="text-gray-800">{applicant.email || 'N/A'}</TableCell>
                <TableCell>{applicant.phoneNumber || 'N/A'}</TableCell>
                <TableCell>
                  {profile.resume ? (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                      {profile.resumeOriginalName || 'View Resume'}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{profile.skills?.join(', ') || 'N/A'}</TableCell>
                <TableCell>{applicant.gender || 'N/A'}</TableCell>
                <TableCell>{applicant.role || 'N/A'}</TableCell>
                <TableCell>{profile.bio || 'N/A'}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(status)} className="text-sm">
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="text-gray-600 hover:text-indigo-600 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((statusOption, index) => (
                        <div
                          key={index}
                          onClick={() => statusHandler(statusOption, item._id)}
                          className="flex items-center gap-2 w-fit my-2 cursor-pointer hover:text-indigo-600"
                        >
                          <span>{statusOption}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;