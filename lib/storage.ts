import type { ValuationHistory, ValuationInput, ValuationResult } from './types';

const STORAGE_KEY = 'immo-bewertung-history';
const MAX_HISTORY_ITEMS = 10;

// ============================================================================
// SAVE VALUATION TO HISTORY
// ============================================================================

export function saveToHistory(
  input: ValuationInput,
  results: ValuationResult
): void {
  try {
    // Create history entry
    const entry: ValuationHistory = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      address: input.address,
      buildingClass: input.buildingClass || 'Nicht angegeben',
      results,
      inputSnapshot: input,
    };

    // Get existing history
    const history = getHistory();

    // Add new entry at the beginning
    history.unshift(entry);

    // Keep only the last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

// ============================================================================
// GET HISTORY
// ============================================================================

export function getHistory(): ValuationHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

// ============================================================================
// GET SINGLE HISTORY ITEM BY ID
// ============================================================================

export function getHistoryItem(id: string): ValuationHistory | null {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

// ============================================================================
// DELETE HISTORY ITEM
// ============================================================================

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

// ============================================================================
// CLEAR ALL HISTORY
// ============================================================================

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
