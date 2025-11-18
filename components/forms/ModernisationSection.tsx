'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import { HelpCircle } from 'lucide-react';

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
            <NumberInput
              label="Fiktives Baujahr (BMF)"
              value={props.fiktivesBaujahrBMF}
              onChange={(value) => props.onChange('fiktivesBaujahrBMF', value)}
              decimals={0}
              min={1800}
              max={new Date().getFullYear()}
              placeholder="z.B. 2010"
              helpText="Für steuerliche Bewertung nach BMF"
            />

            <NumberInput
              label="Fiktives Baujahr (ImmoWertV)"
              value={props.fiktivesBaujahrImmoWertV}
              onChange={(value) => props.onChange('fiktivesBaujahrImmoWertV', value)}
              decimals={0}
              min={1800}
              max={new Date().getFullYear()}
              placeholder="z.B. 2015"
              helpText="Für Verkehrswertermittlung"
            />
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
            <NumberInput
              label="Liegenschaftszins"
              value={props.liegenschaftszins}
              onChange={(value) => props.onChange('liegenschaftszins', value)}
              unit="%"
              decimals={2}
              min={0}
              max={100}
              placeholder="z.B. 4,5"
              helpText="Kapitalisierungszinssatz für das Ertragswertverfahren"
            />
          </div>
        )}
      </div>

      {/* Restnutzungsdauer */}
      <NumberInput
        label="Restnutzungsdauer"
        value={props.restnutzungsdauer}
        onChange={(value) => props.onChange('restnutzungsdauer', value)}
        unit="Jahre"
        decimals={0}
        min={0}
        max={200}
        placeholder="z.B. 50"
        helpText="Die wirtschaftliche Restnutzungsdauer des Gebäudes"
      />

      {/* Reparatur-/Investitionsbedarf */}
      <NumberInput
        label="Reparatur-/Investitionsbedarf"
        value={props.reparaturInvestitionsbedarf}
        onChange={(value) => props.onChange('reparaturInvestitionsbedarf', value)}
        unit="EUR"
        decimals={0}
        min={0}
        placeholder="z.B. 25.000"
        helpText="Kosten für notwendige Sanierungen oder Modernisierungen"
      />
    </SectionCard>
  );
}
