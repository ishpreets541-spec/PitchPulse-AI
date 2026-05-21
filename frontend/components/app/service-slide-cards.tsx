'use client';

import { Phone, Sparkles, Workflow, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import type { ManeuverService } from '@/lib/maneuver-catalog';
import { cn } from '@/lib/shadcn/utils';

const iconByService: Record<string, typeof Workflow> = {
  'agentic-ai': Workflow,
  'voice-ai': Phone,
  'self-learning-ai': Sparkles,
};

function ServiceIcon({ id }: { id: string }) {
  const Icon = iconByService[id] ?? Zap;
  return <Icon className="size-4 shrink-0" />;
}

export function ServiceSlideCard({
  service,
  focused = false,
  compact = false,
  layoutId,
}: {
  service: ManeuverService;
  focused?: boolean;
  compact?: boolean;
  layoutId?: string;
}) {
  return (
    <motion.article
      layoutId={layoutId}
      layout
      initial={{ opacity: 0, y: focused ? 20 : 12 }}
      animate={{ opacity: 1, y: 0, scale: focused ? 1 : compact ? 0.98 : 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={cn(
        'flex flex-col rounded-xl border shadow-sm',
        focused
          ? 'border-primary bg-primary text-primary-foreground min-h-[220px] p-5 shadow-lg md:p-6'
          : 'border-border bg-background/90 p-4',
        compact && !focused && 'p-3'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          {service.tagline && !focused && (
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              {service.tagline}
            </p>
          )}
          <h3 className={cn('font-semibold', focused ? 'text-xl md:text-2xl' : 'text-sm')}>
            {service.name}
          </h3>
        </div>
        <div
          className={cn(
            'grid size-8 place-items-center rounded-lg',
            focused ? 'bg-primary-foreground/15' : 'bg-muted'
          )}
        >
          <ServiceIcon id={service.id} />
        </div>
      </div>

      <p
        className={cn(
          'mt-3 leading-6',
          focused
            ? 'text-primary-foreground/90 text-sm md:text-base'
            : 'text-muted-foreground text-xs'
        )}
      >
        {focused ? service.detail : service.short}
      </p>

      {service.metrics && service.metrics.length > 0 && (
        <div
          className={cn(
            'mt-4 grid gap-2',
            focused ? 'grid-cols-3' : 'grid-cols-3',
            !focused && 'mt-3'
          )}
        >
          {service.metrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                'rounded-lg px-2 py-2 text-center',
                focused ? 'bg-primary-foreground/10' : 'bg-muted'
              )}
            >
              <p className={cn('font-bold', focused ? 'text-lg' : 'text-sm')}>{metric.value}</p>
              <p
                className={cn(
                  'mt-0.5 text-[10px] leading-4',
                  focused ? 'text-primary-foreground/75' : 'text-muted-foreground'
                )}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {service.demo && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-3',
            focused
              ? 'border-primary-foreground/25 bg-primary-foreground/10'
              : 'border-border bg-muted/50'
          )}
        >
          <p
            className={cn(
              'text-[10px] font-bold tracking-wider uppercase',
              focused ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {service.demo.label}
          </p>
          <p className={cn('mt-2 font-medium', focused ? 'text-sm' : 'text-xs')}>Customer query</p>
          <p
            className={cn(
              'mt-1 italic',
              focused ? 'text-primary-foreground/90 text-sm' : 'text-muted-foreground text-xs'
            )}
          >
            &ldquo;{service.demo.query}&rdquo;
          </p>
        </div>
      )}
    </motion.article>
  );
}

export function ServicesSlideDeck({
  services,
  selectedServiceId,
}: {
  services: ManeuverService[];
  selectedServiceId?: string;
}) {
  const selected = services.find((service) => service.id === selectedServiceId);

  if (selected) {
    const others = services.filter((service) => service.id !== selected.id);

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        >
          Zoomed in
        </motion.p>
        <ServiceSlideCard service={selected} focused layoutId={`service-card-${selected.id}`} />
        {others.length > 0 && (
          <div className="grid min-h-0 flex-1 gap-2 overflow-y-auto sm:grid-cols-2">
            {others.slice(0, 4).map((service) => (
              <ServiceSlideCard
                key={service.id}
                service={service}
                compact
                layoutId={`service-card-${service.id}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        What Maneuver offers
      </p>
      <div className="flex min-h-0 flex-1 snap-x snap-mandatory [scrollbar-width:thin] gap-3 overflow-x-auto pb-2">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
            className="w-[min(88vw,300px)] shrink-0 snap-center sm:w-[280px]"
          >
            <ServiceSlideCard service={service} layoutId={`service-card-${service.id}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
