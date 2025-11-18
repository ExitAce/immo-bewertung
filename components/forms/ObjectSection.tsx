'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import { BUILDING_CLASSES, BuildingClass } from '@/lib/types';
import { HelpCircle } from 'lucide-react';

interface ObjectSectionProps {
  buildingClass: BuildingClass | '';
  kaufpreisOhneNebenkosten?: number;
  verkehrswert?: number;
  verkehrswertAktiv: boolean;
  nebenkostenGesamt?: number;
  datumKaufvertrag?: string;
  urspruenglichesBaujahr?: number;
  miteigentumsanteilZaehler?: number;
  miteigentumsanteilNenner?: number;
  onChange: (field: string, value: any) => void;
}

export default function ObjectSection(props: ObjectSectionProps) {
  return (
    <SectionCard
      title="Objektdaten"
      description="Grundlegende Informationen zur Immobilie"
    >
      <div className="space-y-6">
        {/* Building Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gebäudeklasse
            <span className="ml-2 text-xs text-gray-500">(empfohlen)</span>
          </label>
          <select
            value={props.buildingClass}
            onChange={(e) => props.onChange('buildingClass', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-colors"
          >
            <option value="">Bitte wählen...</option>
            {BUILDING_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-gray-500">
            Die Gebäudeklasse beeinflusst die Bewertung und hilft bei der Ermittlung des Bodenrichtwerts.
          </p>
        </div>

        {/* Kaufpreis */}
        <NumberInput
          label="Kaufpreis ohne Nebenkosten"
          value={props.kaufpreisOhneNebenkosten}
          onChange={(value) => props.onChange('kaufpreisOhneNebenkosten', value)}
          unit="EUR"
          decimals={2}
          placeholder="z.B. 450.000"
          helpText="Der reine Kaufpreis ohne Notar-, Makler- und Grunderwerbsteuerkosten"
        />

        {/* Nebenkosten */}
        <NumberInput
          label="Nebenkosten gesamt"
          value={props.nebenkostenGesamt}
          onChange={(value) => props.onChange('nebenkostenGesamt', value)}
          unit="EUR"
          decimals={2}
          placeholder="z.B. 45.000"
          helpText="Notar, Makler, Grunderwerbsteuer (optional)"
        />

        {/* Kaufvertragsdatum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datum des Kaufvertrags
          </label>
          <input
            type="date"
            value={props.datumKaufvertrag || ''}
            onChange={(e) => props.onChange('datumKaufvertrag', e.target.value || undefined)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Wichtig für steuerliche Berechnungen und zeitliche Einordnung
          </p>
        </div>

        {/* Ursprüngliches Baujahr */}
        <NumberInput
          label="Ursprüngliches Baujahr"
          value={props.urspruenglichesBaujahr}
          onChange={(value) => props.onChange('urspruenglichesBaujahr', value)}
          decimals={0}
          min={1800}
          max={new Date().getFullYear()}
          placeholder="z.B. 1985"
          helpText="Das Jahr, in dem das Gebäude ursprünglich errichtet wurde"
        />

        {/* Verkehrswert Section */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-start space-x-3 mb-4">
            <input
              type="checkbox"
              checked={props.verkehrswertAktiv}
              onChange={(e) => props.onChange('verkehrswertAktiv', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">
                Verkehrswert separat eingeben
              </span>
              <p className="text-xs text-gray-600 mt-1">
                Aktivieren Sie diese Option für das umgekehrte Ertragswertverfahren oder wenn Sie bereits einen Verkehrswert haben.
              </p>
            </div>
          </label>

          {props.verkehrswertAktiv && (
            <div className="ml-7 pl-4 border-l-2 border-blue-200 space-y-4">
              <NumberInput
                label="Verkehrswert"
                value={props.verkehrswert}
                onChange={(value) => props.onChange('verkehrswert', value)}
                unit="EUR"
                decimals={2}
                placeholder="z.B. 500.000"
                helpText="Der geschätzte oder ermittelte Verkehrswert der Immobilie"
                required={props.verkehrswertAktiv}
              />
            </div>
          )}
        </div>

        {/* Miteigentumsanteil Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2 mb-3">
            <h3 className="text-sm font-medium text-gray-900">Miteigentumsanteil</h3>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                Nur für Eigentumswohnungen relevant. Gibt an, welcher Bruchteil des Grundstücks zur Wohnung gehört (z.B. 15/1000).
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="Zähler"
              value={props.miteigentumsanteilZaehler}
              onChange={(value) => props.onChange('miteigentumsanteilZaehler', value)}
              decimals={0}
              min={1}
              placeholder="15"
            />
            <NumberInput
              label="Nenner"
              value={props.miteigentumsanteilNenner}
              onChange={(value) => props.onChange('miteigentumsanteilNenner', value)}
              decimals={0}
              min={1}
              placeholder="1000"
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Beispiel: 15/1000 bedeutet 1,5% des Grundstücks
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
