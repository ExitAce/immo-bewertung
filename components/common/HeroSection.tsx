import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function HeroSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Was ist diese Anwendung?",
      answer: "Diese Anwendung führt professionelle Immobilienbewertungen nach ImmoWertV 2021 durch. Sie nutzt KI (Claude von Anthropic), um auf Basis Ihrer Eingabedaten drei anerkannte Bewertungsverfahren zu berechnen und liefert detaillierte Schritt-für-Schritt-Erklärungen."
    },
    {
      question: "Welche Bewertungsverfahren werden verwendet?",
      answer: `
<strong>1. Ertragswertverfahren (§§ 17-20 ImmoWertV)</strong><br/>
Bewertet Immobilien anhand der erzielbaren Mieterträge. Geeignet für vermietete Mehrfamilienhäuser, Gewerbeimmobilien. Benötigt: Mieteinnahmen, Bewirtschaftungskosten, Liegenschaftszinssatz.<br/><br/>

<strong>2. Umgekehrtes Ertragswertverfahren</strong><br/>
Ermittelt den Bodenwert aus dem Kaufpreis durch Rückrechnung. Nützlich zur Plausibilitätsprüfung von Kaufpreisen oder wenn kein Bodenrichtwert verfügbar ist.<br/><br/>

<strong>3. Vergleichswertverfahren (§§ 13-16 ImmoWertV)</strong><br/>
Vergleicht die Immobilie mit ähnlichen, kürzlich verkauften Objekten. Ideal für Wohnimmobilien. Benötigt: Vergleichspreise ähnlicher Immobilien in derselben Lage.
      `
    },
    {
      question: "Welche Daten sind erforderlich?",
      answer: `
<strong>Pflichtfelder:</strong><br/>
• Vollständige Adresse (Straße, Hausnummer, PLZ, Ort)<br/>
• Mindestens ein Bewertungsverfahren ausgewählt<br/><br/>

<strong>Wichtige optionale Felder:</strong><br/>
• <em>Gebäudeklasse</em>: Art der Immobilie (EFH, MFH, Gewerbe, etc.)<br/>
• <em>Kaufpreis</em>: Für Vergleichs- und umgekehrtes Ertragswertverfahren<br/>
• <em>Baujahr</em>: Für Alterswertminderung und Restnutzungsdauer<br/>
• <em>Bodenrichtwert</em>: Kann automatisch recherchiert werden (BORIS-Button)<br/>
• <em>Grundstücksfläche</em>: Für Bodenwertermittlung<br/>
• <em>Liegenschaftszinssatz</em>: Für Ertragswertverfahren
      `
    },
    {
      question: "Was ist BORIS und wie funktioniert die automatische Recherche?",
      answer: "BORIS (Bodenrichtwert-Informationssystem) enthält amtliche Bodenrichtwerte der Gutachterausschüsse. Der Button \"BORIS recherchieren\" nutzt KI mit Web-Suche, um den aktuellen Bodenrichtwert für Ihre Adresse zu ermitteln. Dies kann 10-20 Sekunden dauern. Bei Erfolg wird der Wert automatisch eingetragen."
    },
    {
      question: "Ist diese Bewertung rechtlich verbindlich?",
      answer: "❌ <strong>Nein.</strong> Diese automatisierte Bewertung dient nur zu Informationszwecken und stellt keine Rechts- oder Steuerberatung dar. Für rechtlich verbindliche Gutachten konsultieren Sie bitte einen zertifizierten Sachverständigen nach § 194 BauGB."
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-indigo-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Professionelle Immobilienbewertung
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            KI-gestützte Bewertung nach <strong>ImmoWertV 2021</strong> mit detaillierten Berechnungsschritten
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Häufig gestellte Fragen</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
                >
                  <span className="font-medium text-gray-900 text-sm">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {expandedFaq === index && (
                  <div
                    className="px-4 py-3 text-sm text-gray-700 bg-gray-50 border-t border-gray-100"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <strong className="text-gray-900">Schnellstart:</strong> Adresse eingeben → Verfahren auswählen → Bewertung starten
        </div>
      </div>
    </div>
  );
}
