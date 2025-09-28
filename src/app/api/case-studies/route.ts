import { NextRequest, NextResponse } from 'next/server';
import { getCaseStudies, type CaseStudyQueryParams } from '@/lib/payload';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const category = searchParams.get('category');
    
    const params: CaseStudyQueryParams = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (category) {
      params.where = {
        'category.slug': { equals: category }
      };
    }
    
    const caseStudies = await getCaseStudies(params);
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Failed to fetch case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}