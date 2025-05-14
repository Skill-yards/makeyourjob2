import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from '@/utils/constant';
import Footer from "./../shared/Footer";
import Layout from "./../../utils/Layout";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, { withCredentials: true });
        setCompany(response.data.company);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch company details');
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-fade-in">
              Company Insights
            </h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Companies</span>
            </button>
          </header>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 transform transition-all duration-500 hover:shadow-2xl">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-lg font-semibold text-center animate-pulse">{error}</p>
            ) : company ? (
              <div className="space-y-10">
                {/* General Information */}
                <section className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-3">General Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{company.name || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                          company.status === "active"
                            ? "bg-green-100 text-green-700"
                            : company.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {company.status || 'N/A'}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Contact Email</p>
                      <p className="text-lg font-semibold text-gray-900">{company.contactEmail || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{company.contactPhone || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-lg text-gray-900">{company.description || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Employee Count</p>
                      <p className="text-lg font-semibold text-gray-900">{company.employeeCount || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Founded Year</p>
                      <p className="text-lg font-semibold text-gray-900">{company.foundedYear || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Industry</p>
                      <p className="text-lg font-semibold text-gray-900">{company.industry || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{company.location || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          {company.website}
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Company Documents */}
                <section className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-3">Company Documents</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">CIN Number</p>
                      <p className="text-lg font-semibold text-gray-900">{company.cinNumber || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">GST Number</p>
                      <p className="text-lg font-semibold text-gray-900">{company.gstNumber || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">PAN Number</p>
                      <p className="text-lg font-semibold text-gray-900">{company.panNumber || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">CIN Document</p>
                      {company.cinDocument ? (
                        <a
                          href={company.cinDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">GST Document</p>
                      {company.gstDocument ? (
                        <a
                          href={company.gstDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">PAN Document</p>
                      {company.panDocument ? (
                        <a
                          href={company.panDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Registration Document</p>
                      {company.registrationDocument ? (
                        <a
                          href={company.registrationDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          View Document
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Logo</p>
                      {company.logo ? (
                        <a
                          href={company.logo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold"
                        >
                          View Logo
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Metadata */}
                <section className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-3">Metadata</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Created At</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(company.createdAt).toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
                      <p className="text-sm font-medium text-gray-500">Updated At</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(company.updatedAt).toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <p className="text-gray-600 text-lg text-center animate-fade-in">No company data available.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
};

// Custom animations for smooth transitions


export default CompanyDetails;