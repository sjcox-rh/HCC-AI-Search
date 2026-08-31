export interface SearchNavTarget {
  route: string;
  filters?: string[];
  query?: string;
}

export type PaletteResultKind =
  | 'playbook'
  | 'action'
  | 'service'
  | 'page'
  | 'documentation'
  | 'cluster'
  | 'host'
  | 'system'
  | 'group'
  | 'suggestion';

export interface PaletteAction {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  nav?: SearchNavTarget;
  playbook?: boolean;
  kind?: PaletteResultKind;
}

export interface AiAnswer {
  summary: string;
  actions: Array<{
    id: string;
    label: string;
    variant?: 'primary' | 'secondary';
    nav?: SearchNavTarget;
    playbook?: boolean;
  }>;
}

export interface SearchResolution {
  answer?: AiAnswer;
  actions: PaletteAction[];
  entities: PaletteAction[];
  docs: PaletteAction[];
}

export const getShortcutLabel = (): string => {
  if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)) {
    return '⌘K';
  }
  return 'Ctrl+K';
};

export const getContextualSuggestions = (pathname: string): PaletteAction[] => {
  if (pathname.includes('alert-manager') || pathname.includes('data-integration')) {
    return [
      {
        id: 'ctx-unread',
        title: 'Show unread alerts for production',
        description: 'Intent: filter Alert Manager to production, unread',
      },
      {
        id: 'ctx-slack',
        title: 'Configure Slack notifications',
        description: 'Open integrations for this page',
        nav: { route: '/data-integration' },
      },
    ];
  }

  if (pathname.includes('user-access') || pathname.includes('/users') || pathname.includes('/groups')) {
    return [
      {
        id: 'ctx-org-admin',
        title: 'Find users with org-admin role',
        description: 'Intent: IAM users filtered by role',
        nav: { route: '/users', filters: ['Role: org-admin'] },
      },
      {
        id: 'ctx-mua',
        title: 'Open My User Access',
        nav: { route: '/my-user-access' },
      },
    ];
  }

  if (pathname === '/overview' || pathname.includes('learning-resources')) {
    return [
      {
        id: 'ctx-cves',
        title: 'Filter critical CVEs across production hosts',
        description: 'Translates to Insights Vulnerability with filter chips',
        nav: { route: '/overview', filters: ['RHEL', 'Critical CVE', 'Production'], query: 'critical CVEs in production' },
      },
      {
        id: 'ctx-patch',
        title: 'Generate patch status report',
        description: 'Summarize patch compliance for managed hosts',
      },
    ];
  }

  return [
    {
      id: 'ctx-home-cve',
      title: 'Show me all RHEL 8 servers with critical CVEs in production',
      description: 'Natural language → filtered host inventory',
    },
    {
      id: 'ctx-home-storage',
      title: 'Which OpenShift clusters are running out of storage?',
      description: 'Natural language → cluster health + capacity',
    },
    {
      id: 'ctx-home-sub',
      title: 'RHEL subscription usage',
      description: 'Maps shorthand to Subscriptions',
      nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
    },
  ];
};

export const recentEntities: PaletteAction[] = [
  {
    id: 'recent-cluster',
    title: 'cluster-prod-openshift-01',
    meta: 'OpenShift 4.16 · Healthy',
    status: 'success',
    kind: 'cluster',
    nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01'] },
  },
  {
    id: 'recent-host',
    title: 'app-server-04',
    meta: 'RHEL 9.3 · 2 Critical Vulnerabilities',
    status: 'danger',
    kind: 'host',
    nav: { route: '/overview', filters: ['Host: app-server-04', 'Critical CVE'] },
  },
  {
    id: 'recent-group',
    title: 'rhel-prod-host-group',
    meta: 'RHEL · 48 systems',
    kind: 'group',
    nav: { route: '/overview', filters: ['Group: rhel-prod-host-group'] },
  },
];

export const activeAlert: PaletteAction = {
  id: 'alert-storage',
  title: 'Storage warning on cluster-01 → Resolve with AI Guidance',
  description: 'Cluster storage is above 90%. Assumed in-scope for this account.',
  status: 'warning',
};

