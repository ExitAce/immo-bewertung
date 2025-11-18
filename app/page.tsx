'use client';

import React, { useState } from 'react';
import { Calculator, History, AlertCircle } from 'lucide-react';
import AddressSection from '@/components/forms/AddressSection';
import ObjectSection from '@/components/forms/ObjectSection';
import ModernisationSection from '@/components/forms/ModernisationSection';
import LandSection from '@/components/forms/LandSection';
import ProcedureToggles from '@/components/forms/ProcedureToggles';
import ProcedureCard from '@/components/results/ProcedureCard';
import ResultsSummary from '@/components/results/ResultsSummary';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { generateProcedurePdf } from '@/components/results/pdf-generator';
import { saveToHistory } from '@/lib/storage';
import type {
  ValuationInput,
  AddressInput,
  BuildingClass,
  BorisResult,
  ValuationResult,
  ProcedureKey,
} from '@/lib/types';

export default function HomePage() {
  // ========== FORM STATE ==========
  const [address, setAddress] = useState<AddressInput>({
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
  });

  const [buildingClass, setBuildingClass] = useState<BuildingClass | ''>('');
  const [kaufpreisOhneNebenkosten, setKaufpreisOhneNebenkosten] = useState<number | undefined>();
  const [verkehrswert, setVerkehrswert] = useState<number | undefined>();
  const [verkehrswertAktiv, setVerkehrswertAktiv] = useState(false);
  const [nebenkostenGesamt, setNebenkostenGesamt] = useState<number | undefined>();
  const [datumKaufvertrag, setDatumKaufvertrag] = useState<string | undefined>();
  const [urspruenglichesBaujahr, setUrspruenglichesBaujahr] = useState<number | undefined>();
  const [miteigentumsanteilZaehler, setMiteigentumsanteilZaehler] = useState<number | undefined>();
  const [miteigentumsanteilNenner, setMiteigentumsanteilNenner] = useState<number | undefined>();

  const [fiktivesBaujahrBMF, setFiktivesBaujahrBMF] = useState<number | undefined>();
  const [fiktivesBaujahrImmoWertV, setFiktivesBaujahrImmoWertV] = useState<number | undefined>();
  const [fiktiveBaujahreAktiv, setFiktiveBaujahreAktiv] = useState(false);
  const [liegenschaftszins, setLiegenschaftszins] = useState<number | undefined>();
  const [liegenschaftszinsAktiv, setLiegenschaftszinsAktiv] = useState(false);
  const [restnutzungsdauer, setRestnutzungsdauer] = useState<number | undefined>();
  const [reparaturInvestitionsbedarf, setReparaturInvestitionsbedarf] = useState<number | undefined>();

  const [bodenrichtwert, setBodenrichtwert] = useState<number | undefined>();
  const [grundstuecksflaeche, setGrundstuecksflaeche] = useState<number | undefined>();

  const [useErtragswertverfahren, setUseErtragswertverfahren] = useState(true);
  const [useUmgekehrtesErtragswertverfahren, setUseUmgekehrtesErtragswertverfahren] = useState(true);
  const [useVergleichswertverfahren, setUseVergleichswertverfahren] = useState(false);

  // ========== API STATE ==========
  const [isLoadingBoris, setIsLoadingBoris] = useState(false);
  const [isLoadingValuation, setIsLoadingValuation] = useState(false);
  const [borisResult, setBorisResult] = useState<BorisResult | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ========== HELPERS ==========
  const handleFieldChange = (field: string, value: any) => {
    setError(null); // Clear error when user makes changes

    switch (field) {
      case 'buildingClass': setBuildingClass(value); break;
      case 'kaufpreisOhneNebenkosten': setKaufpreisOhneNebenkosten(value); break;
      case 'verkehrswert': setVerkehrswert(value); break;
      case 'verkehrswertAktiv': setVerkehrswertAktiv(value); break;
      case 'nebenkostenGesamt': setNebenkostenGesamt(value); break;
      case 'datumKaufvertrag': setDatumKaufvertrag(value); break;
      case 'urspruenglichesBaujahr': setUrspruenglichesBaujahr(value); break;
      case 'miteigentumsanteilZaehler': setMiteigentumsanteilZaehler(value); break;
      case 'miteigentumsanteilNenner': setMiteigentumsanteilNenner(value); break;
      case 'fiktivesBaujahrBMF': setFiktivesBaujahrBMF(value); break;
      case 'fiktivesBaujahrImmoWertV': setFiktivesBaujahrImmoWertV(value); break;
      case 'fiktiveBaujahreAktiv': setFiktiveBaujahreAktiv(value); break;
      case 'liegenschaftszins': setLiegenschaftszins(value); break;
      case 'liegenschaftszinsAktiv': setLiegenschaftszinsAktiv(value); break;
      case 'restnutzungsdauer': setRestnutzungsdauer(value); break;
      case 'reparaturInvestitionsbedarf': setReparaturInvestitionsbedarf(value); break;
      case 'bodenrichtwert': setBodenrichtwert(value); break;
      case 'grundstuecksflaeche': setGrundstuecksflaeche(value); break;
      case 'useErtragswertverfahren': setUseErtragswertverfahren(value); break;
      case 'useUmgekehrtesErtragswertverfahren': setUseUmgekehrtesErtragswertverfahren(value); break;
      case 'useVergleichswertverfahren': setUseVergleichswertverfahren(value); break;
    }
  };

  const buildValuationInput = (): ValuationInput => ({
    address,
    buildingClass,
    kaufpreisOhneNebenkosten,
    verkehrswert,
    verkehrswertAktiv,
    nebenkostenGesamt,
    datumKaufvertrag,
    urspruenglichesBaujahr,
    miteigentumsanteilZaehler,
    miteigentumsanteilNenner,
    fiktivesBaujahrBMF,
    fiktivesBaujahrImmoWertV,
    fiktiveBaujahreAktiv,
    liegenschaftszins,
    liegenschaftszinsAktiv,
    restnutzungsdauer,
    reparaturInvestitionsbedarf,
    bodenrichtwert,
    grundstuecksflaeche,
    useErtragswertverfahren,
    useUmgekehrtesErtragswertverfahren,
    useVergleichswertverfahren,
  });

  // ========== BORIS RESEARCH ==========
  const handleBorisResearch = async () => {
    if (!address.strasse || !address.plz || !address.ort) {
      setError('Bitte füllen Sie zunächst die Adresse vollständig aus.');
      return;
    }

    setIsLoadingBoris(true);
    setError(null);

    try {
      const response = await fetch('/api/boris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          buildingClass: buildingClass || undefined,
          verkehrswert: verkehrswertAktiv ? verkehrswert : undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setBorisResult(data.data);
        setBodenrichtwert(data.data.bodenrichtwert);
      } else {
        setError(data.error || 'BORIS-Recherche fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      setError('Netzwerkfehler bei der BORIS-Recherche. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setIsLoadingBoris(false);
    }
  };

  // ========== VALUATION ==========
  const handleValuation = async () => {
    // Basic validation
    if (!address.strasse || !address.plz || !address.ort) {
      setError('Bitte füllen Sie zunächst die Adresse vollständig aus.');
      return;
    }

    if (!useErtragswertverfahren && !useUmgekehrtesErtragswertverfahren && !useVergleichswertverfahren) {
      setError('Bitte wählen Sie mindestens ein Bewertungsverfahren aus.');
      return;
    }

    setIsLoadingValuation(true);
    setError(null);

    try {
      const input = buildValuationInput();

      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setValuationResult(data.data);

        // Save to history
        saveToHistory(input, data.data);
      } else {
        setError(data.error || 'Bewertung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      setError('Netzwerkfehler bei der Bewertung. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setIsLoadingValuation(false);
    }
  };

  // ========== PDF GENERATION ==========
  const handleGeneratePdf = (procedureKey: ProcedureKey) => {
    if (!valuationResult) return;

    const input = buildValuationInput();
    const result = valuationResult[procedureKey];

    generateProcedurePdf(procedureKey, result, input);
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlays */}
      {isLoadingBoris && <LoadingOverlay message="BORIS-Portal wird durchsucht..." />}
      {isLoadingValuation && <LoadingOverlay message="Bewertung wird berechnet..." />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Immobilienbewertung</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Automatisierte Bewertung nach ImmoWertV 2021
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Wichtiger Hinweis:</p>
              <p className="mt-1">
                Diese Bewertung ist eine unverbindliche, automatisierte Berechnung und stellt
                keine Rechts- oder Steuerberatung dar. Für rechtlich verbindliche Gutachten
                konsultieren Sie bitte einen zertifizierten Sachverständigen.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Fehler:</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            <AddressSection address={address} onChange={setAddress} />

            <ObjectSection
              buildingClass={buildingClass}
              kaufpreisOhneNebenkosten={kaufpreisOhneNebenkosten}
              verkehrswert={verkehrswert}
              verkehrswertAktiv={verkehrswertAktiv}
              nebenkostenGesamt={nebenkostenGesamt}
              datumKaufvertrag={datumKaufvertrag}
              urspruenglichesBaujahr={urspruenglichesBaujahr}
              miteigentumsanteilZaehler={miteigentumsanteilZaehler}
              miteigentumsanteilNenner={miteigentumsanteilNenner}
              onChange={handleFieldChange}
            />

            <ModernisationSection
              fiktivesBaujahrBMF={fiktivesBaujahrBMF}
              fiktivesBaujahrImmoWertV={fiktivesBaujahrImmoWertV}
              fiktiveBaujahreAktiv={fiktiveBaujahreAktiv}
              liegenschaftszins={liegenschaftszins}
              liegenschaftszinsAktiv={liegenschaftszinsAktiv}
              restnutzungsdauer={restnutzungsdauer}
              reparaturInvestitionsbedarf={reparaturInvestitionsbedarf}
              onChange={handleFieldChange}
            />

            <LandSection
              bodenrichtwert={bodenrichtwert}
              grundstuecksflaeche={grundstuecksflaeche}
              borisResult={borisResult}
              isLoadingBoris={isLoadingBoris}
              onChange={handleFieldChange}
              onBorisResearch={handleBorisResearch}
            />

            <ProcedureToggles
              useErtragswertverfahren={useErtragswertverfahren}
              useUmgekehrtesErtragswertverfahren={useUmgekehrtesErtragswertverfahren}
              useVergleichswertverfahren={useVergleichswertverfahren}
              onChange={handleFieldChange}
            />

            {/* Valuation Button */}
            <div className="flex justify-center">
              <button
                onClick={handleValuation}
                disabled={isLoadingValuation}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-3 transition-colors text-lg font-semibold shadow-lg"
              >
                <Calculator className="w-6 h-6" />
                <span>Bewertung durchführen</span>
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-1 space-y-6">
            {valuationResult ? (
              <>
                <ResultsSummary results={valuationResult} />

                <ProcedureCard
                  procedureKey="ertragswertverfahren"
                  result={valuationResult.ertragswertverfahren}
                  onGeneratePdf={() => handleGeneratePdf('ertragswertverfahren')}
                />

                <ProcedureCard
                  procedureKey="umgekehrtesErtragswertverfahren"
                  result={valuationResult.umgekehrtesErtragswertverfahren}
                  onGeneratePdf={() => handleGeneratePdf('umgekehrtesErtragswertverfahren')}
                />

                <ProcedureCard
                  procedureKey="vergleichswertverfahren"
                  result={valuationResult.vergleichswertverfahren}
                  onGeneratePdf={() => handleGeneratePdf('vergleichswertverfahren')}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Füllen Sie das Formular aus und klicken Sie auf
                  &quot;Bewertung durchführen&quot;, um die Ergebnisse zu sehen.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Immobilienbewertungs-App | Erstellt mit Next.js und Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
