'use client';

import React from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import SectionCard from '../common/SectionCard';
import type { BorisResult } from '@/lib/types';

interface LandSectionProps {
  bodenrichtwert?: number;
  grundstuecksflaeche?: number;
  borisResult?: BorisResult | null;
  isLoadingBoris: boolean;
  onChange: (field: string, value: any) => void;
  onBorisResearch: () => void;
}

export default function LandSection(props: LandSectionProps) {
  return (
    <SectionCard
      title="Grundstück & Bodenwert"
      description="Angaben zum Grundstück und Bodenrichtwert"
    >
      {/* Grundstücksfläche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grundstücksfläche (m²)
        </label>
        <input
          type="number"
          value={props.grundstuecksflaeche || ''}
          onChange={(e) => props.onChange('grundstuecksflaeche', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="z.B. 500"
          min="0"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Bodenrichtwert */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bodenrichtwert (EUR/m²)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={props.bodenrichtwert || ''}
            onChange={(e) => props.onChange('bodenrichtwert', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="z.B. 350"
            min="0"
            step="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={props.onBorisResearch}
            disabled={props.isLoadingBoris}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {props.isLoadingBoris ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Recherchiert...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">BORIS</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Nutzen Sie die BORIS-Recherche, um den aktuellen Bodenrichtwert automatisch zu ermitteln
        </p>
      </div>

      {/* BORIS Result Display */}
      {props.borisResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-semibold text-green-900">
                BORIS-Recherche erfolgreich
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>
                  <span className="font-medium">Bodenrichtwert:</span>{' '}
                  {props.borisResult.bodenrichtwert.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  EUR/m²
                </p>
                <p>
                  <span className="font-medium">Quelle:</span> {props.borisResult.quelle}
                </p>
                <p>
                  <span className="font-medium">Region:</span> {props.borisResult.region}
                </p>
                {props.borisResult.hinweise && (
                  <p className="text-xs mt-2 pt-2 border-t border-green-300">
                    <span className="font-medium">Hinweise:</span> {props.borisResult.hinweise}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
