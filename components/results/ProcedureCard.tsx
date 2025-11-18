'use client';

import React from 'react';
import { CheckCircle, XCircle, FileDown } from 'lucide-react';
import type { ProcedureResult, ProcedureKey } from '@/lib/types';
import { formatCurrency, PROCEDURE_NAMES } from '@/lib/types';

interface ProcedureCardProps {
  procedureKey: ProcedureKey;
  result: ProcedureResult;
  onGeneratePdf: () => void;
}

export default function ProcedureCard({ procedureKey, result, onGeneratePdf }: ProcedureCardProps) {
  const procedureName = PROCEDURE_NAMES[procedureKey];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {result.durchfuehrbar ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{procedureName}</h3>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                result.durchfuehrbar
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {result.durchfuehrbar ? 'Durchführbar' : 'Nicht durchführbar'}
            </span>
          </div>
        </div>

        {/* PDF Button */}
        {result.durchfuehrbar && (
          <button
            onClick={onGeneratePdf}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2 transition-colors text-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
        )}
      </div>

      {/* Not Feasible - Show Hint */}
      {!result.durchfuehrbar && result.hinweis && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">{result.hinweis}</p>
        </div>
      )}

      {/* Feasible - Show Calculation Steps and Result */}
      {result.durchfuehrbar && (
        <>
          {/* Rechenweg (Calculation Steps) */}
          {result.rechenweg && result.rechenweg.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Rechenweg:</h4>
              <ol className="space-y-2">
                {result.rechenweg.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Result */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-700 mb-1">Ergebnis:</div>
            <div className="text-3xl font-bold text-blue-900">
              {result.ergebnis !== null ? (
                <>
                  {result.einheit === 'EUR/m²' ? (
                    <>
                      {result.ergebnis.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      {result.einheit}
                    </>
                  ) : (
                    formatCurrency(result.ergebnis)
                  )}
                </>
              ) : (
                'N/A'
              )}
            </div>
            {result.hinweis && (
              <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-300">
                {result.hinweis}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
