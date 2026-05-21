import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const LEADS_PATH = path.join(process.cwd(), '..', 'agent', 'leads', 'demo-leads.json');

export async function GET() {
  try {
    const raw = await readFile(LEADS_PATH, 'utf-8');
    const leads = JSON.parse(raw);

    return NextResponse.json({ leads: Array.isArray(leads) ? leads : [] });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}
