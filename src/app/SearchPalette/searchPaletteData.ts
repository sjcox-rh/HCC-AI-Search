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
  access?: 'granted' | 'restricted';
  owner?: string;
  requestAccess?: SearchNavTarget;
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

export const commonActions: PaletteAction[] = [
  {
    id: 'common-register-rhel',
    title: 'Register RHEL host',
    meta: 'Start system registration',
    kind: 'action',
    nav: { route: '/overview', filters: ['RHEL', 'Register host'] },
  },
  {
    id: 'common-subscription-usage',
    title: 'View Subscription usage',
    meta: 'Open organization usage',
    kind: 'action',
    nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
  },
  {
    id: 'common-invite-user',
    title: 'Invite a user',
    meta: 'Identity & Access',
    kind: 'action',
    nav: { route: '/users' },
  },
  {
    id: 'common-view-alerts',
    title: 'View alerts',
    meta: 'Alert Manager',
    kind: 'action',
    nav: { route: '/alert-manager' },
  },
];

export type ServiceNavGroupId = 'Platforms' | 'Services';

export interface ServiceNavItem {
  id: string;
  name: string;
  group: ServiceNavGroupId;
  icon: 'wrench' | 'server' | 'cube' | 'star' | 'brain' | 'bell' | 'rocket' | 'users' | 'list' | 'eye' | 'play' | 'shield' | 'credit-card';
  isLink?: boolean;
  url?: string;
  description?: string;
  details?: string;
  features?: string[];
}

export const serviceNavItems: ServiceNavItem[] = [
  {
    id: 'ansible',
    name: 'Red Hat Ansible Automation Platform',
    group: 'Platforms',
    icon: 'wrench',
    isLink: true,
    url: '/ansible-automation-platform',
  },
  {
    id: 'rhel',
    name: 'Red Hat Enterprise Linux',
    group: 'Platforms',
    icon: 'server',
    isLink: true,
    url: '/red-hat-enterprise-linux',
  },
  {
    id: 'openshift',
    name: 'Red Hat OpenShift',
    group: 'Platforms',
    icon: 'cube',
    isLink: true,
    url: '/red-hat-openshift',
  },
  {
    id: 'my-favorite-services',
    name: 'My Favorite Services',
    group: 'Services',
    icon: 'star',
    description: 'Quick access to your most-used services',
    details:
      'Access your frequently used and bookmarked services in one convenient location. Customize your dashboard with the services you use most often to improve your workflow efficiency.',
    features: ['Quick Access', 'Custom Dashboard', 'Service Bookmarks', 'Usage Analytics'],
  },
  {
    id: 'ai-ml',
    name: 'AI/ML',
    group: 'Services',
    icon: 'brain',
    description: 'Artificial intelligence and machine learning services',
    details:
      'Build, train, and deploy machine learning models with enterprise-grade AI/ML platforms. Access GPU-accelerated computing, automated model training, and MLOps pipelines.',
    features: ['Model Training', 'GPU Computing', 'MLOps Pipelines', 'Data Science Workbenches'],
  },
  {
    id: 'alerting-data-integrations',
    name: 'Alerting & Data Integrations',
    group: 'Services',
    icon: 'bell',
    description: 'Monitoring alerts and data pipeline management',
    details:
      'Configure intelligent alerting systems and manage data integration workflows across your hybrid cloud infrastructure with real-time monitoring and automated responses.',
    features: ['Real-time Alerts', 'Data Pipelines', 'Integration Workflows', 'Event Processing'],
  },
  {
    id: 'automation',
    name: 'Automation',
    group: 'Services',
    icon: 'wrench',
    description: 'Infrastructure and application automation',
    details:
      'Automate repetitive tasks, configuration management, and deployment processes with comprehensive automation tools and workflow orchestration.',
    features: ['Task Automation', 'Configuration Management', 'Workflow Orchestration', 'Process Optimization'],
  },
  {
    id: 'containers',
    name: 'Containers',
    group: 'Services',
    icon: 'cube',
    description: 'Container management and orchestration',
    details:
      'Deploy, manage, and scale containerized applications with enterprise Kubernetes platforms, container registries, and orchestration tools.',
    features: ['Container Orchestration', 'Registry Management', 'Application Scaling', 'Service Mesh'],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    group: 'Services',
    icon: 'rocket',
    description: 'Application deployment and delivery',
    details:
      'Streamline application deployment with CI/CD pipelines, automated testing, and progressive delivery strategies across multiple environments.',
    features: ['CI/CD Pipelines', 'Automated Testing', 'Progressive Delivery', 'Environment Management'],
  },
  {
    id: 'identity-access-mgmt',
    name: 'Identity & Access Management',
    group: 'Services',
    icon: 'users',
    description: 'User authentication and authorization',
    details:
      'Secure your applications with comprehensive identity management, single sign-on, multi-factor authentication, and role-based access controls.',
    features: ['Single Sign-On', 'Multi-Factor Auth', 'Role-Based Access', 'Identity Federation'],
  },
  {
    id: 'inventories',
    name: 'Inventories',
    group: 'Services',
    icon: 'list',
    description: 'Asset and resource inventory management',
    details:
      'Track and manage your IT assets, infrastructure resources, and application inventories with automated discovery and real-time updates.',
    features: ['Asset Discovery', 'Resource Tracking', 'Inventory Updates', 'Compliance Reporting'],
  },
  {
    id: 'observability-monitoring',
    name: 'Observability & Monitoring',
    group: 'Services',
    icon: 'eye',
    description: 'System monitoring and observability',
    details:
      'Gain deep insights into your applications and infrastructure with comprehensive monitoring, logging, tracing, and performance analytics.',
    features: ['Application Monitoring', 'Infrastructure Metrics', 'Distributed Tracing', 'Log Analytics'],
  },
  {
    id: 'operators',
    name: 'Operators',
    group: 'Services',
    icon: 'play',
    description: 'Kubernetes operators and lifecycle management',
    details:
      'Deploy and manage complex applications on Kubernetes with operators that automate installation, updates, and day-2 operations.',
    features: ['Operator Lifecycle', 'Application Management', 'Automated Updates', 'Cluster Operations'],
  },
  {
    id: 'security',
    name: 'Security',
    group: 'Services',
    icon: 'shield',
    description: 'Security scanning and threat protection',
    details:
      'Protect your infrastructure with advanced security scanning, vulnerability management, threat detection, and compliance monitoring.',
    features: ['Vulnerability Scanning', 'Threat Detection', 'Security Policies', 'Compliance Monitoring'],
  },
  {
    id: 'subscriptions-spend',
    name: 'Subscriptions & Spend',
    group: 'Services',
    icon: 'credit-card',
    description: 'Subscription management and cost optimization',
    details:
      'Manage subscriptions, track usage, optimize costs, and analyze spending patterns across your Red Hat services and cloud resources.',
    features: ['Subscription Tracking', 'Cost Analysis', 'Usage Optimization', 'Spend Management'],
  },
  {
    id: 'system-configuration',
    name: 'System Configuration',
    group: 'Services',
    icon: 'server',
    description: 'System settings and configuration management',
    details:
      'Configure and manage system settings, infrastructure parameters, and application configurations with centralized management tools.',
    features: ['Configuration Management', 'System Settings', 'Parameter Tuning', 'Change Tracking'],
  },
];

