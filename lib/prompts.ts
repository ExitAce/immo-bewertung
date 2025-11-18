import type { ValuationInput, AddressInput, BuildingClass } from './types';

// ============================================================================
// BORIS / BODENRICHTWERT RESEARCH PROMPT
// ============================================================================

export function createBorisPrompt(
  address: AddressInput,
  buildingClass?: BuildingClass | '',
  verkehrswert?: number
): { system: string; user: string } {
  const fullAddress = `${address.strasse} ${address.hausnummer}, ${address.plz} ${address.ort}`;

  const system = `Du bist ein Experte für deutsche Bodenrichtwerte und BORIS-Portale (Bodenrichtwert-Informationssysteme der Bundesländer).

AUFGABE:
Recherchiere den aktuellen Bodenrichtwert für die angegebene Adresse mit Hilfe der Web-Suche. Nutze die offiziellen BORIS-Portale der jeweiligen Bundesländer.

WICHTIGE BORIS-PORTALE:
- BORIS Bayern: https://www.bodenrichtwerte-boris.de/
- BORIS Hessen: https://gds.hessen.de/GEODOSTOR/
- BORIS NRW: https://www.boris.nrw.de/
- BORIS Baden-Württemberg: https://www.gutachterausschuesse-bw.de/
- BORIS Berlin: https://fbinter.stadt-berlin.de/boris/
- BORIS Hamburg: https://metropolregion.hamburg.de/boris-hh/
- Weitere Bundesland-spezifische Portale

VORGEHEN:
1. Identifiziere das Bundesland anhand der PLZ/Ort
2. Suche im entsprechenden BORIS-Portal nach der Adresse
3. Finde den Bodenrichtwert in EUR/m² für das entsprechende Grundstück
4. Beachte: Bodenrichtwerte können nach Nutzungsart variieren (Wohnen, Gewerbe, etc.)

AUSGABEFORMAT:
Du MUSST ausschließlich JSON zurückgeben, ohne jegliche Markdown-Formatierung oder Code-Blocks.

{
  "bodenrichtwert": <Zahl in EUR/m²>,
  "quelle": "<Name des BORIS-Portals oder der Quelle>",
  "region": "<Genaue Region/Gemeinde>",
  "hinweise": "<Zusätzliche relevante Informationen, z.B. Stichtag, Nutzungsart, Besonderheiten>"
}

WICHTIG:
- Wenn kein exakter Wert gefunden wird, verwende einen plausiblen Durchschnitt für die Region
- Gib immer eine Schätzung ab, auch wenn die Datenlage dünn ist
- Dokumentiere in "hinweise", wie der Wert ermittelt wurde`;

  const user = `Bitte recherchiere den Bodenrichtwert für folgende Immobilie:

ADRESSE: ${fullAddress}

${buildingClass ? `GEBÄUDEKLASSE: ${buildingClass}\n` : ''}
${verkehrswert ? `VERKEHRSWERT (zur Orientierung): ${verkehrswert.toLocaleString('de-DE')} EUR\n` : ''}

Führe eine Web-Suche durch und ermittle den aktuellen Bodenrichtwert. Gib das Ergebnis als JSON zurück.`;

  return { system, user };
}

// ============================================================================
// VALUATION PROMPT (3 PROCEDURES)
// ============================================================================

