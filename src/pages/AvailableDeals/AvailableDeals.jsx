import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeals } from '../../store/useDeals';
import MedicineDealCard from '@/components/MedicineDealCard';
import MedicineDealCardSkeleton from '@/components/MedicineDealCardSkeleton';

export default function AvailableDeals() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dealsPerPage] = useState(9); // Show 9 deals per page (3x3 grid)

  const { deals, fetchDeals, isLoading, error } = useDeals();

  // Fetch deals when component mounts
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Debug logging
  useEffect(() => {
    console.log('Deals from store:', deals);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
  }, [deals, isLoading, error]);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.medicineName.toLowerCase().includes(search.toLowerCase());
    const matchesType = type && type !== 'all' ? deal.dealType === type : true;
    const matchesLocation = location && location !== 'all' ? deal.pharmacy.governorate.toLowerCase() === location.toLowerCase() : true;
    return matchesSearch && matchesType && matchesLocation;
  });

  // Pagination logic
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, location, company]);

  // Helper function to determine status (same as in card component)
  const getStatus = (deal) => {
    if (deal.isClosed) return 'closed';
    if (!deal.isValid) return 'expired';
    return 'active';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Medicine Deals</h1>
      
      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <MedicineDealCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="text-red-800">Error: {error}</div>
        </div>
      )}

      {/* Filters and deals */}
      {!isLoading && (
        <>
          <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <Input
              placeholder="Search by medicine name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="exchange">Exchange</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Cairo">Cairo</SelectItem>
                <SelectItem value="Alexandria">Alexandria</SelectItem>
                <SelectItem value="Giza">Giza</SelectItem>
              </SelectContent>
            </Select>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Drug Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pfizer">Pfizer</SelectItem>
                <SelectItem value="Novartis">Novartis</SelectItem>
              </SelectContent>
            </Select>
            <Button className="lg:ms-auto" variant="outline" onClick={() => { setSearch(''); setType(''); setLocation(''); setCompany(''); }}>
              Reset Filters
            </Button>
          </div>
          
          {/* Deals count */}
          <div className="mb-4 text-gray-600">
            Showing {indexOfFirstDeal + 1}-{Math.min(indexOfLastDeal, filteredDeals.length)} of {filteredDeals.length} deals
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDeals.map(deal => (
              <MedicineDealCard key={deal.id} deal={deal} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
          
          {/* No deals found */}
          {filteredDeals.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">No deals found matching your criteria.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
