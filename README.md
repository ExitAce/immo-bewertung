# Immobilienbewertung

Eine professionelle, KI-gestützte Web-Anwendung zur automatisierten Bewertung von deutschen Immobilien nach der **Immobilienwertermittlungsverordnung (ImmoWertV) 2021**.

## Features

- **3 Bewertungsverfahren:**
  - Ertragswertverfahren (§§ 17-20 ImmoWertV)
  - Umgekehrtes Ertragswertverfahren (Bodenwert-Rückrechnung)
  - Vergleichswertverfahren (§§ 13-16 ImmoWertV)

- **BORIS-Integration:**
  - Automatische Recherche von Bodenrichtwerten über offizielle BORIS-Portale der Bundesländer
  - Web-Suche mit Claude AI

- **Intelligente Adresseingabe:**
  - OpenStreetMap Nominatim-Autovervollständigung
  - Manuelle Eingabe und Korrektur möglich

- **PDF-Export:**
  - Professionelle PDF-Berichte für jedes Verfahren
  - Detaillierte Rechenwege und Ergebnisse

- **LocalStorage-Verlauf:**
  - Automatisches Speichern der letzten 10 Bewertungen
  - Einfaches Wiederaufrufen früherer Berechnungen

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **PDF:** jsPDF
- **Validation:** Zod
- **Package Manager:** pnpm

## Projektstruktur

```
immo-bewertung/
├── app/
│   ├── layout.tsx              # Root-Layout mit deutscher Lokalisierung
│   ├── page.tsx                # Hauptseite (Client-Komponente)
│   ├── globals.css             # Tailwind-Styles
│   └── api/
│       ├── boris/route.ts      # BORIS Bodenrichtwert-Recherche
│       └── valuation/route.ts  # Bewertungsberechnung (3 Verfahren)
├── components/
│   ├── forms/
│   │   ├── AddressSection.tsx
│   │   ├── ObjectSection.tsx
│   │   ├── ModernisationSection.tsx
│   │   ├── LandSection.tsx
│   │   └── ProcedureToggles.tsx
│   ├── results/
│   │   ├── ProcedureCard.tsx
│   │   ├── ResultsSummary.tsx
│   │   └── pdf-generator.ts
│   └── common/
│       ├── SectionCard.tsx
│       └── LoadingOverlay.tsx
├── lib/
│   ├── types.ts                # TypeScript-Typen + Zod-Schemas
│   ├── prompts.ts              # LLM-Prompt-Templates
│   ├── anthropic.ts            # Anthropic API Wrapper
│   └── storage.ts              # LocalStorage-Helfer
└── public/                     # Statische Assets
```

