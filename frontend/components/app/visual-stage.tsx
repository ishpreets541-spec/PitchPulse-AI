'use client';

import { Building2, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAgent } from '@livekit/components-react';
import { ProcessDiagram } from '@/components/app/process-diagram';
import { ServicesSlideDeck } from '@/components/app/service-slide-cards';
import {
  type VisualMode,
  useVisualOrchestrationContext,
} from '@/context/visual-orchestration-context';
import {
  MANEUVER_SERVICES,
  type ManeuverService,
  PROCESS_STEPS,
  getServiceById,
} from '@/lib/maneuver-catalog';
import { cn } from '@/lib/shadcn/utils';

function ModeBadge({ mode }: { mode: VisualMode }) {
  const labels: Record<VisualMode, string> = {
    services: 'Services',
    process: 'Process',
    lead_capture: 'Discovery',
  };

  return (
    <span className="bg-primary/10 text-primary rounded-md px-2 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
      {labels[mode]}
    </span>
  );
}

function normalizeServices(
  services: Array<Partial<ManeuverService> & { id: string; name: string; short: string }>
): ManeuverService[] {
  return services.map((service) => {
    const fallback = getServiceById(service.id);
    return {
      ...fallback,
      ...service,
      detail: service.detail ?? fallback.detail,
      metrics: service.metrics ?? fallback.metrics,
      demo: service.demo ?? fallback.demo,
      tagline: service.tagline ?? fallback.tagline,
    };
  });
}

function DiscoveryStage({ lead }: { lead: Record<string, string> }) {
  const headline = lead.company || lead.name || 'Discovery in progress';
  const subtitle =
    lead.problem ||
    lead.ai_goal ||
    'Share your name, company, problem, and timeline — fields populate live on the right.';

  return (
    <div className="flex h-full flex-col justify-center gap-6 px-2">
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Target className="size-4" />
          Live discovery
        </div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{headline}</h2>
        <p className="text-muted-foreground max-w-xl text-sm leading-6 md:text-base">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {lead.name && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-border bg-background rounded-full border px-3 py-1 text-xs"
          >
            {lead.name}
          </motion.span>
        )}
        {lead.company && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-border bg-background inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
          >
            <Building2 className="size-3.5" />
            {lead.company}
          </motion.span>
        )}
        {lead.problem && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs"
          >
            {lead.problem.length > 48 ? `${lead.problem.slice(0, 48)}…` : lead.problem}
          </motion.span>
        )}
        {lead.timeline && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-400"
          >
            {lead.timeline}
          </motion.span>
        )}
      </div>
    </div>
  );
}

export function VisualStage({ className }: { className?: string }) {
  const { state } = useVisualOrchestrationContext();
  const { state: agentState } = useAgent();

  const services = normalizeServices(
    state.services.length > 0 ? state.services : MANEUVER_SERVICES
  );

  const processSteps =
    state.processSteps.length > 0
      ? state.processSteps.map((title, index) => {
          const catalog = PROCESS_STEPS.find(
            (step) => step.title.toLowerCase() === title.toLowerCase()
          );
          return (
            catalog ?? {
              id: `step-${index}`,
              title,
              description: PROCESS_STEPS[index]?.description ?? '',
            }
          );
        })
      : PROCESS_STEPS;

  return (
    <div
      className={cn(
        'border-border bg-muted/30 relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border p-4 md:min-h-[360px] md:p-6',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <ModeBadge mode={state.mode} />
        <span className="text-muted-foreground font-mono text-[10px] uppercase">
          {agentState ?? 'connecting'}
        </span>
      </div>

      <div className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {state.mode === 'services' && (
            <motion.div
              key={`services-${state.selectedServiceId ?? 'all'}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <ServicesSlideDeck services={services} selectedServiceId={state.selectedServiceId} />
            </motion.div>
          )}

          {state.mode === 'process' && (
            <motion.div
              key={`process-${state.lastEventAt ?? 'default'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ProcessDiagram steps={processSteps} animKey={state.lastEventAt} />
            </motion.div>
          )}

          {state.mode === 'lead_capture' && (
            <motion.div
              key="discovery-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <DiscoveryStage lead={state.lead} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
