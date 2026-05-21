export interface ServiceMetric {
  value: string;
  label: string;
}

export interface ServiceDemo {
  label: string;
  query: string;
}

export interface ManeuverService {
  id: string;
  name: string;
  tagline?: string;
  short: string;
  detail: string;
  metrics?: ServiceMetric[];
  demo?: ServiceDemo;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export const MANEUVER_SERVICES: ManeuverService[] = [
  {
    id: 'agentic-ai',
    name: 'Intelligent Workflows',
    tagline: 'Agentic AI',
    short: 'Connect your tools into seamless automated workflows to truly leverage AI.',
    detail:
      'Workflow agents that coordinate your existing stack, trigger actions across systems, and remove repetitive operating work — deployed in weeks, not quarters.',
    metrics: [
      { value: '40%', label: 'reduction in manual work' },
      { value: '30%', label: 'efficiency increase' },
      { value: '10x', label: 'faster iteration' },
    ],
  },
  {
    id: 'voice-ai',
    name: 'Voice AI',
    tagline: 'Voice AI Concierge',
    short:
      'Custom voice agents in Arabic and English that handle inbound calls 24/7. Integrated with your CRM and booking systems.',
    detail:
      'Sounds like your team, not a robot. Handles qualification, booking, and support while syncing every call into your CRM.',
    demo: {
      label: 'Incoming call',
      query: 'What are your lending rates?',
    },
  },
  {
    id: 'self-learning-ai',
    name: 'Self-Learning AI Agents',
    short:
      'Intelligent assistants that handle enquiries, route requests, and free your team for higher-value work.',
    detail:
      'Agents that improve from real conversations and outcomes — routing, triaging, and resolving routine work so operators focus on exceptions.',
  },
  {
    id: 'bespoke-apps',
    name: 'Bespoke Applications',
    short:
      'Systems built from scratch, not stitched together. We consolidate your scattered tools into one custom application.',
    detail:
      'Your IP, designed around how you actually work — one system instead of spreadsheets, SaaS sprawl, and manual handoffs.',
  },
  {
    id: 'systems-integration',
    name: 'Systems Integration',
    short:
      'Connect AI to your existing tools — CRM, email, databases, and more. One unified system.',
    detail:
      'The plumbing layer: CRM, inboxes, databases, automations, and AI agents stitched into one reliable operating system.',
  },
  {
    id: 'ai-readiness',
    name: 'AI Readiness Sprint',
    short: 'A two-week diagnostic that turns AI ambiguity into a costed, prioritized roadmap.',
    detail:
      'For founders who know AI matters but need priorities, cost, risk, and first projects clarified fast.',
  },
  {
    id: 'fractional-cto',
    name: 'Fractional CTO',
    short: 'Practical tech strategy and vendor ownership without a full-time hire.',
    detail:
      'Senior judgment on architecture, vendors, and delivery — without a six-figure full-time CTO.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'understand',
    title: 'Understand',
    description:
      "We start by listening. What's working, what's not, where the pressure points are. No assumptions — just a clear picture of where you are.",
  },
  {
    id: 'design-build',
    title: 'Design & Build',
    description:
      'We identify the highest-impact opportunities and build systems that solve real problems. Not prototypes, but things your team will actually use.',
  },
  {
    id: 'launch-evolve',
    title: 'Launch & Evolve',
    description:
      'We deploy, refine, and stay with you. The best systems improve over time — and so do the best partnerships.',
  },
];

export const SERVICE_ALIASES: Record<string, string> = {
  'intelligent workflows': 'agentic-ai',
  'intelligent workflow': 'agentic-ai',
  'agentic ai': 'agentic-ai',
  agentic: 'agentic-ai',
  workflows: 'agentic-ai',
  'voice ai': 'voice-ai',
  voice: 'voice-ai',
  concierge: 'voice-ai',
  'self-learning': 'self-learning-ai',
  'self learning': 'self-learning-ai',
  enquiries: 'self-learning-ai',
  bespoke: 'bespoke-apps',
  applications: 'bespoke-apps',
  integration: 'systems-integration',
  integrations: 'systems-integration',
  readiness: 'ai-readiness',
  sprint: 'ai-readiness',
  cto: 'fractional-cto',
  'fractional cto': 'fractional-cto',
};

export function resolveServiceId(query: string): string {
  const normalized = query.trim().toLowerCase();
  if (SERVICE_ALIASES[normalized]) {
    return SERVICE_ALIASES[normalized];
  }

  const byAlias = Object.entries(SERVICE_ALIASES).find(([alias]) => normalized.includes(alias));
  if (byAlias) {
    return byAlias[1];
  }

  const match = MANEUVER_SERVICES.find(
    (service) =>
      normalized.includes(service.id.replace(/-/g, ' ')) ||
      normalized.includes(service.name.toLowerCase()) ||
      (service.tagline && normalized.includes(service.tagline.toLowerCase()))
  );

  return match?.id ?? MANEUVER_SERVICES[0].id;
}

export function getServiceById(id: string): ManeuverService {
  return MANEUVER_SERVICES.find((service) => service.id === id) ?? MANEUVER_SERVICES[0];
}

/** Primary discovery fields shown prominently in the side panel */
export const DISCOVERY_FIELD_DEFS = [
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'problem', label: 'Problem' },
  { key: 'timeline', label: 'Timeline' },
] as const;