## Installation & Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- pnpm 10+ (oder npm)
- Anthropic API Key ([hier registrieren](https://console.anthropic.com/))

### Schritt 1: Repository klonen

```bash
git clone https://github.com/ExitAce/immo-bewertung.git
cd immo-bewertung
```

### Schritt 2: Abhängigkeiten installieren

```bash
pnpm install
```

### Schritt 3: Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local`-Datei im Projektstammverzeichnis:

```bash
cp .env.local.example .env.local
```

Fügen Sie Ihren Anthropic API-Schlüssel hinzu:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Schritt 4: Entwicklungsserver starten

```bash
pnpm dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) verfügbar.

### Schritt 5: Production Build testen

```bash
pnpm build
pnpm start
```

## Deployment auf Vercel

### Variante 1: Über GitHub (empfohlen)

1. **Repository auf GitHub pushen** (falls noch nicht geschehen):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **In Vercel importieren:**
   - Gehen Sie zu [vercel.com](https://vercel.com/)
   - Klicken Sie auf "New Project"
   - Importieren Sie Ihr GitHub-Repository
   - Vercel erkennt automatisch, dass es sich um ein Next.js-Projekt handelt

3. **Environment Variables konfigurieren:**
   - Gehen Sie zu "Settings" → "Environment Variables"
   - Fügen Sie hinzu:
     ```
     ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
     ```

4. **Deployen:**
   - Klicken Sie auf "Deploy"
   - Ihr Projekt wird automatisch gebaut und deployed

### Variante 2: Via Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Anmelden
vercel login

# Projekt deployen
vercel

# Environment Variable hinzufügen
vercel env add ANTHROPIC_API_KEY

# Production Deployment
vercel --prod
```

### Nach dem Deployment

- Ihre App ist unter `https://your-project.vercel.app` erreichbar
- Jeder `git push` auf `main` löst automatisch ein neues Deployment aus
- Environment Variables können jederzeit im Vercel Dashboard aktualisiert werden

## Verwendung

### 1. Adresse eingeben

- Nutzen Sie die Autovervollständigung für schnelle Eingabe
- Oder füllen Sie die Felder manuell aus

### 2. Objektdaten eingeben

- Gebäudeklasse auswählen
- Kaufpreis, Baujahr, etc. eingeben
- Optional: Verkehrswert für umgekehrtes Ertragswertverfahren

### 3. Modernisierung & Wertminderung

- Fiktive Baujahre nach Modernisierung
- Restnutzungsdauer
- Reparatur-/Investitionsbedarf

### 4. Bodenrichtwert recherchieren

- Klicken Sie auf "BORIS", um den Bodenrichtwert automatisch zu ermitteln
- Das System durchsucht die offiziellen BORIS-Portale der Bundesländer
- Alternativ: Manuelle Eingabe

### 5. Bewertungsverfahren auswählen

- Aktivieren Sie die gewünschten Verfahren
- Mindestens ein Verfahren muss ausgewählt sein

### 6. Bewertung durchführen

- Klicken Sie auf "Bewertung durchführen"
- Die KI berechnet die Werte nach ImmoWertV 2021
- Ergebnisse erscheinen auf der rechten Seite

### 7. PDF-Export

- Klicken Sie bei jedem Verfahren auf "PDF"
- Ein professioneller Bericht wird heruntergeladen

## API-Endpunkte

### POST /api/boris

Recherchiert den Bodenrichtwert über BORIS-Portale.

**Request:**
```json
{
  "address": {
    "strasse": "Hauptstraße",
    "hausnummer": "1",
    "plz": "60311",
    "ort": "Frankfurt am Main"
  },
  "buildingClass": "Wohneigentum",
  "verkehrswert": 500000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bodenrichtwert": 350.00,
    "quelle": "BORIS Hessen",
    "region": "Frankfurt am Main",
    "hinweise": "Stichtag: 01.01.2024, Nutzungsart: Wohnen"
  }
}
```

### POST /api/valuation

Führt die Immobilienbewertung durch.

**Request:**
```json
{
  "address": { ... },
  "buildingClass": "Wohneigentum",
  "kaufpreisOhneNebenkosten": 450000,
  "verkehrswert": 500000,
  "verkehrswertAktiv": true,
  "bodenrichtwert": 350,
  "grundstuecksflaeche": 500,
  "restnutzungsdauer": 50,
  "useErtragswertverfahren": true,
  "useUmgekehrtesErtragswertverfahren": true,
  "useVergleichswertverfahren": false,
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ertragswertverfahren": {
      "durchfuehrbar": true,
      "rechenweg": [
        "Bodenwert = 350 EUR/m² × 500 m² = 175.000 EUR",
        "Gebäudeertragswert = ...",
        "Ertragswert gesamt = 485.000 EUR"
      ],
      "ergebnis": 485000,
      "einheit": "EUR"
    },
    ...
  }
}
```

## Sicherheit & Best Practices

- **Server-Side API Calls:** Alle Anthropic API-Aufrufe erfolgen server-seitig (Next.js API Routes)
- **API Key Protection:** Der API-Schlüssel wird niemals an den Client gesendet
- **Input Validation:** Zod-Schemas validieren alle Eingaben
- **Error Handling:** Robuste Fehlerbehandlung auf Client und Server
- **Rate Limiting:** Berücksichtigen Sie Anthropic's Rate Limits für Production-Deployments

## Rechtlicher Hinweis

Diese Anwendung dient ausschließlich zu Informationszwecken. Die automatisierten Bewertungen:

- Sind **unverbindlich** und nicht rechtlich bindend
- Stellen **keine Rechts- oder Steuerberatung** dar
- Ersetzen **kein offizielles Sachverständigengutachten**

Für rechtlich verbindliche Bewertungen konsultieren Sie bitte einen zertifizierten Immobiliensachverständigen.

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Support & Kontakt

Bei Fragen oder Problemen:
- Erstellen Sie ein Issue auf GitHub
- Kontaktieren Sie ExitAce: [GitHub Organization](https://github.com/ExitAce)

## Entwickelt mit

- [Next.js](https://nextjs.org/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
