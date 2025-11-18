'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ValuationResult } from '@/lib/types';
import { formatCurrency } from '@/lib/types';

interface ResultsSummaryProps {
  results: ValuationResult;
}

export default function ResultsSummary({ results }: ResultsSummaryProps) {
  // Collect all feasible EUR values (exclude EUR/m² results)
  const feasibleValues: number[] = [];

  if (results.ertragswertverfahren.durchfuehrbar &&
      results.ertragswertverfahren.ergebnis !== null &&
      results.ertragswertverfahren.einheit === 'EUR') {
    feasibleValues.push(results.ertragswertverfahren.ergebnis);
  }

  if (results.vergleichswertverfahren.durchfuehrbar &&
      results.vergleichswertverfahren.ergebnis !== null &&
      results.vergleichswertverfahren.einheit === 'EUR') {
    feasibleValues.push(results.vergleichswertverfahren.ergebnis);
  }

  // Don't include umgekehrtes Ertragswertverfahren if it's EUR/m²
  // (it calculates Bodenwert, not total property value)

  if (feasibleValues.length === 0) {
    return null;
  }

  const minValue = Math.min(...feasibleValues);
  const maxValue = Math.max(...feasibleValues);
  const meanValue = feasibleValues.reduce((a, b) => a + b, 0) / feasibleValues.length;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Bewertungsergebnis - Zusammenfassung</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Minimum */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Mindestwert</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(minValue)}</div>
        </div>

        {/* Mean */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-white/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium">Mittelwert</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(meanValue)}</div>
        </div>

        {/* Maximum */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Höchstwert</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(maxValue)}</div>
        </div>
      </div>

      {/* Value Range */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Empfohlener Korridor:</h4>
        <p className="text-lg">
          {formatCurrency(minValue)} - {formatCurrency(maxValue)}
        </p>
        <p className="text-xs mt-2 opacity-90">
          Basierend auf {feasibleValues.length} durchgeführte{feasibleValues.length === 1 ? 'm' : 'n'} Bewertungsverfahren
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs opacity-80">
          Diese Zusammenfassung dient nur zur Orientierung. Für eine rechtlich verbindliche
          Bewertung konsultieren Sie bitte einen zertifizierten Sachverständigen.
        </p>
      </div>
    </div>
  );
}
