import { NextRequest, NextResponse } from 'next/server';
import { callAnthropicForJson } from '@/lib/anthropic';
import { createBorisPrompt } from '@/lib/prompts';
import { BorisResult, BorisResultSchema, BorisApiResponse, AddressInput, BuildingClass } from '@/lib/types';

// ============================================================================
// POST /api/boris
// Research Bodenrichtwert using Claude + Web Search
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<BorisApiResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    const { address, buildingClass, verkehrswert } = body as {
      address: AddressInput;
      buildingClass?: BuildingClass | '';
      verkehrswert?: number;
    };

    // Validate required fields
    if (!address || !address.strasse || !address.plz || !address.ort) {
      return NextResponse.json(
        {
          success: false,
          error: 'Adresse ist unvollständig. Straße, PLZ und Ort sind erforderlich.',
        },
        { status: 400 }
      );
    }

    // Create the prompt
    const { system, user } = createBorisPrompt(address, buildingClass, verkehrswert);

    // Call Anthropic API with web search enabled
    const borisResult = await callAnthropicForJson<BorisResult>({
      system,
      userMessage: user,
      temperature: 0.3,
      maxTokens: 2048,
      useWebSearch: true,
    });

    // Validate the response with Zod
    const validatedResult = BorisResultSchema.parse(borisResult);

    // Return success response
    return NextResponse.json({
      success: true,
      data: validatedResult,
    });

  } catch (error) {
    console.error('BORIS API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : 'Fehler bei der Bodenrichtwert-Recherche. Bitte versuchen Sie es erneut.',
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
