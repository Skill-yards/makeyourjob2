import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin, Briefcase, Banknote, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const filterData = [
  {
    filterType: "Location",
    icon: <MapPin size={16} />,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    icon: <Briefcase size={16} />,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    icon: <Banknote size={16} />,
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
];

const FilterCard = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const dispatch = useDispatch();

  const handleChange = (filterType, value) => {
    setSelectedValues(prev => {
      const newValues = { ...prev, [filterType]: value };
      return newValues;
    });
  };

  const clearFilters = () => {
    setSelectedValues({});
  };

  useEffect(() => {
    // Count active filters
    const count = Object.keys(selectedValues).length;
    setSelectedCount(count);
    
    // Combine all selected values into one query string
    const queryString = Object.values(selectedValues).join(', ');
    dispatch(setSearchedQuery(queryString));
  }, [selectedValues, dispatch]);

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
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
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
                      {selectedValues[category.filterType]}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-4 md:hidden">
          <Button className="w-full" size="sm">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;