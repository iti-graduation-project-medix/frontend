import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package } from 'lucide-react';

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
    verified: false,
    pharmacyAvatar: '/public/avatars/client3.webp',
  },
];

function MedicineDealCard({ deal }) {
  return (
    <div className="bg-white rounded-xl border shadow flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg text-gray-900">{deal.name}</h2>
          <Badge className={deal.type === 'Sell' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
            {deal.type}
          </Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm gap-4 mb-2">
          <span className="flex items-center gap-1"><Package size={16}/> Qty: {deal.quantity}</span>
          <span className="flex items-center gap-1"><Calendar size={16}/> Exp: {deal.expires}</span>
          {deal.soon && <span className="ml-2 text-xs text-orange-500 font-semibold">Soon</span>}
        </div>
        {deal.type === 'Sell' && (
          <div className="mb-2">
            <span className="text-blue-600 text-sm font-semibold">Min Price: {deal.minPrice}</span>
          </div>
        )}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 font-medium">
            {deal.type === 'Sell' ? 'Sell' : 'Exchange'}
          </span>
        </div>
        <div className="text-gray-700 text-sm mb-4 flex-1">
          {deal.description}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <img src={deal.pharmacyAvatar} alt="avatar" className="w-7 h-7 rounded-full border" />
          <span className="text-sm font-medium text-gray-900">{deal.pharmacy}</span>
          {deal.verified && <span className="ml-1 text-xs text-green-600 font-semibold">Verified</span>}
        </div>
      </div>
      <div className="p-4 pt-0">
        <Button className="w-full" variant="outline">View Details</Button>
      </div>
    </div>
  );
}

export default function AvailableDeals() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');

  const filteredDeals = mockDeals.filter(deal =>
    deal.name.toLowerCase().includes(search.toLowerCase()) &&
    (type ? deal.type === type : true)
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
            <SelectItem value="Sell">Sell</SelectItem>
            <SelectItem value="Exchange">Exchange</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cairo">Cairo</SelectItem>
            <SelectItem value="Alexandria">Alexandria</SelectItem>
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
        <Button variant="outline" onClick={() => { setSearch(''); setType(''); setLocation(''); setCompany(''); }}>
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
