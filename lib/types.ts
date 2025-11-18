import { z } from 'zod';

// ============================================================================
// BUILDING CLASSES (German Real Estate Categories)
// ============================================================================

export const BUILDING_CLASSES = [
  'Wohneigentum',
  'Ein- und Zweifamilienhaus',
  'Mietwohngrundstück',
  'Geschäftsgrundstück',
  'Gemischt genutztes Grundstück',
  'Sonstige bebaute Grundstücke',
  'Teileigentum',
  'Wohnungseigentum',
  'Wohnungserbbaurecht',
  'Erbbaurecht',
  'Eigentumswohnung',
  'Mehrfamilienhaus',
  'Bürogebäude',
  'Einzelhandel',
  'Gewerbeimmobilie',
  'Industrieimmobilie',
  'Lagerhalle',
  'Hotel / Gastronomie',
  'Pflegeheim',
  'Sonderimmobilie',
  'Bauland',
  'Ackerland',
] as const;

export type BuildingClass = typeof BUILDING_CLASSES[number];

// ============================================================================
// ADDRESS DATA
// ============================================================================

export interface AddressInput {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
}

export const AddressInputSchema = z.object({
  strasse: z.string().min(1, 'Straße ist erforderlich'),
  hausnummer: z.string().min(1, 'Hausnummer ist erforderlich'),
  plz: z.string().regex(/^\d{5}$/, 'PLZ muss 5-stellig sein'),
  ort: z.string().min(1, 'Ort ist erforderlich'),
});

// Nominatim API response
export interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
  };
  lat: string;
  lon: string;
}

// ============================================================================
// VALUATION INPUT
// ============================================================================

export interface ValuationInput {
  // Address
  address: AddressInput;

  // Object details
  buildingClass: BuildingClass | '';
  kaufpreisOhneNebenkosten?: number;
  verkehrswert?: number;
  verkehrswertAktiv: boolean;
  nebenkostenGesamt?: number;
  datumKaufvertrag?: string; // ISO date string
  urspruenglichesBaujahr?: number;
  miteigentumsanteilZaehler?: number;
  miteigentumsanteilNenner?: number;

  // Modernisation / depreciation
  fiktivesBaujahrBMF?: number;
  fiktivesBaujahrImmoWertV?: number;
  fiktiveBaujahreAktiv: boolean;
  liegenschaftszins?: number; // percentage
  liegenschaftszinsAktiv: boolean;
  restnutzungsdauer?: number; // years
  reparaturInvestitionsbedarf?: number; // EUR

  // Land value
  bodenrichtwert?: number; // EUR per m²
  grundstuecksflaeche?: number; // m²

  // Procedure toggles
  useErtragswertverfahren: boolean;
  useUmgekehrtesErtragswertverfahren: boolean;
  useVergleichswertverfahren: boolean;
}

export const ValuationInputSchema = z.object({
  address: AddressInputSchema,
  buildingClass: z.union([z.enum(BUILDING_CLASSES), z.literal('')]),
  kaufpreisOhneNebenkosten: z.number().optional(),
  verkehrswert: z.number().optional(),
  verkehrswertAktiv: z.boolean(),
  nebenkostenGesamt: z.number().optional(),
  datumKaufvertrag: z.string().optional(),
  urspruenglichesBaujahr: z.number().min(1800).max(new Date().getFullYear()).optional(),
  miteigentumsanteilZaehler: z.number().min(1).optional(),
  miteigentumsanteilNenner: z.number().min(1).optional(),
  fiktivesBaujahrBMF: z.number().min(1800).max(new Date().getFullYear()).optional(),
  fiktivesBaujahrImmoWertV: z.number().min(1800).max(new Date().getFullYear()).optional(),
  fiktiveBaujahreAktiv: z.boolean(),
  liegenschaftszins: z.number().min(0).max(100).optional(),
  liegenschaftszinsAktiv: z.boolean(),
  restnutzungsdauer: z.number().min(0).max(200).optional(),
  reparaturInvestitionsbedarf: z.number().min(0).optional(),
  bodenrichtwert: z.number().min(0).optional(),
  grundstuecksflaeche: z.number().min(0).optional(),
  useErtragswertverfahren: z.boolean(),
  useUmgekehrtesErtragswertverfahren: z.boolean(),
  useVergleichswertverfahren: z.boolean(),
});

// ============================================================================
// PROCEDURE RESULTS
// ============================================================================

export interface ProcedureResult {
  durchfuehrbar: boolean;
  rechenweg: string[]; // Array of calculation steps in German
  ergebnis: number | null; // Final value in EUR
  einheit: string; // e.g., "EUR", "EUR/m²"
  hinweis?: string; // Optional explanation or warning
}

export const ProcedureResultSchema = z.object({
  durchfuehrbar: z.boolean(),
  rechenweg: z.array(z.string()),
  ergebnis: z.number().nullable(),
  einheit: z.string(),
  hinweis: z.string().optional(),
});

// ============================================================================
// VALUATION RESULT (all 3 procedures)
// ============================================================================

export interface ValuationResult {
  ertragswertverfahren: ProcedureResult;
  umgekehrtesErtragswertverfahren: ProcedureResult;
  vergleichswertverfahren: ProcedureResult;
}

export const ValuationResultSchema = z.object({
  ertragswertverfahren: ProcedureResultSchema,
  umgekehrtesErtragswertverfahren: ProcedureResultSchema,
  vergleichswertverfahren: ProcedureResultSchema,
});

// ============================================================================
// BORIS / BODENRICHTWERT RESULT
// ============================================================================

export interface BorisResult {
  bodenrichtwert: number; // EUR per m²
  quelle: string; // Source portal (e.g., "BORIS Hessen")
  region: string; // Region/municipality
  hinweise: string; // Additional notes from research
}

export const BorisResultSchema = z.object({
  bodenrichtwert: z.number().min(0),
  quelle: z.string(),
  region: z.string(),
  hinweise: z.string(),
});

// ============================================================================
// VALUATION HISTORY (LocalStorage)
// ============================================================================

export interface ValuationHistory {
  id: string;
  timestamp: string; // ISO date
  address: AddressInput;
  buildingClass: string;
  results: ValuationResult;
  inputSnapshot: ValuationInput;
}

export const ValuationHistorySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  address: AddressInputSchema,
  buildingClass: z.string(),
  results: ValuationResultSchema,
  inputSnapshot: ValuationInputSchema,
});

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BorisApiResponse extends ApiResponse<BorisResult> {}
export interface ValuationApiResponse extends ApiResponse<ValuationResult> {}

// ============================================================================
// FORM STATE
// ============================================================================

export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  boris: boolean;
  valuation: boolean;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type ProcedureKey = 'ertragswertverfahren' | 'umgekehrtesErtragswertverfahren' | 'vergleichswertverfahren';

export const PROCEDURE_NAMES: Record<ProcedureKey, string> = {
  ertragswertverfahren: 'Ertragswertverfahren',
  umgekehrtesErtragswertverfahren: 'Umgekehrtes Ertragswertverfahren',
  vergleichswertverfahren: 'Vergleichswertverfahren',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatAddress(address: AddressInput): string {
  return `${address.strasse} ${address.hausnummer}, ${address.plz} ${address.ort}`;
}
