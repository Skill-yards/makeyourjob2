import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Globe, MapPin, FileText, Edit2, PlusCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filteredCompany, setFilteredCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies?.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilteredCompany(filtered?.[0] || null); // Show the first matching company
  }, [companies, searchCompanyByText]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500 font-semibold';
      case 'inactive':
        return 'text-red-500 font-semibold';
      case 'pending':
        return 'text-yellow-500 font-semibold';
      default:
        return 'text-gray-500 font-semibold';
    }
  };

  return (
    <div className="mt-6">
      {filteredCompany ? (
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-indigo-200">
                <AvatarImage src={filteredCompany.logo} alt={filteredCompany.name} />
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{filteredCompany.name}</h3>
                <p className="text-gray-600 text-sm mt-1 truncate max-w-md">{filteredCompany.description || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <span>{filteredCompany.location || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xl mr-4">Status:</span>
                <span className={getStatusStyles(filteredCompany.status)}>
                  {filteredCompany.status.charAt(0).toUpperCase() + filteredCompany.status.slice(1) || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Globe className="h-5 w-5 text-indigo-500" />
                {filteredCompany.website ? (
                  <a
                    href={filteredCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    {filteredCompany.website}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>Created: {formatDate(filteredCompany.createdAt)}</span>
              <span>Updated: {formatDate(filteredCompany.updatedAt)}</span>
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                onClick={() => navigate(`/admin/companies/${filteredCompany._id}/update`)}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                onClick={() => navigate(`/admin/companies/${filteredCompany._id}`)}
              >
                <FileText className="h-4 w-4" />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">No company found.</p>
          <Button
            onClick={() => navigate('/admin/companies/create')}
            className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 rounded-full px-6 py-2"
          >
            <PlusCircle className="h-5 w-5" />
            Create Company
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;