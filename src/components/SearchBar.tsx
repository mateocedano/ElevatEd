import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-80 mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#6B7280]" />
      </div>
      <input
        type="text"
        placeholder="What are you looking for?"
        className="w-full pl-10 pr-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] focus:border-transparent bg-white shadow-sm"
      />
    </div>
  );
}