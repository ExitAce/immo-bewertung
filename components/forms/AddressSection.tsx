'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import SectionCard from '../common/SectionCard';
import type { AddressInput, NominatimResult } from '@/lib/types';

interface AddressSectionProps {
  address: AddressInput;
  onChange: (address: AddressInput) => void;
}

export default function AddressSection({ address, onChange }: AddressSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const searchNominatim = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)},Deutschland&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5`,
        {
          headers: {
            'Accept-Language': 'de',
          },
        }
      );

      if (response.ok) {
        const results: NominatimResult[] = await response.json();
        setSuggestions(results);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Nominatim search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchNominatim(value);
    }, 500);
  };

  // Handle suggestion click
  const handleSuggestionClick = (result: NominatimResult) => {
    const newAddress: AddressInput = {
      strasse: result.address.road || '',
      hausnummer: result.address.house_number || '',
      plz: result.address.postcode || '',
      ort: result.address.city || result.address.town || result.address.village || '',
    };

    onChange(newAddress);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SectionCard
      title="Adresse"
      description="Geben Sie die Adresse der zu bewertenden Immobilie ein"
    >
      {/* Address Search */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse suchen (optional)
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="z.B. Hauptstraße 1, 60311 Frankfurt"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleSuggestionClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start space-x-2"
              >
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-900">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Attribution */}
        <p className="text-xs text-gray-500 mt-1">
          Powered by OpenStreetMap Nominatim
        </p>
      </div>

      {/* Manual Address Input */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Straße <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.strasse}
            onChange={(e) => onChange({ ...address, strasse: e.target.value })}
            placeholder="z.B. Hauptstraße"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hausnummer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.hausnummer}
            onChange={(e) => onChange({ ...address, hausnummer: e.target.value })}
            placeholder="z.B. 1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PLZ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.plz}
            onChange={(e) => onChange({ ...address, plz: e.target.value })}
            placeholder="z.B. 60311"
            maxLength={5}
            pattern="\d{5}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ort <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.ort}
            onChange={(e) => onChange({ ...address, ort: e.target.value })}
            placeholder="z.B. Frankfurt am Main"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </SectionCard>
  );
}
