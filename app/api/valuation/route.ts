import { NextRequest, NextResponse } from 'next/server';
import { callAnthropicForJson } from '@/lib/anthropic';
import { createValuationPrompt } from '@/lib/prompts';
import {
  ValuationInput,
  ValuationInputSchema,
  ValuationResult,
  ValuationResultSchema,
  ValuationApiResponse,
} from '@/lib/types';

// ============================================================================
// POST /api/valuation
// Perform 3 valuation procedures using Claude
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ValuationApiResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    let input: ValuationInput;
    try {
      input = ValuationInputSchema.parse(body);
    } catch (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Eingabedaten. Bitte überprüfen Sie alle Pflichtfelder.',
        },
        { status: 400 }
      );
    }

    // Basic validation: at least one procedure must be enabled
    if (
      !input.useErtragswertverfahren &&
      !input.useUmgekehrtesErtragswertverfahren &&
      !input.useVergleichswertverfahren
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mindestens ein Bewertungsverfahren muss ausgewählt sein.',
        },
        { status: 400 }
      );
    }

    // Create the prompt
    const { system, user } = createValuationPrompt(input);

    // Call Anthropic API
    const valuationResult = await callAnthropicForJson<ValuationResult>({
      system,
      userMessage: user,
      temperature: 0.3,
      maxTokens: 4096,
      useWebSearch: false, // No web search needed for calculations
    });

    // Validate the response with Zod
    const validatedResult = ValuationResultSchema.parse(valuationResult);

    // Return success response
    return NextResponse.json({
      success: true,
      data: validatedResult,
    });

  } catch (error) {
    console.error('Valuation API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : 'Fehler bei der Bewertungsberechnung. Bitte versuchen Sie es erneut.',
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS (if needed)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
