'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';

interface ProcedureTogglesProps {
  useErtragswertverfahren: boolean;
  useUmgekehrtesErtragswertverfahren: boolean;
  useVergleichswertverfahren: boolean;
  onChange: (field: string, value: boolean) => void;
}

export default function ProcedureToggles(props: ProcedureTogglesProps) {
  return (
    <SectionCard
      title="Bewertungsverfahren"
      description="Wählen Sie die durchzuführenden Verfahren aus"
    >
      <div className="space-y-3">
        {/* Ertragswertverfahren */}
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={props.useErtragswertverfahren}
            onChange={(e) => props.onChange('useErtragswertverfahren', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-900">
              Ertragswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1">
              Berechnung des Immobilienwerts basierend auf erzielbaren Erträgen (§§ 17-20 ImmoWertV)
            </span>
          </div>
        </label>

        {/* Umgekehrtes Ertragswertverfahren */}
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={props.useUmgekehrtesErtragswertverfahren}
            onChange={(e) => props.onChange('useUmgekehrtesErtragswertverfahren', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-900">
              Umgekehrtes Ertragswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1">
              Rückrechnung des Bodenwerts aus dem Verkehrswert (benötigt Verkehrswert-Eingabe)
            </span>
          </div>
        </label>

        {/* Vergleichswertverfahren */}
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={props.useVergleichswertverfahren}
            onChange={(e) => props.onChange('useVergleichswertverfahren', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-900">
              Vergleichswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1">
              Bewertung durch Vergleich mit ähnlichen Objekten (§§ 13-16 ImmoWertV, nur mit ausreichend Vergleichsdaten durchführbar)
            </span>
          </div>
        </label>
      </div>
    </SectionCard>
  );
}
