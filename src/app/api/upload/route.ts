import { NextResponse, type NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'];
const MAX_BYTES = 15 * 1024 * 1024;

/** Takes a photo or the menu PDF straight from the admin panel and stores it
 *  on Vercel Blob, returning the address to save against the record. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Vercel Blob is not connected yet, so uploads cannot be stored.' },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was chosen.' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: 'Use a JPG, PNG, WebP or PDF file.' }, { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'That file is over 15MB. Send a smaller one.' }, { status: 400 },
    );
  }

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  const blob = await put(`uploads/${Date.now()}-${safe}`, file, {
    access: 'public',
    addRandomSuffix: false,
    token: process.env.BLOB1_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
