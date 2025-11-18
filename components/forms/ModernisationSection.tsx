'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';

interface ModernisationSectionProps {
  fiktivesBaujahrBMF?: number;
  fiktivesBaujahrImmoWertV?: number;
  fiktiveBaujahreAktiv: boolean;
  liegenschaftszins?: number;
  liegenschaftszinsAktiv: boolean;
  restnutzungsdauer?: number;
  reparaturInvestitionsbedarf?: number;
  onChange: (field: string, value: any) => void;
}

export default function ModernisationSection(props: ModernisationSectionProps) {
  return (
    <SectionCard
      title="Modernisierung & Wertminderung"
      description="Angaben zur Restnutzungsdauer und Instandhaltung"
    >
      {/* Fiktive Baujahre Toggle */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={props.fiktiveBaujahreAktiv}
            onChange={(e) => props.onChange('fiktiveBaujahreAktiv', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Fiktive Baujahre eingeben (nach Modernisierung)
          </span>
        </label>

        {props.fiktiveBaujahreAktiv && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiktives Baujahr (BMF)
              </label>
              <input
                type="number"
                value={props.fiktivesBaujahrBMF || ''}
                onChange={(e) => props.onChange('fiktivesBaujahrBMF', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="z.B. 2010"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiktives Baujahr (ImmoWertV)
              </label>
              <input
                type="number"
                value={props.fiktivesBaujahrImmoWertV || ''}
                onChange={(e) => props.onChange('fiktivesBaujahrImmoWertV', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="z.B. 2015"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Liegenschaftszins Toggle */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={props.liegenschaftszinsAktiv}
            onChange={(e) => props.onChange('liegenschaftszinsAktiv', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Liegenschaftszins eingeben
          </span>
        </label>

        {props.liegenschaftszinsAktiv && (
          <div className="pl-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liegenschaftszins (%)
            </label>
            <input
              type="number"
              value={props.liegenschaftszins || ''}
              onChange={(e) => props.onChange('liegenschaftszins', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="z.B. 4.5"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Restnutzungsdauer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Restnutzungsdauer (Jahre)
        </label>
        <input
          type="number"
          value={props.restnutzungsdauer || ''}
          onChange={(e) => props.onChange('restnutzungsdauer', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="z.B. 50"
          min="0"
          max="200"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Die wirtschaftliche Restnutzungsdauer des Gebäudes
        </p>
      </div>

      {/* Reparatur-/Investitionsbedarf */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reparatur-/Investitionsbedarf (EUR)
        </label>
        <input
          type="number"
          value={props.reparaturInvestitionsbedarf || ''}
          onChange={(e) => props.onChange('reparaturInvestitionsbedarf', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="z.B. 25000"
          min="0"
          step="1000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Kosten für notwendige Sanierungen oder Modernisierungen
        </p>
      </div>
    </SectionCard>
  );
}
