import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setJobs } from '@/redux/jobSlice';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin, Briefcase, Banknote, Clock, Laptop, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import axios from 'axios';
import {JOB_API_END_POINT} from "@/utils/constant"

const filterData = [
  {
    filterType: "Work Type",
    icon: <Laptop size={16} />,
    array: ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelancing"]
  },
  {
    filterType: "location",
    icon: <MapPin size={16} />,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    icon: <Briefcase size={16} />,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "salary",
    icon: <Banknote size={16} />,
    array: ["0-3Lakhs", "3-6Lakhs", "6-10Lakhs", "10-15Lakhs", "15-25Lakhs", "25-50Lakhs", "50-75Lakhs"]
  },
  {
    filterType: "experienceLevel",
    icon: <Clock size={16} />,
    type: "slider",
    max: 15,
    step: 1,
    unit: "years"
  },
  {
    filterType: "Freshness",
    icon: <Calendar size={16} />,
    array: ["30days", "15days", "7days", "3days", "1days"]
  }
];

const SliderDemo = ({ className, value, onValueChange, ...props }) => {
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      max={15}
      step={1}
      className={cn("w-full", className)}
      {...props}
    />
  );
};

const FilterCard = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const dispatch = useDispatch();
  const { total, pages } = useSelector(state => state.jobs || { jobs: [], total: 0, pages: 1, page: 1, isLoading: false });

  const { jobs, allJobs, searchedQuery } = useSelector((store) => store.job);

  const cityJobCount = allJobs.reduce((acc, job) => {
    const city = job.workLocation?.city || "Unknown";
    if (acc[city]) {
      acc[city]++;
    } else {
      acc[city] = 1;
    }
    return acc;
  }, []);

  // Extract unique cities from allJobs
  useEffect(() => {
    if (allJobs && allJobs.length > 0) {
      const cities = [...new Set(allJobs
        .filter(job => job.workLocation && job.workLocation.city)
        .map(job => job.workLocation.city)
      )];
      setAvailableCities(cities);
    }
  }, [allJobs]);

  // Convert front-end filter values to API-compatible format
  const formatFilters = () => {
    const formatted = { ...selectedValues };

    // Convert Salary (e.g., "3-6Lakhs" to "300000-600000")
    if (formatted.Salary) {
      const range = formatted.Salary.replace('Lakhs', '').split('-').map(Number);
      formatted.Salary = `${range[0]}-${range[1]}`;
    }

    // Convert Freshness (e.g., "7days" to "7")
    if (formatted.Freshness) {
      formatted.Freshness = formatted.Freshness.replace('days', '');
    }

    // Map Industry to jobCategory
    if (formatted.Industry) {
      formatted.industry = formatted.Industry;
      delete formatted.Industry;
    }

    // Map Work Type to jobType
    if (formatted['Work Type']) {
      formatted.jobType = formatted['Work Type'];
      delete formatted['Work Type'];
    }

    return formatted;
  };

  // Fetch jobs from API
  const fetchJobs = async (currentPage = page) => {
    setIsLoading(true);
    try {
      const filters = formatFilters();
      const response = await axios.get(`${JOB_API_END_POINT}/searchCriteria`, {
        params: { ...filters, page: currentPage, limit: 10 }
      });
      console.log('API URL:', `${JOB_API_END_POINT}/searchCriteria`, 'Params:', { ...filters, page: currentPage, limit: 10 });
      dispatch(setJobs({
        jobs: response.data.data,
        total: response.data.total,
        pages: response.data.pages,
        page: response.data.page
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllJobs = async (currentPage = page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/get`, {
        params: { page: currentPage, limit: 10 }
      });
      console.log(response.data,"check data alljobs")
      dispatch(setJobs({
        jobs: response.data.data,
      }));
    } catch (error) {
      console.error('Error fetching all jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleChange = (filterType, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPage(1); // Reset to first page on filter change
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedValues({});
    setPage(1);
  };

  const clearFiltersHandler = () => {
    setSelectedValues({});
    setPage(1);
    dispatch(clearFilters());
    fetchAllJobs(1); // Fetch all jobs when filters are cleared
  };

  // Toggle showing all cities
  const toggleShowAllCities = () => {
    setShowAllCities(!showAllCities);
  };

  // Apply filters and fetch jobs
  const applyFilters = () => {
    fetchJobs(1);
  };

  // Refresh available cities
  const refreshCities = () => {
    if (allJobs && allJobs.length > 0) {
      const cities = [...new Set(allJobs
        .filter(job => job.workLocation && job.workLocation.city)
        .map(job => job.workLocation.city)
      )];
      setAvailableCities(cities);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
      fetchJobs(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchJobs(page - 1);
    }
  };

  // Update Redux query string and fetch jobs on filter change
  useEffect(() => {
    const count = Object.values(selectedValues).filter(Boolean).length;
    setSelectedCount(count);

    const queryString = Object.entries(selectedValues)
      .filter(([_, value]) => value)
      .map(([key, value]) => 
        key === "Experience" ? `${value} ${filterData.find(f => f.filterType === key).unit}` : value
      )
      .join(', ');
    dispatch(setSearchedQuery(queryString));

    // Auto-fetch jobs when filters change
    if (count > 0) {
      fetchJobs();
    } else {
      fetchAllJobs(1);
    }
  }, [selectedValues]);

  return (
    <Card className="w-full shadow-md bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Filter size={18} />
            Filter Jobs
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedCount}
              </Badge>
            )}
          </CardTitle>
          {selectedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFiltersHandler} className="text-xs h-8">
              Clear all
            </Button>
          )}
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" className="w-full">
          {filterData.map((category, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
              <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.filterType}</span>
                  {selectedValues[category.filterType] && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {category.filterType === "experienceLevel" 
                        ? `${selectedValues[category.filterType]} ${category.unit}`
                        : selectedValues[category.filterType]}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {category.type === "slider" ? (
                  <div className="space-y-4 p-2">
                    <SliderDemo
                      value={[parseInt(selectedValues[category.filterType] || "0")]}
                      onValueChange={(value) => handleChange(category.filterType, value[0]?.toString() || "0")}
                      max={category.max}
                      step={category.step}
                    />
                    <div className="text-sm text-gray-600">
                      Selected: {selectedValues[category.filterType] || 0} {category.unit}
                    </div>
                  </div>
                ) : category.filterType === "location" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleShowAllCities}
                        className="text-xs h-8 w-full"
                      >
                        {showAllCities ? "Show Default Cities" : "Show Available Cities"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={refreshCities} 
                        className="text-xs h-8 ml-1"
                        title="Refresh available cities"
                      >
                        <RefreshCw size={14} />
                      </Button>
                    </div>
                    <RadioGroup
                      value={selectedValues[category.filterType] || ""}
                      onValueChange={(value) => handleChange(category.filterType, value)}
                      className="space-y-1"
                    >
                      {(showAllCities ? availableCities : category.array).map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 transition-colors">
                          <RadioGroupItem
                            value={item}
                            id={`${category.filterType}-${idx}`}
                          />
                          <Label
                            htmlFor={`${category.filterType}-${idx}`}
                            className="text-sm font-normal cursor-pointer w-full flex justify-between items-center"
                          >
                            <span>{item}</span>
                            <Badge variant="secondary" className="ml-2">
                              {cityJobCount[item] || 0} {cityJobCount[item] === 1 ? 'job' : 'jobs'}
                            </Badge>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedValues[category.filterType] || ""}
                    onValueChange={(value) => handleChange(category.filterType, value)}
                    className="space-y-1"
                  >
                    {category.array.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 transition-colors">
                        <RadioGroupItem
                          value={item}
                          id={`${category.filterType}-${idx}`}
                        />
                        <Label
                          htmlFor={`${category.filterType}-${idx}`}
                          className="text-sm font-normal cursor-pointer w-full"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-4 space-y-2">
          <Button className="w-full" size="sm" onClick={applyFilters} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </Button>
          {total > 0 && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= pages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;