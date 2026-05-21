'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeadRecord {
  room_name: string;
  created_at: string;
  updated_at?: string;
  fields: Record<string, string>;
  summary?: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((response) => response.json())
      .then((data: { leads: LeadRecord[] }) => {
        setLeads(data.leads ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-background mx-auto min-h-svh max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Founder view</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Past voice calls and discovery fields captured by the agent.
          </p>
        </div>
        <Link href="/" className="text-sm underline underline-offset-4">
          Back to call
        </Link>
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading leads…</p>}

      {!loading && leads.length === 0 && (
        <p className="text-muted-foreground text-sm">No calls captured yet.</p>
      )}

      <div className="space-y-4">
        {leads.map((lead) => (
          <article
            key={lead.room_name}
            className="border-border bg-background rounded-xl border p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-mono text-sm font-semibold">{lead.room_name}</h2>
              <time className="text-muted-foreground text-xs">
                {new Date(lead.updated_at ?? lead.created_at).toLocaleString()}
              </time>
            </div>

            {lead.summary ? (
              <p className="mt-3 text-sm leading-6">{lead.summary}</p>
            ) : (
              <p className="text-muted-foreground mt-3 text-sm italic">No summary yet</p>
            )}

            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(lead.fields ?? {}).map(([key, value]) => (
                <div key={key} className="border-border rounded-lg border px-3 py-2">
                  <dt className="text-muted-foreground text-xs font-medium uppercase">
                    {key.replaceAll('_', ' ')}
                  </dt>
                  <dd className="mt-1 text-sm leading-5">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </main>
  );
}
