import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/content';
import { admins } from '@/db/schema';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').toLowerCase().trim();
  const password = String(form.get('password') ?? '');
  const next = String(form.get('next') ?? '/admin');

  const fail = (why: string) =>
    NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(why)}`, req.url), 303);

  const db = getDb();
  if (!db) return fail('The database is not connected yet.');
  if (!email || !password) return fail('Enter your email and password.');

  try {
    const rows = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    const user = rows[0];

    // Compare against a dummy hash when the account is unknown, so a wrong
    // email and a wrong password take the same amount of time to answer.
    const hash = user?.passwordHash
      ?? '$2a$12$0000000000000000000000000000000000000000000000000000';
    const good = await bcrypt.compare(password, hash);

    if (!user || !good) return fail('That email and password do not match.');

    await setSessionCookie(await createSessionToken({ email: user.email, name: user.name }));
    return NextResponse.redirect(new URL(next.startsWith('/admin') ? next : '/admin', req.url), 303);
  } catch {
    return fail('Could not sign in. Check the database connection.');
  }
}
