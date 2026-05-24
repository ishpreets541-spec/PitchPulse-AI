'use client';

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useDataChannel, useRoomContext } from '@livekit/components-react';
import { MANEUVER_SERVICES, type ManeuverService, PROCESS_STEPS } from '@/lib/maneuver-catalog';

export const VISUAL_TOPIC = 'maneuver.visual';
export const VISUAL_RPC_METHOD = 'maneuver.visual.update';

const VISUAL_RPC_METHODS = [
  VISUAL_RPC_METHOD,
  'state_sync',
  'show_services_slide',
  'show_service_detail',
  'show_process_diagram',
  'update_lead_field',
  'save_lead_summary',
] as const;

export type VisualMode = 'services' | 'process' | 'lead_capture';

export type ServiceCard = ManeuverService;

export const LEAD_FIELD_DEFS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'company', label: 'Company' },
  { key: 'company_size', label: 'Company size' },
  { key: 'ai_goal', label: 'AI goal' },
  { key: 'problem', label: 'Problem' },
  { key: 'technical_capacity', label: 'Technical capacity' },
  { key: 'tried_before', label: 'Tried before' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'budget', label: 'Budget' },
  { key: 'decision_process', label: 'Decision process' },
  { key: 'next_step', label: 'Next step' },
] as const;

export interface VisualState {
  mode: VisualMode;
  services: ServiceCard[];
  selectedServiceId?: string;
  processSteps: string[];
  lead: Record<string, string>;
  summary?: string;
  lastEventType?: string;
  lastEventAt?: string;
  lastLeadField?: string;
}

interface VisualEvent {
  source?: string;
  type?: string;
  mode?: VisualMode;
  payload?: {
    services?: ServiceCard[];
    service?: ServiceCard;
    steps?: string[];
    field?: string;
    value?: string;
    lead?: Record<string, string>;
    summary?: string;
  };
  state?: {
    mode?: VisualMode;
    selected_service?: string | null;
    lead?: Record<string, string>;
    updated_at?: string;
  };
}

export const DEFAULT_SERVICES: ServiceCard[] = MANEUVER_SERVICES;

export const DEFAULT_PROCESS_STEPS = PROCESS_STEPS.map((step) => step.title);

const INITIAL_STATE: VisualState = {
  mode: 'lead_capture',
  services: DEFAULT_SERVICES,
  processSteps: DEFAULT_PROCESS_STEPS,
  lead: {},
};

function decodePayload(payload: Uint8Array) {
  return new TextDecoder().decode(payload);
}

function parseVisualEvent(payload: string) {
  const event = JSON.parse(payload) as VisualEvent;

  if (event.source !== 'maneuver-agent') {
    return null;
  }

  return event;
}

function visualReducer(state: VisualState, event: VisualEvent): VisualState {
  const payload = event.payload ?? {};
  const nextMode = event.mode ?? event.state?.mode ?? state.mode;
  const nextLead = {
    ...state.lead,
    ...(event.state?.lead ?? {}),
    ...(payload.lead ?? {}),
  };

  let lastLeadField = state.lastLeadField;

  if (payload.field && typeof payload.value === 'string') {
    nextLead[payload.field] = payload.value;
    lastLeadField = payload.field;
  }

  const nextServices = payload.services?.length ? payload.services : state.services;
  const selectedServiceId =
    payload.service?.id ?? event.state?.selected_service ?? state.selectedServiceId;

  return {
    ...state,
    mode: nextMode,
    services: nextServices,
    selectedServiceId: selectedServiceId ?? undefined,
    processSteps: payload.steps ?? state.processSteps,
    lead: nextLead,
    summary: payload.summary ?? state.summary,
    lastEventType: event.type,
    lastEventAt: event.state?.updated_at ?? new Date().toISOString(),
    lastLeadField,
  };
}

export function useVisualOrchestration() {
  const room = useRoomContext();
  const [state, dispatch] = useReducer(visualReducer, INITIAL_STATE);

  const handleMessage = useCallback((message: { payload: Uint8Array }) => {
    try {
      const event = parseVisualEvent(decodePayload(message.payload));

      if (!event) {
        return;
      }

      dispatch(event);
    } catch (error) {
      console.warn('Ignoring invalid visual event', error);
    }
  }, []);

  useDataChannel(VISUAL_TOPIC, handleMessage);

  useEffect(() => {
    if (!room) {
      return;
    }

    const handleRpcEvent = async ({ payload }: { payload: string }) => {
      const event = parseVisualEvent(payload);

      if (!event) {
        return JSON.stringify({ ok: false, ignored: true });
      }

      dispatch(event);
      return JSON.stringify({ ok: true, applied: event.type });
    };

    for (const method of VISUAL_RPC_METHODS) {
      room.localParticipant.registerRpcMethod(method, handleRpcEvent);
    }

    return () => {
      for (const method of VISUAL_RPC_METHODS) {
        room.localParticipant.unregisterRpcMethod(method);
      }
    };
  }, [room]);

  return useMemo(
    () => ({
      state,
      setMode: (mode: VisualMode) => dispatch({ mode, type: 'manual_mode_change' }),
    }),
    [state]
  );
}
