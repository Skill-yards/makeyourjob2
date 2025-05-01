import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Delete, Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { JOB_API_END_POINT } from "../../utils/constant.js";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleDeleteJob = async (id) => {
    // Add confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );
    if (!confirmDelete) {
      return; // Exit if user cancels
    }
    try {
      const response = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, { withCredentials: true });
      if (response.data.success) {
        toast.success("Job deleted successfully");
        setFilterJobs(filterJobs.filter((job) => job._id !== id));
      } else {
        toast.error(response.data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      const errorMessage =
        error.response?.data?.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      const searchText = searchJobByText.toLowerCase();
      return (
        job?.jobTitle?.toLowerCase().includes(searchText) ||
        job?.companyName?.toLowerCase().includes(searchText)
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSalaryDisplay = (job) => {
    if (job.salaryRange?.min && job.salaryRange?.max) {
      return `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency} (${job.salaryRange.frequency})`;
    } else if (job.salaryRangeDiversity?.min && job.salaryRangeDiversity?.max) {
      return `${job.salaryRangeDiversity.min} - ${job.salaryRangeDiversity.max} ${job.salaryRangeDiversity.currency} (${job.salaryRangeDiversity.frequency})`;
    }
    return "N/A";
  };

  const getLocationDisplay = (job) => {
    if (job.workLocation) {
      return `${job.workLocation.city}, ${job.workLocation.state}, ${job.workLocation.country}`;
    }
    return job.location || "N/A";
  };

  // Function to determine row background color based on job status
  const getRowColorClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-50 hover:bg-green-100";
      case "Closed":
        return "bg-red-50 hover:bg-red-100";
      case "Draft":
        return "bg-yellow-50 hover:bg-yellow-100";
      case "Paused":
        return "bg-orange-50 hover:bg-orange-100";
      case "Filled":
        return "bg-blue-50 hover:bg-blue-100";
      case "Expired":
        return "bg-gray-50 hover:bg-gray-100";
      default:
        return "hover:bg-indigo-50";
    }
  };

  return (
    <div className="space-y-6">
      <Table className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <TableCaption className="text-gray-600">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
          <TableRow>
            <TableHead className="text-white">Company</TableHead>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Salary</TableHead>
            <TableHead className="text-white">Experience</TableHead>
            <TableHead className="text-white">Location</TableHead>
            <TableHead className="text-white">Job Type</TableHead>
            <TableHead className="text-white">Vacancies</TableHead>
            <TableHead className="text-white">Applications</TableHead>
            <TableHead className="text-white">Created At</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <TableRow
              key={job._id}
              className={`transition-colors cursor-pointer ${getRowColorClass(job.status)}`}
              onClick={() => navigate(`/admin/jobs/${job._id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {job?.company?.logo && (
                    <Avatar>
                      <AvatarImage
                        src={job.company.logo}
                        alt={job.companyName}
                      />
                    </Avatar>
                  )}
                  <span className="text-gray-800">
                    {job.companyName || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-blue-600 hover:underline">
                  {job.jobTitle || job.title || "N/A"}
                </span>
              </TableCell>
              <TableCell>{getSalaryDisplay(job)}</TableCell>
              <TableCell>{job.experienceLevel || "N/A"}</TableCell>
              <TableCell>{getLocationDisplay(job)}</TableCell>
              <TableCell>{job.jobType || "N/A"}</TableCell>
              <TableCell>{job.numberOfPositions || job.vacancies || "N/A"}</TableCell>
              <TableCell>{job.applications?.length || 0}</TableCell>
              <TableCell>{formatDate(job.createdAt || job.postedDate)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  job.status === "Open" ? "bg-green-100 text-green-800" :
                  job.status === "Closed" ? "bg-red-100 text-red-800" :
                  job.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                  job.status === "Paused" ? "bg-orange-100 text-orange-800" :
                  job.status === "Filled" ? "bg-blue-100 text-blue-800" :
                  job.status === "Expired" ? "bg-gray-100 text-gray-800" :
                  "bg-indigo-100 text-indigo-800"
                }`}>
                  {job.status || "N/A"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="text-gray-600 hover:text-indigo-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/jobs/${job._id}/update`);
                      }}
                      className="flex items-center gap-2 w-fit cursor-pointer hover:text-indigo-600"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/jobs/${job._id}/applicants`);
                      }}
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2 hover:text-indigo-600"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id);
                      }}
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2 hover:text-indigo-600"
                    >
                      <Delete className="w-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;