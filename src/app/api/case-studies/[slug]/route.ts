import { NextRequest, NextResponse } from 'next/server';
import { getCaseStudyBySlug } from '@/lib/payload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const caseStudy = await getCaseStudyBySlug(slug);

    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error(`Failed to fetch case study ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch case study' },
      { status: 500 }
    );
  }
}