const requestAccessFor = (title: string, owner: string): SearchNavTarget => ({
  route: '/red-hat-access-requests',
  filters: [`Asset: ${title}`, `Owner: ${owner}`],
  query: title,
});

const withRestrictedAccess = (item: PaletteAction, owner: string): PaletteAction => ({
  ...item,
  access: 'restricted',
  owner,
  status: item.status || 'warning',
  nav: undefined,
  requestAccess: requestAccessFor(item.title, owner),
});

const cveAnswer: AiAnswer = {
  summary:
    'Insights Advisor found 4 hosts you can access with CVE-2024-XXXX. 2 additional matching hosts are in a restricted workspace. Those assets stay in results so you can request access from the owner instead of being left without context.',
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
      id: 'request-restricted-hosts',
      label: 'Request access to restricted hosts',
      variant: 'secondary',
      nav: requestAccessFor('pci-app-server-01', 'Payments SRE'),
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
    'cluster-prod-openshift-01 is at 93% persistent volume usage in us-east-1. A second matching cluster, cluster-finance-pci-01, is above your permission level. Request access from Finance platform team to include it.',
  actions: [
    {
      id: 'open-cluster',
      label: 'Open cluster',
      variant: 'primary',
      nav: { route: '/overview', filters: ['Cluster: cluster-prod-openshift-01', 'Storage > 90%'] },
    },
    {
      id: 'request-storage-cluster',
      label: 'Request access to PCI cluster',
      variant: 'secondary',
      nav: requestAccessFor('cluster-finance-pci-01', 'Finance platform team'),
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
    serviceIds: ['openshift', 'hcc'],
    tags: ['openshift', 'cluster', 'production', 'pci', 'finance', 'restricted'],
    item: withRestrictedAccess(
      {
        id: 'inv-cluster-pci',
        title: 'cluster-finance-pci-01',
        meta: 'OpenShift 4.16 · PCI workspace',
        kind: 'cluster',
      },
      'Finance platform team',
    ),
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
    serviceIds: ['rhel', 'insights'],
    tags: ['rhel', 'host', 'server', 'cve', 'production', 'pci', 'restricted'],
    item: withRestrictedAccess(
      {
        id: 'inv-host-pci',
        title: 'pci-app-server-01',
        meta: 'RHEL 8.10 · Production · Restricted workspace',
        kind: 'host',
      },
      'Payments SRE',
    ),
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
  {
    serviceIds: ['openshift', 'automation'],
    tags: ['openshift', 'playbook', 'secrets', 'production', 'ansible', 'restricted'],
    item: withRestrictedAccess(
      {
        id: 'inv-pb-secrets',
        title: 'Rotate production cluster secrets',
        description: 'Ansible playbook · cluster-admin required',
        playbook: true,
        kind: 'playbook',
      },
      'SRE on-call',
    ),
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
  const tokens = q.split(' ').filter((token) => token.length > 0);
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
  if (!q) return undefined;
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
      } else if (n.includes(q)) {
        score = q.length;
      } else if (n.startsWith(q)) {
        score = q.length;
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { service, score };
      }
    });
  });

  return best?.service;
};

