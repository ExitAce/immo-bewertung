import jsPDF from 'jspdf';
import type { ProcedureResult, ProcedureKey, ValuationInput, AddressInput } from '@/lib/types';
import { PROCEDURE_NAMES, formatCurrency, formatAddress, formatDate } from '@/lib/types';

// ============================================================================
// PDF GENERATION FOR SINGLE PROCEDURE
// ============================================================================

export function generateProcedurePdf(
  procedureKey: ProcedureKey,
  result: ProcedureResult,
  input: ValuationInput
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  const procedureName = PROCEDURE_NAMES[procedureKey];

  // Helper: Add text with auto-wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 11) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.5; // Return new Y position
  };

  // Helper: Add page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // ========== HEADER ==========
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Immobilienbewertung', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(procedureName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // ========== DATE AND ADDRESS ==========
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, yPosition);
  yPosition += 6;

  doc.text(`Objekt: ${formatAddress(input.address)}`, 20, yPosition);
  yPosition += 10;

  // ========== SECTION: EINGABEDATEN ==========
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Eingabedaten', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const inputData: Array<[string, string]> = [];

  if (input.buildingClass) {
    inputData.push(['Gebäudeklasse', input.buildingClass]);
  }
  if (input.kaufpreisOhneNebenkosten) {
    inputData.push(['Kaufpreis ohne NK', formatCurrency(input.kaufpreisOhneNebenkosten)]);
  }
  if (input.verkehrswertAktiv && input.verkehrswert) {
    inputData.push(['Verkehrswert', formatCurrency(input.verkehrswert)]);
  }
  if (input.nebenkostenGesamt) {
    inputData.push(['Nebenkosten', formatCurrency(input.nebenkostenGesamt)]);
  }
  if (input.datumKaufvertrag) {
    inputData.push(['Datum Kaufvertrag', formatDate(input.datumKaufvertrag)]);
  }
  if (input.urspruenglichesBaujahr) {
    inputData.push(['Ursprüngliches Baujahr', input.urspruenglichesBaujahr.toString()]);
  }
  if (input.fiktiveBaujahreAktiv) {
    if (input.fiktivesBaujahrBMF) {
      inputData.push(['Fiktives Baujahr (BMF)', input.fiktivesBaujahrBMF.toString()]);
    }
    if (input.fiktivesBaujahrImmoWertV) {
      inputData.push(['Fiktives Baujahr (ImmoWertV)', input.fiktivesBaujahrImmoWertV.toString()]);
    }
  }
  if (input.restnutzungsdauer) {
    inputData.push(['Restnutzungsdauer', `${input.restnutzungsdauer} Jahre`]);
  }
  if (input.liegenschaftszinsAktiv && input.liegenschaftszins) {
    inputData.push(['Liegenschaftszins', `${input.liegenschaftszins}%`]);
  }
  if (input.bodenrichtwert) {
    inputData.push(['Bodenrichtwert', `${input.bodenrichtwert.toLocaleString('de-DE')} EUR/m²`]);
  }
  if (input.grundstuecksflaeche) {
    inputData.push(['Grundstücksfläche', `${input.grundstuecksflaeche.toLocaleString('de-DE')} m²`]);
  }
  if (input.reparaturInvestitionsbedarf) {
    inputData.push(['Reparatur-/Investitionsbedarf', formatCurrency(input.reparaturInvestitionsbedarf)]);
  }

  for (const [label, value] of inputData) {
    checkPageBreak(6);
    doc.text(`${label}: ${value}`, 25, yPosition);
    yPosition += 6;
  }

  yPosition += 5;

  // ========== SECTION: RECHENWEG ==========
  if (result.durchfuehrbar && result.rechenweg && result.rechenweg.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Rechenweg', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    result.rechenweg.forEach((step, index) => {
      checkPageBreak(15);
      const stepText = `${index + 1}. ${step}`;
      yPosition = addText(stepText, 25, yPosition, pageWidth - 45, 10);
      yPosition += 4;
    });

    yPosition += 5;
  }

  // ========== SECTION: ERGEBNIS ==========
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ergebnis', 20, yPosition);
  yPosition += 8;

  if (result.durchfuehrbar && result.ergebnis !== null) {
    // Draw result box
    doc.setFillColor(59, 130, 246); // Blue-600
    doc.rect(20, yPosition, pageWidth - 40, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');

    const resultText = result.einheit === 'EUR/m²'
      ? `${result.ergebnis.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${result.einheit}`
      : formatCurrency(result.ergebnis);

    doc.text(resultText, pageWidth / 2, yPosition + 13, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    yPosition += 25;

    if (result.hinweis) {
      checkPageBreak(15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      yPosition = addText(`Hinweis: ${result.hinweis}`, 25, yPosition, pageWidth - 45, 9);
      yPosition += 5;
    }
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Verfahren nicht durchführbar', 25, yPosition);
    if (result.hinweis) {
      yPosition += 6;
      yPosition = addText(`Grund: ${result.hinweis}`, 25, yPosition, pageWidth - 45, 10);
    }
  }

  // ========== FOOTER ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      'Erstellt mit Immobilienbewertungs-App (automatisierte Berechnung)',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
    doc.text(
      `Seite ${i} von ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // ========== SAVE PDF ==========
  const fileName = `${procedureName.replace(/\s+/g, '_')}_${input.address.plz}_${input.address.ort}.pdf`;
  doc.save(fileName);
}

// ============================================================================
// PDF GENERATION FOR ALL PROCEDURES (COMBINED)
// ============================================================================

export function generateCombinedPdf(
  results: Record<ProcedureKey, ProcedureResult>,
  input: ValuationInput
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper: Add text with auto-wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 11) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.5;
  };

  // Helper: Add page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // ========== HEADER ==========
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Immobilienbewertung', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Gesamtbericht - Alle Verfahren', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(10);
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Objekt: ${formatAddress(input.address)}`, 20, yPosition);
  yPosition += 15;

  // ========== ITERATE THROUGH PROCEDURES ==========
  const procedures: ProcedureKey[] = ['ertragswertverfahren', 'umgekehrtesErtragswertverfahren', 'vergleichswertverfahren'];

  procedures.forEach((key) => {
    const result = results[key];
    const name = PROCEDURE_NAMES[key];

    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(name, 20, yPosition);
    yPosition += 8;

    if (result.durchfuehrbar && result.ergebnis !== null) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Ergebnis
      const resultText = result.einheit === 'EUR/m²'
        ? `${result.ergebnis.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${result.einheit}`
        : formatCurrency(result.ergebnis);

      doc.setFont('helvetica', 'bold');
      doc.text(`Ergebnis: ${resultText}`, 25, yPosition);
      yPosition += 8;

      // Rechenweg
      if (result.rechenweg && result.rechenweg.length > 0) {
        doc.setFont('helvetica', 'normal');
        result.rechenweg.forEach((step, index) => {
          checkPageBreak(10);
          yPosition = addText(`${index + 1}. ${step}`, 30, yPosition, pageWidth - 50, 9);
          yPosition += 2;
        });
      }

      yPosition += 8;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Nicht durchführbar', 25, yPosition);
      if (result.hinweis) {
        yPosition += 6;
        yPosition = addText(result.hinweis, 25, yPosition, pageWidth - 45, 9);
      }
      yPosition += 8;
    }
  });

  // ========== FOOTER ==========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      'Erstellt mit Immobilienbewertungs-App (automatisierte Berechnung)',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
    doc.text(
      `Seite ${i} von ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // ========== SAVE PDF ==========
  const fileName = `Immobilienbewertung_${input.address.plz}_${input.address.ort}_Gesamt.pdf`;
  doc.save(fileName);
}
