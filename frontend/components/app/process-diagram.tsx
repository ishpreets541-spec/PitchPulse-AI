'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ProcessStep } from '@/lib/maneuver-catalog';
import { cn } from '@/lib/shadcn/utils';

export function ProcessDiagram({ steps, animKey }: { steps: ProcessStep[]; animKey?: string }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((_, index) => {
      timers.push(
        setTimeout(
          () => {
            setActiveIndex(index);
          },
          320 + index * 550
        )
      );
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [animKey, steps]);

  const progress = steps.length <= 1 ? 0 : Math.max(0, activeIndex) / (steps.length - 1);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          How Maneuver works
        </p>
        <span className="text-muted-foreground font-mono text-[10px]">
          {activeIndex + 1}/{steps.length}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-x-auto pb-2">
        <div className="relative flex min-w-max items-stretch gap-0 px-1">
          <motion.div
            className="bg-primary/30 absolute top-10 left-8 h-0.5 origin-left rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `calc(${progress * 100}% - 2rem)` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            style={{ maxWidth: 'calc(100% - 4rem)' }}
          />

          {steps.map((step, index) => {
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div key={step.id} className="relative flex items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{
                    opacity: isActive ? 1 : 0.35,
                    y: 0,
                    scale: isCurrent ? 1.03 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className={cn(
                    'border-border bg-background flex w-[200px] flex-col rounded-xl border p-4 shadow-sm md:w-[240px]',
                    isCurrent && 'border-primary ring-primary/20 shadow-md ring-2',
                    isActive && !isCurrent && 'border-primary/40'
                  )}
                >
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.08, 1] : 1,
                    }}
                    transition={
                      isCurrent ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : undefined
                    }
                    className={cn(
                      'mb-2 grid size-8 place-items-center rounded-full text-xs font-bold',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </motion.div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-muted-foreground mt-2 text-xs leading-5">{step.description}</p>
                </motion.div>

                {index < steps.length - 1 && (
                  <div className="text-muted-foreground/50 mt-12 w-6 shrink-0 text-center text-xs">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
