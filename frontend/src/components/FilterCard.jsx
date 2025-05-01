import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setJobs } from '@/redux/jobSlice';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin, Briefcase, Banknote, Clock, Laptop, Calendar } from 'lucide-react';
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
    filterType: "Location",
    icon: <MapPin size={16} />,
    array: ["Noida (694)", "New Delhi (15)", "Greater Noida (32)", "Ghaziabad (4)", "Gurugram (25)", "Delhi / NCR (703)", "Pune (19)", "Bengaluru (14)", "Mumbai (6)", "Kanpur (6)"],
    moreArray: ["Rajkot (6)", "Mumbai (All Areas) (6)", "Chennai (5)", "Supaul (5)", "Patna (5)", "Hyderabad (4)", "Coimbatore (4)", "Prayagraj (4)", "Gwalior (3)", "Jaipur (3)", "Lucknow (1)", "Indore (2)", "Guwahati (1)", "Ahmedabad (1)", "Kozhikode (1)","Agra(3)"]
  },
  {
    filterType: "Industry",
    icon: <Briefcase size={16} />,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    icon: <Banknote size={16} />,
    array: ["0-3Lakhs", "3-6Lakhs", "6-10Lakhs", "10-15Lakhs", "15-25Lakhs", "25-50Lakhs", "50-75Lakhs"]
  },
  {
    filterType: "Experience",
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
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const dispatch = useDispatch();
  const { total, pages } = useSelector(state => state.jobs || { jobs: [], total: 0, pages: 1, page: 1, isLoading: false });

  const formatFilters = () => {
    const formatted = { ...selectedValues };
    if (formatted.Salary) {
      const range = formatted.Salary.replace('Lakhs', '').split('-').map(Number);
      formatted.Salary = `${range[0]}-${range[1]}`;
    }
    if (formatted.Freshness) {
      formatted.Freshness = formatted.Freshness.replace('days', '');
    }
    if (formatted.Industry) {
      formatted.industry = formatted.Industry;
      delete formatted.Industry;
    }
    if (formatted['Work Type']) {
      formatted.jobType = formatted['Work Type'];
      delete formatted['Work Type'];
    }
    return formatted;
  };

  const fetchJobs = async (currentPage = page) => {
    setIsLoading(true);
    try {
      const filters = formatFilters();
      const response = await axios.get(`${JOB_API_END_POINT}/searchCriteria`, {
        params: { ...filters, page: currentPage, limit: 10 }
      });
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
    dispatch(setLoading());
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/get`, {
        params: { page: currentPage, limit: 10 }
      });
      dispatch(setJobs({
        jobs: response.data.data,
      }));
    } catch (error) {
      console.error('Error fetching all jobs:', error);
    }
  };

  const handleChange = (filterType, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedValues({});
    setPage(1);
  };

  const clearFiltersHandler = () => {
    setSelectedValues({});
    setPage(1);
    dispatch(clearFilters());
    fetchAllJobs(1);
  };

  const applyFilters = () => {
    fetchJobs(1);
  };

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

  const toggleShowMoreLocations = () => {
    setShowMoreLocations(!showMoreLocations);
  };

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
                      {category.filterType === "Experience" 
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
                    {category.filterType === "Location" && (
                      <div className="p-2">
                        <Button variant="link" size="sm" onClick={toggleShowMoreLocations} className="p-0 h-auto text-blue-600">
                          View More
                        </Button>
                        {showMoreLocations && (
                          <Card className="mt-2 p-2 bg-white shadow-md">
                            <CardContent className="p-0">
                              <RadioGroup
                                value={selectedValues[category.filterType] || ""}
                                onValueChange={(value) => handleChange(category.filterType, value)}
                                className="space-y-1"
                              >
                                {category.moreArray.map((item, idx) => (
                                  <div key={idx + category.array.length} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 transition-colors">
                                    <RadioGroupItem
                                      value={item}
                                      id={`${category.filterType}-${idx + category.array.length}`}
                                    />
                                    <Label
                                      htmlFor={`${category.filterType}-${idx + category.array.length}`}
                                      className="text-sm font-normal cursor-pointer w-full"
                                    >
                                      {item}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
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