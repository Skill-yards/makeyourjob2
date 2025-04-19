import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Application Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Job Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{formatDateTime(appliedJob.createdAt)}</TableCell>
                <TableCell>{appliedJob.job?.jobTitle || "N/A"}</TableCell>
                <TableCell>{appliedJob.job?.company?.name || appliedJob.job?.companyName || "N/A"}</TableCell>
                <TableCell>{appliedJob.job?.workLocation?.city || appliedJob.job?.workplacePlane || "N/A"}</TableCell>
                <TableCell>{appliedJob.job?.jobType || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob.status === "rejected"
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : appliedJob.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    } capitalize`}
                    aria-label={`Application status: ${appliedJob.status}`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;