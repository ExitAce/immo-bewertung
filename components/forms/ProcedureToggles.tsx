'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';
import { Check } from 'lucide-react';

interface ProcedureTogglesProps {
  useErtragswertverfahren: boolean;
  useUmgekehrtesErtragswertverfahren: boolean;
  useVergleichswertverfahren: boolean;
  onChange: (field: string, value: boolean) => void;
}

export default function ProcedureToggles(props: ProcedureTogglesProps) {
  const hasAtLeastOne = props.useErtragswertverfahren ||
                        props.useUmgekehrtesErtragswertverfahren ||
                        props.useVergleichswertverfahren;

  return (
    <SectionCard
      title="Bewertungsverfahren"
      description="Wählen Sie mindestens ein Verfahren aus"
    >
      <div className="space-y-3">
        {!hasAtLeastOne && (
          <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Erforderlich:</span> Bitte wählen Sie mindestens ein Bewertungsverfahren aus.
            </p>
          </div>
        )}

        {/* Ertragswertverfahren */}
        <button
          type="button"
          onClick={() => props.onChange('useErtragswertverfahren', !props.useErtragswertverfahren)}
          className={`
            w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all text-left
            ${props.useErtragswertverfahren
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }
          `}
        >
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
            ${props.useErtragswertverfahren
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 bg-white'
            }
          `}>
            {props.useErtragswertverfahren && <Check className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1">
            <span className={`block text-sm font-semibold ${props.useErtragswertverfahren ? 'text-blue-900' : 'text-gray-900'}`}>
              Ertragswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1.5 leading-relaxed">
              Bewertet anhand erzielbarer Mieterträge. Ideal für vermietete Objekte (§§ 17-20 ImmoWertV).
            </span>
          </div>
        </button>

        {/* Umgekehrtes Ertragswertverfahren */}
        <button
          type="button"
          onClick={() => props.onChange('useUmgekehrtesErtragswertverfahren', !props.useUmgekehrtesErtragswertverfahren)}
          className={`
            w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all text-left
            ${props.useUmgekehrtesErtragswertverfahren
              ? 'border-green-500 bg-green-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }
          `}
        >
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
            ${props.useUmgekehrtesErtragswertverfahren
              ? 'border-green-500 bg-green-500'
              : 'border-gray-300 bg-white'
            }
          `}>
            {props.useUmgekehrtesErtragswertverfahren && <Check className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1">
            <span className={`block text-sm font-semibold ${props.useUmgekehrtesErtragswertverfahren ? 'text-green-900' : 'text-gray-900'}`}>
              Umgekehrtes Ertragswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1.5 leading-relaxed">
              Berechnet Bodenwert aus Kaufpreis durch Rückrechnung. Nützlich zur Plausibilitätsprüfung.
            </span>
          </div>
        </button>

        {/* Vergleichswertverfahren */}
        <button
          type="button"
          onClick={() => props.onChange('useVergleichswertverfahren', !props.useVergleichswertverfahren)}
          className={`
            w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all text-left
            ${props.useVergleichswertverfahren
              ? 'border-purple-500 bg-purple-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }
          `}
        >
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
            ${props.useVergleichswertverfahren
              ? 'border-purple-500 bg-purple-500'
              : 'border-gray-300 bg-white'
            }
          `}>
            {props.useVergleichswertverfahren && <Check className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1">
            <span className={`block text-sm font-semibold ${props.useVergleichswertverfahren ? 'text-purple-900' : 'text-gray-900'}`}>
              Vergleichswertverfahren
            </span>
            <span className="block text-xs text-gray-600 mt-1.5 leading-relaxed">
              Vergleicht mit ähnlichen verkauften Objekten (§§ 13-16 ImmoWertV). Benötigt Vergleichsdaten.
            </span>
          </div>
        </button>
      </div>
    </SectionCard>
  );
}
