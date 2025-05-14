import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../shared/Footer";
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useSelector } from "react-redux";

const adminNavBar = [
  '👤 Profile',
  '➕ Add Job',
  '📋 Manage Jobs',
  '📄 Applications'
];

const AdminDashboard = () => {
  const applicationsIndex = adminNavBar.findIndex(item => item.includes('Applications'));
  const { user } = useSelector((store) => store.auth);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(companyData,"check details")

  // Fetch all companies
  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${COMPANY_API_END_POINT}/getAllCompany`, { withCredentials: true });
      console.log(response.data ,"check company details")
      setCompanyData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch company data');
      setLoading(false);
    }
  };

  // Fetch company data when component mounts
  useEffect(() => {
    fetchCompanyData();
  }, [user._id]);

  // Handle Approve action
  const handleApprove = async (companyId) => {
    try {
      await axios.put(
        `${COMPANY_API_END_POINT}/update/${companyId}`,
        { status: 'active' },
        { withCredentials: true }
      );
      await fetchCompanyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve company');
    }
  };

  // Handle Reject action
  const handleReject = async (companyId) => {
    try {
      await axios.put(
        `${COMPANY_API_END_POINT}/update/${companyId}`,
        { status: 'rejected' },
        { withCredentials: true }
      );
      await fetchCompanyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject company');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-lg transition-all duration-300">
          <div className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">Admin</span>
          </div>
          <nav className="mt-2">
            {adminNavBar.map((item, index) => {
              const [emoji, label] = item.split(' ');
              const isActive = index === applicationsIndex;
              return (
                <a
                  key={label}
                  href="#"
                  className={`flex items-center py-3 px-6 mx-2 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white font-semibold shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <span className="mr-3 text-lg">{emoji}</span>
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Manage Companies
            </h1>
          </header>

          {/* Company Section */}
          <div className="mb-8 bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Company Details</h2>
            {loading ? (
              <p className="text-gray-600">Loading company data...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div>
                {companyData?.companies?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          <th className="py-3 sm:py-4 px-4 sm:px-6 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">#</th>
                          <th className="py-3 sm:py-4 px-4 sm:px-6 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">Company</th>
                          <th className="py-3 sm:py-4 px-4 sm:px-6 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">Status</th>
                          <th className="py-3 sm:py-4 px-4 sm:px-6 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyData.companies.map((company, index) => (
                          <tr key={company._id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-700">{index + 1}</td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6">
                              <Link
                                to={`/admin/companies/${company._id}/details`}
                                className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
                              >
                                {company.name}
                              </Link>
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                  company.status === "active"
                                    ? "bg-green-100 text-green-600"
                                    : company.status === "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {company.status}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                              <button
                                onClick={() => handleApprove(company._id)}
                                className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={company.status === "active"}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(company._id)}
                                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={company.status === "rejected"}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No companies found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;