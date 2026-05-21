'use client';

import Link from 'next/link';
import {
  Check,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Layers3,
  Radio,
  UserRound,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAgent, useSessionContext } from '@livekit/components-react';
import { useVisualOrchestrationContext } from '@/context/visual-orchestration-context';
import { LEAD_FIELD_DEFS } from '@/hooks/useVisualOrchestration';
import { DISCOVERY_FIELD_DEFS } from '@/lib/maneuver-catalog';
import { cn } from '@/lib/shadcn/utils';

const iconByKey: Record<string, typeof UserRound> = {
  name: UserRound,
  company: Layers3,
  problem: ClipboardList,
  budget: CircleDollarSign,
  timeline: Clock3,
};

function statusLabel(state?: string) {
  if (state === 'speaking') return 'speaking';
  if (state === 'thinking') return 'thinking';
  if (state === 'listening') return 'listening';
  return 'listening';
}

function StatusIndicator() {
  const { state } = useAgent();
  const { isConnected } = useSessionContext();
  const label = isConnected ? statusLabel(state) : 'waiting';

  return (
    <div className="border-border bg-background flex items-center justify-between rounded-lg border px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'size-2 rounded-full',
            label === 'speaking' && 'animate-pulse bg-emerald-500',
            label === 'thinking' && 'animate-pulse bg-amber-500',
            label === 'listening' && 'bg-sky-500',
            label === 'waiting' && 'bg-muted-foreground'
          )}
        />
        <span className="font-mono text-xs font-bold uppercase">{label}</span>
      </div>
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <Radio className="size-3" />
        live sync
      </div>
    </div>
  );
}

function LeadFieldRow({
  fieldKey,
  label,
  value,
  highlighted,
  justUpdated,
}: {
  fieldKey: string;
  label: string;
  value?: string;
  highlighted?: boolean;
  justUpdated?: boolean;
}) {
  const Icon = iconByKey[fieldKey] ?? ClipboardList;

  return (
    <motion.div
      layout
      initial={justUpdated ? { scale: 0.96, opacity: 0.6 } : false}
      animate={{
        scale: 1,
        opacity: 1,
        boxShadow: justUpdated
          ? '0 0 0 2px rgba(16, 185, 129, 0.35)'
          : '0 0 0 0px rgba(16, 185, 129, 0)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'border-border bg-background rounded-lg border px-3 py-2',
        value && 'border-emerald-500/40 bg-emerald-500/5',
        highlighted && !value && 'border-primary/30 bg-primary/5'
      )}
    >
      <div className="flex items-center gap-2">
        {value ? (
          <Check className="size-4 text-emerald-600" />
        ) : (
          <Icon className="text-muted-foreground size-4" />
        )}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={cn(
          'mt-1 text-sm leading-5',
          value ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {value || 'Waiting…'}
      </p>
    </motion.div>
  );
}

export function VisualOrchestrationPanel() {
  const { state } = useVisualOrchestrationContext();
  const discoveryCaptured = DISCOVERY_FIELD_DEFS.filter((field) => state.lead[field.key]).length;
  const extraFields = LEAD_FIELD_DEFS.filter(
    (field) => !DISCOVERY_FIELD_DEFS.some((d) => d.key === field.key)
  );

  return (
    <aside className="flex h-full min-h-0 flex-col gap-3">
      <StatusIndicator />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4" />
          <h2 className="text-sm font-semibold">Live lead capture</h2>
        </div>
        <span className="text-muted-foreground font-mono text-xs">
          {discoveryCaptured}/{DISCOVERY_FIELD_DEFS.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {DISCOVERY_FIELD_DEFS.map(({ key, label }) => (
          <LeadFieldRow
            key={key}
            fieldKey={key}
            label={label}
            value={state.lead[key]}
            highlighted
            justUpdated={state.lastLeadField === key}
          />
        ))}

        {extraFields.some((field) => state.lead[field.key]) && (
          <p className="text-muted-foreground pt-2 text-[10px] font-semibold tracking-wide uppercase">
            More context
          </p>
        )}
        {extraFields.map(({ key, label }) =>
          state.lead[key] ? (
            <LeadFieldRow
              key={key}
              fieldKey={key}
              label={label}
              value={state.lead[key]}
              justUpdated={state.lastLeadField === key}
            />
          ) : null
        )}
      </div>

      {state.summary && (
        <div className="border-border bg-background rounded-lg border p-3">
          <p className="text-xs font-semibold tracking-wide uppercase">Call summary</p>
          <p className="text-muted-foreground mt-2 text-sm leading-5">{state.summary}</p>
        </div>
      )}

      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground text-center text-xs underline underline-offset-4"
      >
        Founder view — past calls
      </Link>
    </aside>
  );
}
