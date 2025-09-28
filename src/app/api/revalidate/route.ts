import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Security check - verify webhook secret
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    console.log('Revalidation webhook received:', body);

    // Get collection and slug from webhook payload
    const { collection, slug } = body;

    // Revalidate based on collection type
    switch (collection) {
      case 'case-studies':
        if (slug) {
          // Revalidate specific case study
          await revalidatePath(`/case-studies/${slug}`);
          console.log(`Revalidated case study: /case-studies/${slug}`);
        }
        // Also revalidate case studies listing pages
        await revalidatePath('/case-studies');
        await revalidatePath('/results');
        console.log('Revalidated case studies listing pages');
        break;

      case 'insights':
        if (slug) {
          await revalidatePath(`/insights/${slug}`);
          console.log(`Revalidated insight: /insights/${slug}`);
        }
        await revalidatePath('/insights');
        console.log('Revalidated insights listing page');
        break;

      case 'navigation':
        // Revalidate all pages when navigation changes
        await revalidatePath('/', 'layout');
        console.log('Revalidated navigation (all pages)');
        break;

      case 'footer':
        // Revalidate all pages when footer changes
        await revalidatePath('/', 'layout');
        console.log('Revalidated footer (all pages)');
        break;

      default:
        console.log(`Unknown collection: ${collection}`);
        break;
    }

    return NextResponse.json({ 
      message: 'Revalidation successful',
      revalidated: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Revalidation failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Revalidation endpoint is active',
    timestamp: new Date().toISOString()
  });
}