const cveAnswer: AiAnswer = {
  summary:
    'Insights Advisor detected 4 hosts vulnerable to CVE-2024-XXXX. These are RHEL 8 systems in production. Results are limited to resources this account can access.',
  actions: [
    {
      id: 'view-hosts',
      label: 'View Vulnerable Hosts',
      variant: 'primary',
      nav: {
        route: '/overview',
        filters: ['RHEL 8', 'Critical CVE', 'Production'],
        query: 'RHEL 8 servers with critical CVEs in production',
      },
    },
    {
      id: 'gen-playbook',
      label: 'Generate Remediation Playbook',
      variant: 'secondary',
      playbook: true,
    },
  ],
};

const storageAnswer: AiAnswer = {
  summary:
    'cluster-prod-openshift-01 is at 93% persistent volume usage in us-east-1. Lightspeed recommends expanding storage or running a cleanup playbook.',
  actions: [
    {
      id: 'open-cluster',
      label: 'Open cluster',
      variant: 'primary',
      nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01', 'Storage > 90%'] },
    },
    {
      id: 'ai-guidance',
      label: 'Resolve with AI Guidance',
      variant: 'secondary',
    },
  ],
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const includesNormalized = (haystack: string, needle: string): boolean => {
  const h = normalize(haystack);
  const n = normalize(needle);
  return n.length > 0 && (h === n || h.includes(n));
};

interface SearchableService {
  id: string;
  name: string;
  aliases: string[];
  landing: PaletteAction;
  related: PaletteAction[];
  gettingStartedIds?: string[];
}

const asLanding = (action: PaletteAction): PaletteAction => ({
  ...action,
  kind: 'service',
  meta: action.meta || 'Landing page',
});

const asPage = (action: PaletteAction): PaletteAction => ({
  ...action,
  kind: 'page',
  meta: action.meta || 'Related page',
});

const searchableServices: SearchableService[] = [
  {
    id: 'hcc',
    name: 'Red Hat Hybrid Cloud Console',
    aliases: ['hybrid cloud console', 'hcc', 'console.redhat.com', 'cloud console'],
    landing: asLanding({
      id: 'svc-hcc',
      title: 'Red Hat Hybrid Cloud Console',
      nav: { route: '/' },
    }),
    related: [
      asPage({ id: 'rel-hcc-services', title: 'All Services', nav: { route: '/all-services' } }),
      asPage({ id: 'rel-hcc-learn', title: 'Learning Resources', nav: { route: '/learning-resources' } }),
    ],
    gettingStartedIds: ['gs-hcc'],
  },
  {
    id: 'rhel',
    name: 'Red Hat Enterprise Linux',
    aliases: ['red hat enterprise linux', 'rhel', 'enterprise linux'],
    landing: asLanding({
      id: 'svc-rhel',
      title: 'Red Hat Enterprise Linux',
      nav: { route: '/overview' },
    }),
    related: [
      asPage({ id: 'rel-rhel-overview', title: 'Overview', nav: { route: '/overview' } }),
      asPage({
        id: 'rel-rhel-subs',
        title: 'Subscriptions',
        nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
      }),
      asPage({ id: 'rel-rhel-learn', title: 'Learning Resources', nav: { route: '/learning-resources' } }),
    ],
    gettingStartedIds: ['gs-rhel-reg', 'gs-insights'],
  },
  {
    id: 'openshift',
    name: 'Red Hat OpenShift',
    aliases: ['red hat openshift', 'openshift', 'ocp', 'rosa'],
    landing: asLanding({
      id: 'svc-openshift',
      title: 'Red Hat OpenShift',
      nav: { route: '/overview', filters: ['OpenShift'] },
    }),
    related: [
      asPage({
        id: 'rel-oshift-clusters',
        title: 'Clusters',
        nav: { route: '/overview', filters: ['OpenShift', 'Clusters'] },
      }),
      asPage({ id: 'rel-oshift-learn', title: 'Learning Resources', nav: { route: '/learning-resources' } }),
    ],
  },
  {
    id: 'insights',
    name: 'Red Hat Insights',
    aliases: ['red hat insights', 'insights', 'insights advisor'],
    landing: asLanding({
      id: 'svc-insights',
      title: 'Red Hat Insights',
      nav: { route: '/overview', filters: ['Insights'] },
    }),
    related: [
      asPage({ id: 'rel-insights-overview', title: 'Overview', nav: { route: '/overview' } }),
      asPage({ id: 'rel-insights-learn', title: 'Learning Resources', nav: { route: '/learning-resources' } }),
    ],
    gettingStartedIds: ['gs-insights'],
  },
  {
    id: 'alerting',
    name: 'Alerting & Data Integrations',
    aliases: ['alerting', 'alert manager', 'alerts', 'notifications', 'data integration', 'data integrations'],
    landing: asLanding({
      id: 'svc-alerting',
      title: 'Alert Manager',
      nav: { route: '/alert-manager' },
    }),
    related: [
      asPage({ id: 'rel-alert-integrations', title: 'Data Integration', nav: { route: '/data-integration' } }),
      asPage({ id: 'rel-alert-events', title: 'Event Log', nav: { route: '/event-log' } }),
    ],
  },
  {
    id: 'iam',
    name: 'Identity & Access Management',
    aliases: ['identity', 'iam', 'user access', 'identity and access', 'identity & access'],
    landing: asLanding({
      id: 'svc-iam',
      title: 'User Access',
      nav: { route: '/user-access' },
    }),
    related: [
      asPage({ id: 'rel-iam-mua', title: 'My User Access', nav: { route: '/my-user-access' } }),
      asPage({ id: 'rel-iam-users', title: 'Users', nav: { route: '/users' } }),
      asPage({ id: 'rel-iam-groups', title: 'Groups', nav: { route: '/groups' } }),
      asPage({ id: 'rel-iam-roles', title: 'Roles', nav: { route: '/roles' } }),
      asPage({ id: 'rel-iam-workspaces', title: 'Workspaces', nav: { route: '/workspaces' } }),
      asPage({ id: 'rel-iam-sa', title: 'Service Accounts', nav: { route: '/service-accounts' } }),
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    aliases: ['automation', 'ansible', 'ansible automation', 'automation hub', 'playbooks'],
    landing: asLanding({
      id: 'svc-automation',
      title: 'Automation',
      nav: { route: '/all-services' },
    }),
    related: [
      asPage({ id: 'rel-auto-learn', title: 'Learning Resources', nav: { route: '/learning-resources' } }),
    ],
    gettingStartedIds: ['gs-automation'],
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions & Spend',
    aliases: ['subscriptions', 'subscription', 'spend', 'hybrid committed spend'],
    landing: asLanding({
      id: 'svc-subs',
      title: 'Subscriptions & Spend',
      nav: { route: '/overview', filters: ['Subscriptions'] },
    }),
    related: [
      asPage({
        id: 'rel-subs-rhel',
        title: 'RHEL subscription usage',
        nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
      }),
    ],
    gettingStartedIds: ['gs-spend', 'gs-rhel-reg'],
  },
];

const gettingStartedDocs: PaletteAction[] = [
  {
    id: 'gs-hcc',
    title: 'Getting started with the Red Hat Hybrid Cloud Console',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'gs-insights',
    title: 'Getting started with Red Hat Insights',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'gs-automation',
    title: 'Getting started with automation hub',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'gs-spend',
    title: 'Getting started with hybrid committed spend',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'gs-rhel-reg',
    title: 'Getting started with RHEL system registration',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
];

const relevantDocs: PaletteAction[] = [
  {
    id: 'doc-oshift-console',
    title: 'Learn about OpenShift cluster services on the console',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'doc-oshift-ocp',
    title: 'Learn about OpenShift Container Platform',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'doc-notifications',
    title: 'Configuring notifications and integrations',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
];

interface InventoryRecord {
  item: PaletteAction;
  tags: string[];
  serviceIds: string[];
}

const inventoryRecords: InventoryRecord[] = [
  {
    serviceIds: ['openshift', 'hcc'],
    tags: ['openshift', 'cluster', 'production', 'healthy'],
    item: {
      id: 'inv-cluster-prod',
      title: 'cluster-prod-openshift-01',
      meta: 'OpenShift 4.16 · Healthy',
      status: 'success',
      kind: 'cluster',
      nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01'] },
    },
  },
  {
    serviceIds: ['openshift'],
    tags: ['openshift', 'cluster', 'stage', 'rosa'],
    item: {
      id: 'inv-cluster-stage',
      title: 'cluster-stage-openshift-02',
      meta: 'OpenShift 4.15 · Degraded',
      status: 'warning',
      kind: 'cluster',
      nav: { route: '/overview', filters: ['Cluster: cluster-stage-openshift-02'] },
    },
  },
  {
    serviceIds: ['openshift'],
    tags: ['openshift', 'cluster', 'rosa', 'aws', 'production'],
    item: {
      id: 'inv-cluster-rosa',
      title: 'rosa-prod-us-east-1',
      meta: 'ROSA · us-east-1 · 12 nodes',
      status: 'success',
      kind: 'cluster',
      nav: { route: '/overview', filters: ['Cluster: rosa-prod-us-east-1', 'OpenShift'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights', 'hcc'],
    tags: ['rhel', 'host', 'server', 'cve', 'production', 'insights'],
    item: {
      id: 'inv-host-app',
      title: 'app-server-04',
      meta: 'RHEL 9.3 · 2 Critical Vulnerabilities',
      status: 'danger',
      kind: 'host',
      nav: { route: '/overview', filters: ['Host: app-server-04', 'Critical CVE'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights'],
    tags: ['rhel', 'host', 'server', 'web', 'production'],
    item: {
      id: 'inv-host-web',
      title: 'web-server-01',
      meta: 'RHEL 8.10 · Production · Insights connected',
      status: 'success',
      kind: 'host',
      nav: { route: '/overview', filters: ['Host: web-server-01', 'RHEL 8'] },
    },
  },
  {
    serviceIds: ['rhel'],
    tags: ['rhel', 'host', 'server', 'database'],
    item: {
      id: 'inv-host-db',
      title: 'db-server-07',
      meta: 'RHEL 9.4 · Storage 71%',
      kind: 'host',
      nav: { route: '/overview', filters: ['Host: db-server-07'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights', 'subscriptions'],
    tags: ['rhel', 'system', 'insights', 'registered'],
    item: {
      id: 'inv-system-edge',
      title: 'rhel-edge-system-12',
      meta: 'RHEL 9.3 · Edge · Registered',
      kind: 'system',
      nav: { route: '/overview', filters: ['System: rhel-edge-system-12'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights'],
    tags: ['rhel', 'system', 'insights', 'production'],
    item: {
      id: 'inv-system-prod',
      title: 'insights-client-prod-03',
      meta: 'RHEL 8.9 · Insights client · Last seen 12m',
      kind: 'system',
      nav: { route: '/overview', filters: ['System: insights-client-prod-03'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights'],
    tags: ['rhel', 'group', 'systems', 'production'],
    item: {
      id: 'inv-group-rhel',
      title: 'rhel-prod-host-group',
      meta: 'RHEL · 48 systems',
      kind: 'group',
      nav: { route: '/overview', filters: ['Group: rhel-prod-host-group'] },
    },
  },
  {
    serviceIds: ['openshift'],
    tags: ['openshift', 'group', 'clusters'],
    item: {
      id: 'inv-group-oshift',
      title: 'openshift-prod-workspaces',
      meta: 'OpenShift · 3 clusters',
      kind: 'group',
      nav: { route: '/overview', filters: ['Group: openshift-prod-workspaces'] },
    },
  },
  {
    serviceIds: ['rhel', 'insights', 'automation'],
    tags: ['rhel', 'playbook', 'patch', 'cve', 'ansible'],
    item: {
      id: 'inv-pb-patch',
      title: 'Patch RHEL 9 Glitch',
      description: 'Ansible playbook · remediates kernel CVEs',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: ['openshift', 'automation'],
    tags: ['openshift', 'playbook', 'storage', 'ansible'],
    item: {
      id: 'inv-pb-storage',
      title: 'Expand OpenShift persistent storage',
      description: 'Ansible playbook · cluster storage cleanup and expand',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: ['rhel', 'insights', 'automation'],
    tags: ['rhel', 'playbook', 'cve', 'remediation', 'ansible'],
    item: {
      id: 'inv-pb-cve',
      title: 'Remediate critical CVEs on production hosts',
      description: 'Ansible playbook · Insights remediation',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: ['alerting', 'automation'],
    tags: ['alerts', 'playbook', 'slack', 'notifications', 'ansible'],
    item: {
      id: 'inv-pb-slack',
      title: 'Configure Slack alert notifications',
      description: 'Ansible playbook · Alert Manager integration',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: ['rhel', 'subscriptions', 'automation'],
    tags: ['rhel', 'playbook', 'registration', 'subscription', 'ansible'],
    item: {
      id: 'inv-pb-register',
      title: 'Register RHEL systems with Insights',
      description: 'Ansible playbook · rhc / insights-client',
      playbook: true,
      kind: 'playbook',
    },
  },
];

const kindKeywords: Partial<Record<PaletteResultKind, string[]>> = {
  cluster: ['cluster', 'clusters'],
  host: ['host', 'hosts', 'server', 'servers'],
  system: ['system', 'systems'],
  group: ['group', 'groups'],
  playbook: ['playbook', 'playbooks'],
};

const recordMatches = (record: InventoryRecord, query: string, service?: SearchableService): boolean => {
  const q = normalize(query);
  if (service && record.serviceIds.includes(service.id)) {
    return true;
  }

  const kind = record.item.kind;
  if (kind && kindKeywords[kind]?.some((keyword) => q === keyword || q.split(' ').includes(keyword))) {
    return true;
  }

  const haystack = normalize(
    [record.item.title, record.item.meta, record.item.description, ...(record.tags || [])].join(' '),
  );
  const tokens = q.split(' ').filter((token) => token.length >= 3);
  return tokens.some((token) => haystack.includes(token));
};

const findRelevantInventory = (
  query: string,
  service?: SearchableService,
): { playbooks: PaletteAction[]; entities: PaletteAction[] } => {
  const matched = inventoryRecords.filter((record) => recordMatches(record, query, service)).map((record) => record.item);
  return {
    playbooks: matched.filter((item) => item.kind === 'playbook' || item.playbook),
    entities: matched.filter((item) => item.kind !== 'playbook' && !item.playbook),
  };
};

const findBestService = (query: string): SearchableService | undefined => {
  const q = normalize(query);
  let best: { service: SearchableService; score: number } | undefined;

  searchableServices.forEach((service) => {
    const names = [service.name, ...service.aliases];
    names.forEach((name) => {
      const n = normalize(name);
      if (!n) {
        return;
      }
      let score = 0;
      if (q === n) {
        score = n.length + 20;
      } else if (q.includes(n)) {
        score = n.length + 10;
      } else if (n.includes(q) && q.length >= 3) {
        score = q.length;
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { service, score };
      }
    });
  });

  return best?.service;
};

const findGettingStartedDocs = (query: string, service?: SearchableService): PaletteAction[] => {
  const terms = [query, service?.name, ...(service?.aliases || [])].filter(Boolean) as string[];
  const linked = new Set(service?.gettingStartedIds || []);

  return gettingStartedDocs.filter((doc) => {
    if (linked.has(doc.id)) {
      return true;
    }
    return terms.some((term) => {
      const t = normalize(term);
      if (t.length < 3) {
        return false;
      }
      return includesNormalized(doc.title, t);
    });
  });
};

const findRelevantDocs = (query: string, service?: SearchableService): PaletteAction[] => {
  const terms = [query, service?.name, ...(service?.aliases || [])].filter(Boolean) as string[];

  return relevantDocs.filter((doc) =>
    terms.some((term) => {
      const t = normalize(term);
      return t.length >= 3 && includesNormalized(doc.title, t);
    }),
  );
};

const dedupeById = (items: PaletteAction[]): PaletteAction[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

export const resolveQuery = (query: string): SearchResolution => {
  const q = query.trim().toLowerCase();

  if (!q) {
    return { actions: [], entities: [], docs: [] };
  }

  const service = findBestService(q);
  const gettingStarted = findGettingStartedDocs(q, service);
  const extraDocs = findRelevantDocs(q, service);
  const inventory = findRelevantInventory(q, service);

  const isCve =
    q.includes('cve') ||
    q.includes('vulnerab') ||
    (q.includes('critical') && (q.includes('rhel') || q.includes('host') || q.includes('server'))) ||
    q.includes('fix');

  const isStorage = q.includes('storage') || q.includes('running out') || q.includes('capacity');
  const isSub = q.includes('subscription') || (q.includes('usage') && (q.includes('rhel') || q.includes('subscription')));

  let intent: SearchResolution = { actions: [], entities: [], docs: [] };

  if (isCve) {
    intent = {
      answer: cveAnswer,
      actions: [
        {
          id: 'act-terminal',
          title: "Launch Web Console terminal for 'prod-us-east-1'",
          description: 'Inline action · assumed you have cluster-admin',
          kind: 'action',
        },
        {
          id: 'act-playbook',
          title: 'Trigger Ansible Playbook: Patch RHEL 9 Glitch',
          description: 'Run remediation without leaving search',
          playbook: true,
          kind: 'playbook',
        },
      ],
      entities: [
        {
          id: 'ent-cluster',
          title: 'cluster-prod-openshift-01',
          meta: 'OpenShift 4.16 · Healthy',
          status: 'success',
          kind: 'cluster',
          nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01'] },
        },
        {
          id: 'ent-host',
          title: 'app-server-04',
          meta: 'RHEL 9.3 · 2 Critical Vulnerabilities',
          status: 'danger',
          kind: 'host',
          nav: { route: '/overview', filters: ['Host: app-server-04', 'Critical CVE'] },
        },
      ],
      docs: [
        {
          id: 'doc-kb',
          title: 'KB Article: How to configure Ansible Lightspeed with local LLM gateways',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
      ],
    };
  } else if (isStorage) {
    intent = {
      answer: storageAnswer,
      actions: [
        {
          id: 'act-terminal-storage',
          title: "Launch Web Console terminal for 'prod-us-east-1'",
          kind: 'action',
        },
        {
          id: 'act-expand',
          title: 'Open storage capacity dashboard',
          kind: 'page',
          meta: 'Related page',
          nav: { route: '/overview', filters: ['Storage', 'OpenShift'] },
        },
      ],
      entities: [
        {
          id: 'ent-cluster-storage',
          title: 'cluster-prod-openshift-01',
          meta: 'OpenShift 4.16 · Storage 93%',
          status: 'warning',
          kind: 'cluster',
          nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01'] },
        },
      ],
      docs: [
        {
          id: 'doc-storage',
          title: 'Managing persistent storage in OpenShift',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
      ],
    };
  } else if (isSub) {
    intent = {
      answer: {
        summary:
          '“RHEL subscription usage” maps to Subscriptions on Hybrid Cloud Console. Showing usage for the current organization.',
        actions: [
          {
            id: 'open-subs',
            label: 'Open subscription usage',
            variant: 'primary',
            nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
          },
        ],
      },
      actions: [],
      entities: [],
      docs: [],
    };
  }

  const serviceActions = service ? [service.landing, ...service.related] : [];
  const actions = dedupeById([...serviceActions, ...inventory.playbooks, ...intent.actions]);
  const entities = dedupeById([...inventory.entities, ...intent.entities]);
  const docs = dedupeById([...gettingStarted, ...extraDocs, ...intent.docs]);

  if (!intent.answer && actions.length === 0 && entities.length === 0 && docs.length === 0) {
    return { actions: [], entities: [], docs: [] };
  }

  return {
    answer: intent.answer,
    actions,
    entities,
    docs,
  };
};