const findAllMatchingServices = (query: string): SearchableService[] => {
  const q = normalize(query);
  if (!q) return [];

  return searchableServices.filter((service) => {
    const names = [service.name, ...service.aliases];
    return names.some((name) => {
      const n = normalize(name);
      return n && (n.includes(q) || n.startsWith(q) || q.includes(n));
    });
  });
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
      if (!t) return false;
      return includesNormalized(doc.title, t);
    });
  });
};

const findRelevantDocs = (query: string, service?: SearchableService): PaletteAction[] => {
  const terms = [query, service?.name, ...(service?.aliases || [])].filter(Boolean) as string[];

  return relevantDocs.filter((doc) =>
    terms.some((term) => {
      const t = normalize(term);
      return t.length > 0 && includesNormalized(doc.title, t);
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

const grantedFirst = (items: PaletteAction[]): PaletteAction[] => [
  ...items.filter((item) => item.access !== 'restricted'),
  ...items.filter((item) => item.access === 'restricted'),
];

export const resolveQuery = (query: string): SearchResolution => {
  const q = query.trim().toLowerCase();

  if (!q) {
    return { actions: [], entities: [], docs: [] };
  }

  const service = findBestService(q);
  const allMatchingServices = findAllMatchingServices(q);
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
  const isUpdate =
    (q.includes('update') || q.includes('upgrade') || q.includes('patch')) &&
    (q.includes('rhel') || q.includes('package') || q.includes('system'));

  let intent: SearchResolution = { actions: [], entities: [], docs: [] };

  if (isCve) {
    intent = {
      answer: cveAnswer,
      actions: [
        withRestrictedAccess(
          {
            id: 'act-terminal',
            title: "Launch Web Console terminal for 'prod-us-east-1'",
            description: 'Inline action · cluster-admin required',
            kind: 'action',
          },
          'Cluster administrators',
        ),
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
        withRestrictedAccess(
          {
            id: 'ent-host-pci',
            title: 'pci-app-server-01',
            meta: 'RHEL 8.10 · Production · Restricted workspace',
            kind: 'host',
          },
          'Payments SRE',
        ),
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
        withRestrictedAccess(
          {
            id: 'act-terminal-storage',
            title: "Launch Web Console terminal for 'prod-us-east-1'",
            kind: 'action',
          },
          'Cluster administrators',
        ),
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
        withRestrictedAccess(
          {
            id: 'ent-cluster-pci-storage',
            title: 'cluster-finance-pci-01',
            meta: 'OpenShift 4.16 · PCI workspace',
            kind: 'cluster',
          },
          'Finance platform team',
        ),
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
  } else if (isUpdate) {
    intent = {
      answer: {
        summary:
          'To update all packages on a RHEL system, run:\n\nsudo dnf update -y\n\nFor RHEL 7 and earlier, use yum instead:\n\nsudo yum update -y\n\nTo update a specific package: sudo dnf update <package-name>. After updating, reboot if kernel or core libraries were patched. You can also automate patching across your fleet using Insights Remediations and Ansible playbooks from this console.',
        actions: [
          {
            id: 'open-patch',
            label: 'Open Patch management',
            variant: 'primary',
            nav: { route: '/overview', filters: ['Insights', 'Patch', 'RHEL'] },
          },
          {
            id: 'run-patch-playbook',
            label: 'Run patch playbook',
            playbook: true,
          },
        ],
      },
      actions: [
        {
          id: 'act-advisories',
          title: 'View applicable advisories',
          kind: 'page',
          meta: 'Insights Patch · Advisories for your systems',
          nav: { route: '/overview', filters: ['Insights', 'Advisories'] },
        },
      ],
      entities: [],
      docs: [
        {
          id: 'doc-patch-rhel',
          title: 'Updating and patching RHEL with Red Hat Insights',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-dnf-guide',
          title: 'Managing software with the DNF tool',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
      ],
    };
  }

  const serviceActions: PaletteAction[] = [];
  if (service) {
    serviceActions.push(service.landing, ...service.related);
  }
  allMatchingServices.forEach((svc) => {
    if (svc.id !== service?.id) {
      serviceActions.push(svc.landing, ...svc.related);
    }
  });

  const actions = grantedFirst(dedupeById([...serviceActions, ...inventory.playbooks, ...intent.actions]));
  const entities = grantedFirst(dedupeById([...inventory.entities, ...intent.entities]));
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