export function createValuationPrompt(input: ValuationInput): { system: string; user: string } {
  const system = `Du bist ein erfahrener deutscher Immobiliengutachter und Sachverständiger für Immobilienbewertung.

RECHTLICHER RAHMEN:
- Du arbeitest nach der Immobilienwertermittlungsverordnung (ImmoWertV) von 2021
- Du kennst die drei Hauptverfahren: Ertragswertverfahren, Vergleichswertverfahren, Sachwertverfahren
- Du kannst auch das "umgekehrte Ertragswertverfahren" anwenden (Berechnung des Bodenwerts aus dem Verkehrswert)

DEINE AUFGABE:
Berechne die angeforderten Bewertungsverfahren basierend auf den Eingabedaten. Für jedes Verfahren:

1. Prüfe, ob das Verfahren durchführbar ist (ausreichende Daten vorhanden)
2. Führe die Berechnung Schritt für Schritt durch
3. Dokumentiere jeden Rechenschritt in verständlichem Deutsch
4. Gib das Ergebnis in EUR an

VERFAHREN:

**1. Ertragswertverfahren (§§ 17-20 ImmoWertV)**
- Bodenwert = Bodenrichtwert × Grundstücksfläche
- Gebäudeertragswert = Rohertrag - Bewirtschaftungskosten, kapitalisiert über Restnutzungsdauer
- Ertragswert = Bodenwert + Gebäudeertragswert - Reparaturbedarf

**2. Umgekehrtes Ertragswertverfahren**
- Gegeben: Verkehrswert (Kaufpreis) der Immobilie
- Gesucht: Bodenwert
- Formel: Bodenwert = Verkehrswert - Gebäudeertragswert
- Alternativ: Bodenwert = (Verkehrswert - Gebäudewert) / Grundstücksfläche
- Nutze Liegenschaftszins und Restnutzungsdauer zur Kapitalisierung

**3. Vergleichswertverfahren (§§ 13-16 ImmoWertV)**
- Vergleich mit ähnlichen Objekten am Markt
- WICHTIG: Nur durchführbar, wenn ausreichend Vergleichsdaten vorliegen
- Falls nicht durchführbar: setze "durchfuehrbar": false und erkläre warum

RECHENWEG:
- Jeder Schritt soll eine verständliche Rechnung sein
- Beispiel: "Bodenwert = 350 EUR/m² × 500 m² = 175.000 EUR"
- Beispiel: "Vervielfältiger bei 5% Zinssatz und 50 Jahren RND = 18,26"
- Nutze deutsche Zahlenformatierung (Punkt als Tausendertrennzeichen, Komma als Dezimaltrennzeichen)

AUSGABEFORMAT:
Du MUSST ausschließlich JSON zurückgeben, ohne jegliche Markdown-Formatierung oder Code-Blocks.

{
  "ertragswertverfahren": {
    "durchfuehrbar": true/false,
    "rechenweg": ["Schritt 1", "Schritt 2", ...],
    "ergebnis": <Zahl in EUR>,
    "einheit": "EUR",
    "hinweis": "Optional: Erklärung oder Einschränkung"
  },
  "umgekehrtesErtragswertverfahren": {
    "durchfuehrbar": true/false,
    "rechenweg": ["Schritt 1", "Schritt 2", ...],
    "ergebnis": <Zahl in EUR/m²>,
    "einheit": "EUR/m²",
    "hinweis": "Optional: Erklärung oder Einschränkung"
  },
  "vergleichswertverfahren": {
    "durchfuehrbar": true/false,
    "rechenweg": ["Schritt 1", "Schritt 2", ...],
    "ergebnis": <Zahl in EUR>,
    "einheit": "EUR",
    "hinweis": "Optional: Erklärung oder Einschränkung"
  }
}

WICHTIGE HINWEISE:
- Falls ein Verfahren nicht angefordert wurde (useXXX = false), setze "durchfuehrbar": false und gib einen kurzen Hinweis
- Falls Daten fehlen, setze "durchfuehrbar": false und erkläre welche Daten fehlen
- Nutze plausible Annahmen basierend auf Erfahrungswerten, wenn einzelne Werte fehlen
- Sei transparent bei Schätzungen und Annahmen
- Die Rechenwege sollten nachvollziehbar und prüfbar sein`;

  const user = `Bitte bewerte folgende Immobilie:

EINGABEDATEN:
${JSON.stringify(input, null, 2)}

ANGEFORDERTE VERFAHREN:
- Ertragswertverfahren: ${input.useErtragswertverfahren ? 'JA' : 'NEIN'}
- Umgekehrtes Ertragswertverfahren: ${input.useUmgekehrtesErtragswertverfahren ? 'JA' : 'NEIN'}
- Vergleichswertverfahren: ${input.useVergleichswertverfahren ? 'JA' : 'NEIN'}

Führe die Bewertung durch und gib das Ergebnis als JSON zurück.`;

  return { system, user };
}

// ============================================================================
// HELPER: Extract JSON from LLM response
// ============================================================================

export function extractJsonFromResponse(response: string): string {
  // Remove markdown code blocks
  const withoutCodeBlocks = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Try to find JSON object
  const jsonMatch = withoutCodeBlocks.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // If no match, return the whole response
  return withoutCodeBlocks.trim();
}
