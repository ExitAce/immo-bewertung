'use client';

import React from 'react';
import SectionCard from '../common/SectionCard';
import { BUILDING_CLASSES, BuildingClass } from '@/lib/types';

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
      {/* Building Class */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gebäudeklasse
        </label>
        <select
          value={props.buildingClass}
          onChange={(e) => props.onChange('buildingClass', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Bitte wählen...</option>
          {BUILDING_CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      {/* Kaufpreis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kaufpreis ohne Nebenkosten (EUR)
        </label>
        <input
          type="number"
          value={props.kaufpreisOhneNebenkosten || ''}
          onChange={(e) => props.onChange('kaufpreisOhneNebenkosten', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="z.B. 450000"
          min="0"
          step="1000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Verkehrswert Toggle */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={props.verkehrswertAktiv}
            onChange={(e) => props.onChange('verkehrswertAktiv', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Verkehrswert eingeben (für umgekehrtes Ertragswertverfahren)
          </span>
        </label>

        {props.verkehrswertAktiv && (
          <input
            type="number"
            value={props.verkehrswert || ''}
            onChange={(e) => props.onChange('verkehrswert', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="z.B. 500000"
            min="0"
            step="1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>

      {/* Nebenkosten */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nebenkosten gesamt (EUR)
        </label>
        <input
          type="number"
          value={props.nebenkostenGesamt || ''}
          onChange={(e) => props.onChange('nebenkostenGesamt', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="z.B. 45000"
          min="0"
          step="1000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Kaufvertrag Datum */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Datum Kaufvertrag
        </label>
        <input
          type="date"
          value={props.datumKaufvertrag || ''}
          onChange={(e) => props.onChange('datumKaufvertrag', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Baujahr */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ursprüngliches Baujahr
        </label>
        <input
          type="number"
          value={props.urspruenglichesBaujahr || ''}
          onChange={(e) => props.onChange('urspruenglichesBaujahr', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="z.B. 1985"
          min="1800"
          max={new Date().getFullYear()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Miteigentumsanteil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Miteigentumsanteil (z.B. 1/4)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={props.miteigentumsanteilZaehler || ''}
            onChange={(e) => props.onChange('miteigentumsanteilZaehler', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Zähler (z.B. 1)"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            value={props.miteigentumsanteilNenner || ''}
            onChange={(e) => props.onChange('miteigentumsanteilNenner', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Nenner (z.B. 4)"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </SectionCard>
  );
}
