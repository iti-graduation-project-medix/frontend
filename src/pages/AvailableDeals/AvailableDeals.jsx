import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const mockDeals = [
  {
    id: 1,
    name: 'Amoxicillin 500mg Capsules',
    type: 'Sell',
    quantity: 150,
    expires: '11/1/2025',
    minPrice: 'EGP18.75',
    description: 'Bulk sale of high-quality Amoxicillin.',
    pharmacy: 'City Pharmacy Central',
    location: 'Cairo',
    status: 'active',
    verified: true,
    pharmacyAvatar: '/public/avatars/client1.webp',
  },
  {
    id: 2,
    name: 'Lisinopril 10mg Tablets',
    type: 'Sell',
    quantity: 90,
    expires: '8/15/2024',
    minPrice: 'EGP9.50',
    description: 'Excess stock of Lisinopril.',
    pharmacy: 'Health Hub Dispensary',
    location: 'Alexandria',
    status: 'expired',
    verified: true,
    pharmacyAvatar: '/public/avatars/client2.webp',
    soon: true,
  },
  {
    id: 3,
    name: 'Metformin 850mg',
    type: 'Exchange',
    quantity: 200,
    expires: '5/20/2025',
    minPrice: 'EGP0.00',
    description: 'Looking to exchange for Atorvastatin.',
    pharmacy: 'Village Drug Store',
    location: 'Giza',
    status: 'closed',
    verified: false,
    pharmacyAvatar: '/public/avatars/client3.webp',
  },
  {
    id: 4,
    name: 'Ibuprofen 400mg Tablets',
    type: 'Both',
    quantity: 300,
    expires: '12/31/2024',
    minPrice: 'EGP12.00',
    description: 'Available for sale or exchange with other pain medications.',
    pharmacy: 'Community Pharmacy',
    location: 'Cairo',
    status: 'active',
    verified: true,
    pharmacyAvatar: '/public/avatars/client4.webp',
  },
];

function MedicineDealCard({ deal }) {
    const navigate = useNavigate()

  const handleViewDetails = (dealId) => {
    navigate(`/all-deals/${dealId}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header with badge */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 leading-tight pr-2">{deal.name}</h2>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={`${
              deal.type === 'Sell' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : deal.type === 'Exchange' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            } border font-medium`}>
              {deal.type}
            </Badge>
            <Badge className={`${
              deal.status === 'active' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : deal.status === 'closed' 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-orange-50 text-orange-700 border-orange-200'
            } border font-medium text-xs`}>
              {deal.status}
            </Badge>
          </div>
        </div>

        {/* Deal info with icons */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Package size={16} className="mr-2 text-gray-400" />
            <span className="font-medium">Quantity:</span>
            <span className="ml-1 text-gray-900">{deal.quantity}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span className="font-medium">Expires:</span>
            <span className="ml-1 text-gray-900">{deal.expires}</span>
            {deal.soon && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                Soon
              </span>
            )}
          </div>
          {(deal.type === 'Sell' || deal.type === 'Both') && (
            <div className="flex items-center text-gray-600 text-sm">
              <Tag size={16} className="mr-2 text-gray-400" />
              <span className="font-medium">Price:</span>
              <span className="ml-1 text-gray-900 font-semibold">{deal.minPrice}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="text-gray-700 text-sm mb-4 flex-1 leading-relaxed">
          {deal.description}
        </div>

        {/* Pharmacy info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="relative">
            <img 
              src={deal.pharmacyAvatar} 
              alt="avatar" 
              className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover" 
            />
            {deal.verified && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 block">{deal.pharmacy}</span>
            <span className="text-xs text-gray-500">{deal.location}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="p-6 pt-0">
        <Button 
          className="w-full transition-colors duration-200" 
          variant="outline"
          onClick={() => handleViewDetails(deal.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default function AvailableDeals() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');

  const filteredDeals = mockDeals.filter(deal =>
    deal.name.toLowerCase().includes(search.toLowerCase()) &&
    (type && type !== 'all' ? deal.type === type : true) &&
    (location && location !== 'all' ? deal.location === location : true) &&
    (status && status !== 'all' ? deal.status === status : true)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Medicine Deals</h1>
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
            <SelectItem value="Sell">Sell</SelectItem>
            <SelectItem value="Exchange">Exchange</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
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
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button className="lg:ms-auto" variant="outline" onClick={() => { setSearch(''); setType(''); setLocation(''); setCompany(''); setStatus(''); }}>
          Reset Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map(deal => (
          <MedicineDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
