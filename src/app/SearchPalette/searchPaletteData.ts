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
  | 'workspace'
  | 'role'
  | 'support'
  | 'download'
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

export interface SearchPrefix {
  key: string;
  label: string;
  description: string;
  kinds: PaletteResultKind[];
}

export const searchPrefixes: SearchPrefix[] = [
  { key: 'case', label: 'case:', description: 'Search support cases', kinds: ['action', 'page'] },
  { key: 'group', label: 'group:', description: 'Find IAM groups by name', kinds: ['group'] },
  { key: 'host', label: 'host:', description: 'Search hosts and servers', kinds: ['host'] },
  { key: 'cluster', label: 'cluster:', description: 'Search clusters', kinds: ['cluster'] },
  { key: 'doc', label: 'doc:', description: 'Search documentation', kinds: ['documentation'] },
  { key: 'playbook', label: 'playbook:', description: 'Search Ansible playbooks', kinds: ['playbook'] },
  { key: 'download', label: 'download:', description: 'Search product downloads', kinds: ['download'] },
  { key: 'service', label: 'service:', description: 'Search services and pages', kinds: ['service', 'page'] },
  { key: 'system', label: 'system:', description: 'Search registered systems', kinds: ['system'] },
  { key: 'workspace', label: 'workspace:', description: 'Search workspaces', kinds: ['workspace'] },
];

export interface ParsedQuery {
  prefix?: SearchPrefix;
  term: string;
  raw: string;
}

export const parseQuery = (query: string): ParsedQuery => {
  const trimmed = query.trim();
  const colonIdx = trimmed.indexOf(':');
  if (colonIdx > 0 && colonIdx < 12) {
    const key = trimmed.slice(0, colonIdx).toLowerCase();
    const prefix = searchPrefixes.find((p) => p.key === key);
    if (prefix) {
      return { prefix, term: trimmed.slice(colonIdx + 1).trim(), raw: trimmed };
    }
  }
  return { term: trimmed, raw: trimmed };
};

export const getMatchingPrefixes = (query: string): SearchPrefix[] => {
  const q = query.trim().toLowerCase();
  if (!q || q.includes(':')) return [];
  return searchPrefixes.filter((p) => p.key.startsWith(q) || p.label.startsWith(q));
};

export interface SearchResolution {
  answer?: AiAnswer;
  actions: PaletteAction[];
  entities: PaletteAction[];
  docs: PaletteAction[];
  prefix?: SearchPrefix;
}

export const getShortcutLabel = (): string => {
  if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)) {
    return '⌘K';
  }
  return 'Ctrl+K';
};

export const getContextualSuggestions = (pathname: string): PaletteAction[] => {
  if (pathname.includes('/workspaces/')) {
    const wsId = pathname.split('/workspaces/')[1]?.split('/')[0] || '';
    return [
      {
        id: 'ctx-ws-grant-this',
        title: 'Grant access to this workspace',
        description: 'Add user groups and assign roles',
        nav: { route: `/workspaces/${wsId}` },
      },
      {
        id: 'ctx-ws-parent-roles',
        title: 'Which roles are inherited from parent workspaces?',
        description: 'View roles assigned in parent workspaces tab',
      },
      {
        id: 'ctx-ws-compare',
        title: 'Compare access across workspaces',
        description: 'See who has access where',
        nav: { route: '/workspaces' },
      },
      {
        id: 'ctx-ws-audit',
        title: 'Who last modified access to this workspace?',
        description: 'Review recent role assignment changes',
      },
    ];
  }

  if (pathname.includes('/workspaces')) {
    return [
      {
        id: 'ctx-ws-grant',
        title: 'Grant access to the Production workspace',
        description: 'Add user groups to production clusters and hosts',
        nav: { route: '/workspaces/production' },
      },
      {
        id: 'ctx-ws-find',
        title: 'Find a workspace and grant access',
        description: 'Locate a workspace by name and assign roles',
      },
      {
        id: 'ctx-ws-dev',
        title: 'Open Development workspace',
        description: 'View dev & staging environment access',
        nav: { route: '/workspaces/development' },
      },
      {
        id: 'ctx-ws-cost',
        title: 'Who has access to Cost Management?',
        description: 'View groups assigned to the Cost Management workspace',
        nav: { route: '/workspaces/cost-management' },
      },
    ];
  }

  if (pathname.includes('/groups/')) {
    return [
      {
        id: 'ctx-group-members',
        title: 'How many members are in this group?',
        description: 'View group membership and user count',
      },
      {
        id: 'ctx-group-roles',
        title: 'What roles does this group have?',
        description: 'View role assignments for this group',
      },
      {
        id: 'ctx-group-workspaces',
        title: 'Which workspaces is this group assigned to?',
        description: 'Find workspace access for this group',
        nav: { route: '/workspaces' },
      },
      {
        id: 'ctx-group-add-member',
        title: 'Add a member to this group',
        description: 'Invite or assign users to this group',
      },
    ];
  }

  if (pathname.includes('/groups')) {
    return [
      {
        id: 'ctx-groups-find-admin',
        title: 'Which groups have admin roles?',
        description: 'Filter groups by role assignment',
      },
      {
        id: 'ctx-groups-platform',
        title: 'Open platform-admins group',
        description: 'View org-wide platform administrators',
        nav: { route: '/groups/platform-admins' },
      },
      {
        id: 'ctx-groups-compare',
        title: 'Compare roles across user groups',
        description: 'See which groups share similar access',
      },
      {
        id: 'ctx-groups-ws',
        title: 'View workspace assignments for groups',
        description: 'See which workspaces groups are assigned to',
        nav: { route: '/workspaces' },
      },
    ];
  }

  if (pathname.includes('/roles/')) {
    return [
      {
        id: 'ctx-role-permissions',
        title: 'What permissions does this role include?',
        description: 'View the full permission set for this role',
      },
      {
        id: 'ctx-role-groups',
        title: 'Which groups have this role?',
        description: 'Find groups assigned this role',
        nav: { route: '/groups' },
      },
      {
        id: 'ctx-role-duplicate',
        title: 'Duplicate this role with modifications',
        description: 'Create a new role based on this one',
      },
    ];
  }

  if (pathname.includes('/roles')) {
    return [
      {
        id: 'ctx-roles-admin',
        title: 'Show all administrator roles',
        description: 'Filter roles with admin-level permissions',
      },
      {
        id: 'ctx-roles-custom',
        title: 'Show custom roles only',
        description: 'Filter to user-created roles',
      },
      {
        id: 'ctx-roles-compare',
        title: 'Compare Cloud administrator vs RBAC administrator',
        description: 'Side-by-side permission comparison',
      },
      {
        id: 'ctx-roles-unused',
        title: 'Which roles are not assigned to any group?',
        description: 'Find unused or orphaned roles',
      },
    ];
  }

  if (pathname.includes('/users') || pathname.includes('user-access') || pathname.includes('my-user-access')) {
    return [
      {
        id: 'ctx-org-admin',
        title: 'Find users with org-admin role',
        description: 'Filter users by role assignment',
        nav: { route: '/users', filters: ['Role: org-admin'] },
      },
      {
        id: 'ctx-mua',
        title: 'What access do I have?',
        description: 'Open My User Access to review your permissions',
        nav: { route: '/my-user-access' },
      },
      {
        id: 'ctx-user-groups',
        title: 'Which groups am I a member of?',
        description: 'View your group membership',
        nav: { route: '/groups' },
      },
      {
        id: 'ctx-user-inactive',
        title: 'Show inactive users',
        description: 'Find users who haven\'t logged in recently',
      },
    ];
  }

  if (pathname.includes('alert-manager')) {
    return [
      {
        id: 'ctx-unread',
        title: 'Show unread alerts for production',
        description: 'Filter alerts to production, unread only',
      },
      {
        id: 'ctx-alert-critical',
        title: 'Show critical severity alerts',
        description: 'Filter to high-priority alerts',
      },
      {
        id: 'ctx-alert-config',
        title: 'Configure alert notification settings',
        description: 'Set up email and webhook notifications',
        nav: { route: '/data-integration' },
      },
      {
        id: 'ctx-alert-resolved',
        title: 'Show recently resolved alerts',
        description: 'Review alerts closed in the last 7 days',
      },
    ];
  }

  if (pathname.includes('data-integration')) {
    return [
      {
        id: 'ctx-slack',
        title: 'Configure Slack notifications',
        description: 'Set up Slack webhook integration',
        nav: { route: '/data-integration' },
      },
      {
        id: 'ctx-webhook',
        title: 'Add a new webhook endpoint',
        description: 'Configure outbound event delivery',
      },
      {
        id: 'ctx-integration-test',
        title: 'Test an existing integration',
        description: 'Send a test event to verify connectivity',
      },
      {
        id: 'ctx-event-log',
        title: 'View event delivery log',
        description: 'Check delivery status for recent events',
        nav: { route: '/event-log' },
      },
    ];
  }

  if (pathname.includes('/support/case')) {
    return [
      {
        id: 'ctx-case-update',
        title: 'Add an update to this case',
        description: 'Post a comment or attach a file',
      },
      {
        id: 'ctx-case-escalate',
        title: 'Escalate this case',
        description: 'Request priority handling from support',
      },
      {
        id: 'ctx-case-similar',
        title: 'Find similar resolved cases',
        description: 'Search knowledge base for related solutions',
      },
      {
        id: 'ctx-case-new',
        title: 'Open a new support case',
        description: 'Create a separate case for a different issue',
        nav: { route: '/support/cases/new' },
      },
    ];
  }

  if (pathname.includes('/support')) {
    return [
      {
        id: 'ctx-support-open',
        title: 'Open a support case',
        description: 'Get help from Red Hat Support',
        nav: { route: '/support/cases/new' },
      },
      {
        id: 'ctx-support-my-cases',
        title: 'View my open support cases',
        description: 'Track cases you\'ve submitted',
        nav: { route: '/support/cases' },
      },
      {
        id: 'ctx-support-kb',
        title: 'Search the knowledge base',
        description: 'Find articles and solutions',
      },
      {
        id: 'ctx-support-status',
        title: 'Check Red Hat system status',
        description: 'View service health and maintenance windows',
      },
    ];
  }

  if (pathname.includes('learning-resources')) {
    return [
      {
        id: 'ctx-learn-openshift',
        title: 'Getting started with OpenShift',
        description: 'Introductory guides and tutorials',
      },
      {
        id: 'ctx-learn-iam',
        title: 'How do roles and permissions work?',
        description: 'IAM concepts and best practices',
        nav: { route: '/learning-resources-iam' },
      },
      {
        id: 'ctx-learn-cve',
        title: 'Understanding CVE remediation',
        description: 'Vulnerability management workflow guide',
      },
      {
        id: 'ctx-learn-automation',
        title: 'Automating with Ansible playbooks',
        description: 'Getting started with Automation Platform',
      },
    ];
  }

  if (pathname === '/overview') {
    return [
      {
        id: 'ctx-cves',
        title: 'Show me critical CVEs across production hosts',
        description: 'Natural language → Insights Vulnerability with filters',
        nav: { route: '/vulnerability/cves', filters: ['Critical CVE', 'Production'], query: 'critical CVEs in production' },
      },
      {
        id: 'ctx-patch',
        title: 'Generate patch status report',
        description: 'Summarize patch compliance for managed hosts',
      },
      {
        id: 'ctx-storage',
        title: 'Which clusters are running out of storage?',
        description: 'Check cluster capacity and storage alerts',
      },
      {
        id: 'ctx-sub-expiring',
        title: 'Show subscriptions expiring this quarter',
        description: 'Review upcoming subscription renewals',
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
      id: 'ctx-home-ws',
      title: 'Find a workspace and grant access',
      description: 'Locate a workspace and assign user groups',
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
    id: 'recent-prod-cluster',
    title: 'prod-cluster-01',
    meta: 'RHEL 9.4 · 2 Critical · 2,854 Advisories',
    status: 'danger',
    kind: 'host',
    nav: { route: '/vulnerability/systems/prod-cluster-01' },
  },
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
    meta: 'RHEL 9.3 · 1 Critical · 627 Advisories',
    status: 'danger',
    kind: 'host',
    nav: { route: '/vulnerability/systems/app-server-04' },
  },
  {
    id: 'recent-group',
    title: 'rhel-prod-host-group',
    meta: 'RHEL · 48 systems',
    kind: 'group',
    nav: { route: '/overview', filters: ['Group: rhel-prod-host-group'] },
  },
];

const defaultCommonActions: PaletteAction[] = [
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

export const getCommonActions = (pathname: string): PaletteAction[] => {
  if (pathname.startsWith('/workspaces')) {
    return [
      {
        id: 'common-grant-access',
        title: 'Grant access to a workspace',
        meta: 'Assign user groups and roles',
        kind: 'action',
        nav: { route: '/workspaces/production' },
      },
      {
        id: 'common-create-workspace',
        title: 'Create a workspace',
        meta: 'Organize resources with workspaces',
        kind: 'action',
        nav: { route: '/workspaces' },
      },
      {
        id: 'common-view-roles',
        title: 'View roles',
        meta: 'Manage role assignments',
        kind: 'action',
        nav: { route: '/roles' },
      },
      {
        id: 'common-view-groups',
        title: 'View user groups',
        meta: 'Identity & Access Management',
        kind: 'action',
        nav: { route: '/groups' },
      },
    ];
  }

  if (pathname.startsWith('/groups')) {
    return [
      {
        id: 'common-create-group',
        title: 'Create a user group',
        meta: 'Add a new IAM group',
        kind: 'action',
        nav: { route: '/groups' },
      },
      {
        id: 'common-invite-user',
        title: 'Invite a user',
        meta: 'Add users to your organization',
        kind: 'action',
        nav: { route: '/users' },
      },
      {
        id: 'common-view-roles',
        title: 'View roles',
        meta: 'Role-based access control',
        kind: 'action',
        nav: { route: '/roles' },
      },
      {
        id: 'common-view-workspaces',
        title: 'View workspaces',
        meta: 'Manage workspace access',
        kind: 'action',
        nav: { route: '/workspaces' },
      },
    ];
  }

  if (pathname.startsWith('/roles')) {
    return [
      {
        id: 'common-create-role',
        title: 'Create a role',
        meta: 'Define a custom role with permissions',
        kind: 'action',
        nav: { route: '/roles' },
      },
      {
        id: 'common-view-groups',
        title: 'View user groups',
        meta: 'Assign roles to groups',
        kind: 'action',
        nav: { route: '/groups' },
      },
      {
        id: 'common-view-workspaces',
        title: 'View workspaces',
        meta: 'Workspace role assignments',
        kind: 'action',
        nav: { route: '/workspaces' },
      },
      {
        id: 'common-invite-user',
        title: 'Invite a user',
        meta: 'Identity & Access',
        kind: 'action',
        nav: { route: '/users' },
      },
    ];
  }

  if (pathname.startsWith('/users') || pathname.includes('user-access') || pathname.includes('my-user-access')) {
    return [
      {
        id: 'common-invite-user',
        title: 'Invite a user',
        meta: 'Add users to your organization',
        kind: 'action',
        nav: { route: '/users' },
      },
      {
        id: 'common-view-groups',
        title: 'View user groups',
        meta: 'Manage group membership',
        kind: 'action',
        nav: { route: '/groups' },
      },
      {
        id: 'common-view-roles',
        title: 'View roles',
        meta: 'Role-based access control',
        kind: 'action',
        nav: { route: '/roles' },
      },
      {
        id: 'common-view-workspaces',
        title: 'View workspaces',
        meta: 'Workspace access management',
        kind: 'action',
        nav: { route: '/workspaces' },
      },
    ];
  }

  if (pathname.startsWith('/alert-manager') || pathname.startsWith('/data-integration')) {
    return [
      {
        id: 'common-view-alerts',
        title: 'View all alerts',
        meta: 'Alert Manager',
        kind: 'action',
        nav: { route: '/alert-manager' },
      },
      {
        id: 'common-configure-integrations',
        title: 'Configure integrations',
        meta: 'Data integration settings',
        kind: 'action',
        nav: { route: '/data-integration' },
      },
      {
        id: 'common-event-log',
        title: 'View event log',
        meta: 'Recent system events',
        kind: 'action',
        nav: { route: '/event-log' },
      },
      {
        id: 'common-subscription-usage',
        title: 'View Subscription usage',
        meta: 'Organization subscriptions',
        kind: 'action',
        nav: { route: '/overview', filters: ['Subscriptions', 'RHEL usage'] },
      },
    ];
  }

  if (pathname.startsWith('/support')) {
    return [
      {
        id: 'common-open-case',
        title: 'Open a support case',
        meta: 'Get help from Red Hat Support',
        kind: 'action',
        nav: { route: '/support/cases/new' },
      },
      {
        id: 'common-view-cases',
        title: 'View my support cases',
        meta: 'Track open and resolved cases',
        kind: 'action',
        nav: { route: '/support/cases' },
      },
      {
        id: 'common-learning',
        title: 'Browse learning resources',
        meta: 'Tutorials, docs, and guides',
        kind: 'action',
        nav: { route: '/learning-resources' },
      },
      {
        id: 'common-register-rhel',
        title: 'Register RHEL host',
        meta: 'Start system registration',
        kind: 'action',
        nav: { route: '/overview', filters: ['RHEL', 'Register host'] },
      },
    ];
  }

  if (pathname.startsWith('/overview') || pathname === '/') {
    return [
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
        id: 'common-view-alerts',
        title: 'View alerts',
        meta: 'Alert Manager',
        kind: 'action',
        nav: { route: '/alert-manager' },
      },
      {
        id: 'common-invite-user',
        title: 'Invite a user',
        meta: 'Identity & Access',
        kind: 'action',
        nav: { route: '/users' },
      },
    ];
  }

  return defaultCommonActions;
};

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
        route: '/vulnerability/systems',
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

const supportCaseAnswer: AiAnswer = {
  summary:
    'To report an issue, you can open a support case directly from the Hybrid Cloud Console. Navigate to Support Cases or click "Open a support case" below. For faster resolution, attach diagnostic data using sosreport (RHEL) or must-gather (OpenShift). You can also check Red Hat Insights for automated issue detection and recommended remediations before filing.',
  actions: [
    {
      id: 'open-case',
      label: 'Open a support case',
      variant: 'primary',
      nav: { route: '/support/cases/new' },
    },
    {
      id: 'view-cases',
      label: 'View my support cases',
      variant: 'secondary',
      nav: { route: '/support/cases' },
    },
    {
      id: 'check-insights',
      label: 'Check Insights recommendations',
      variant: 'secondary',
      nav: { route: '/overview', filters: ['Insights', 'Recommendations'] },
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
  {
    id: 'support',
    name: 'Support Cases',
    aliases: [
      'support', 'support case', 'support cases', 'case', 'ticket',
      'report', 'issue', 'bug', 'problem', 'help', 'customer portal',
    ],
    landing: asLanding({
      id: 'svc-support',
      title: 'Support Cases',
      meta: 'View and manage support cases',
      nav: { route: '/support/cases' },
    }),
    related: [
      asPage({
        id: 'rel-support-open',
        title: 'Open a support case',
        meta: 'Create a new support case with Red Hat',
        nav: { route: '/support/cases/new' },
      }),
      asPage({
        id: 'rel-support-dashboard',
        title: 'Support Dashboard',
        meta: 'Overview of active cases and escalations',
        nav: { route: '/support' },
      }),
      asPage({
        id: 'rel-insights-recs',
        title: 'Red Hat Insights recommendations',
        meta: 'Automated issue detection and remediation',
        nav: { route: '/overview', filters: ['Insights', 'Recommendations'] },
      }),
    ],
    gettingStartedIds: ['gs-support'],
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
  {
    id: 'gs-support',
    title: 'Getting started with Red Hat Support',
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
  {
    id: 'doc-support-case',
    title: 'How to open and manage support cases',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'doc-sosreport',
    title: 'Gathering diagnostic data with sosreport',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'doc-must-gather',
    title: 'Using must-gather for OpenShift support cases',
    meta: 'Documentation',
    kind: 'documentation',
    nav: { route: '/learning-resources' },
  },
  {
    id: 'doc-support-sla',
    title: 'Red Hat support: scope of coverage and SLAs',
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
    tags: ['rhel', 'host', 'server', 'cluster', 'cve', 'production', 'critical', 'severity', 'vulnerability'],
    item: {
      id: 'inv-host-prod-cluster',
      title: 'prod-cluster-01',
      meta: 'RHEL 9.4 · 2 Critical · 2,854 Advisories',
      status: 'danger',
      kind: 'host',
      nav: { route: '/vulnerability/systems/prod-cluster-01' },
    },
  },
  {
    serviceIds: ['rhel', 'insights', 'hcc'],
    tags: ['rhel', 'host', 'server', 'cve', 'production', 'insights'],
    item: {
      id: 'inv-host-app',
      title: 'app-server-04',
      meta: 'RHEL 9.3 · 1 Critical · 627 Advisories',
      status: 'danger',
      kind: 'host',
      nav: { route: '/vulnerability/systems/app-server-04' },
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
      nav: { route: '/vulnerability/systems/web-server-01' },
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
      nav: { route: '/vulnerability/systems/db-server-07' },
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
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'platform', 'admins', 'admin', 'roles', 'user access'],
    item: {
      id: 'inv-iam-group-platform-admins',
      title: 'platform-admins',
      meta: 'IAM Group · 12 members · 4 roles',
      kind: 'group',
      nav: { route: '/groups/platform-admins' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'dev', 'ops', 'devops', 'roles', 'user access'],
    item: {
      id: 'inv-iam-group-devops',
      title: 'dev-ops-team',
      meta: 'IAM Group · 8 members · 3 roles',
      kind: 'group',
      nav: { route: '/groups/dev-ops-team' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'security', 'reviewers', 'review', 'roles', 'user access'],
    item: {
      id: 'inv-iam-group-security',
      title: 'security-reviewers',
      meta: 'IAM Group · 5 members · 2 roles',
      kind: 'group',
      nav: { route: '/groups/security-reviewers' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'cloud', 'operators', 'operator', 'roles', 'user access'],
    item: {
      id: 'inv-iam-group-cloud-ops',
      title: 'cloud-operators',
      meta: 'IAM Group · 6 members · 5 roles',
      kind: 'group',
      nav: { route: '/groups/cloud-operators' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'application', 'developers', 'developer', 'dev', 'roles', 'user access'],
    item: {
      id: 'inv-iam-group-app-devs',
      title: 'application-developers',
      meta: 'IAM Group · 15 members · 3 roles',
      kind: 'group',
      nav: { route: '/groups/application-developers' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'group', 'cost', 'management', 'finance', 'spend', 'roles', 'user access', 'restricted'],
    item: withRestrictedAccess(
      {
        id: 'inv-iam-group-cost',
        title: 'cost-management-admins',
        meta: 'IAM Group · 3 members · Restricted workspace',
        kind: 'group',
      },
      'Finance org admin',
    ),
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'uxd', 'root', 'organization', 'red hat'],
    item: {
      id: 'inv-ws-root',
      title: 'Red Hat UXD',
      meta: 'Workspace · Root · 5 child workspaces',
      kind: 'workspace',
      nav: { route: '/workspaces/red-hat-uxd' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'production', 'prod', 'clusters', 'hosts', 'infrastructure'],
    item: {
      id: 'inv-ws-production',
      title: 'Production',
      meta: 'Workspace · 3 user groups · Clusters & hosts',
      kind: 'workspace',
      nav: { route: '/workspaces/production' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'development', 'dev', 'staging', 'applications', 'team'],
    item: {
      id: 'inv-ws-development',
      title: 'Development',
      meta: 'Workspace · 2 user groups · Dev & staging',
      kind: 'workspace',
      nav: { route: '/workspaces/development' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'cost', 'management', 'spend', 'subscriptions', 'finance', 'grant', 'access'],
    item: {
      id: 'inv-ws-cost',
      title: 'Cost Management',
      meta: 'Workspace · 1 user group · Spend & subscriptions',
      kind: 'workspace',
      nav: { route: '/workspaces/cost-management' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'compliance', 'security', 'vulnerability', 'audit', 'rbac'],
    item: {
      id: 'inv-ws-compliance',
      title: 'Compliance & Security',
      meta: 'Workspace · 2 user groups · Auditing & policies',
      kind: 'workspace',
      nav: { route: '/workspaces/compliance-security' },
    },
  },
  {
    serviceIds: ['iam'],
    tags: ['iam', 'workspace', 'default', 'ungrouped', 'unassigned'],
    item: {
      id: 'inv-ws-default',
      title: 'Default',
      meta: 'Workspace · 2 user groups · Ungrouped resources',
      kind: 'workspace',
      nav: { route: '/workspaces/default' },
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
  {
    serviceIds: ['support', 'rhel', 'automation'],
    tags: ['support', 'sosreport', 'diagnostic', 'report', 'issue', 'case', 'rhel', 'ansible'],
    item: {
      id: 'inv-pb-sosreport',
      title: 'Generate sosreport diagnostic bundle',
      description: 'Ansible playbook · collect system diagnostics for support',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: ['support', 'openshift', 'automation'],
    tags: ['support', 'must-gather', 'diagnostic', 'report', 'issue', 'case', 'openshift', 'ansible'],
    item: {
      id: 'inv-pb-mustgather',
      title: 'Collect must-gather for OpenShift',
      description: 'Ansible playbook · gather cluster diagnostics for support',
      playbook: true,
      kind: 'playbook',
    },
  },
  {
    serviceIds: [],
    tags: ['rhel', 'red hat enterprise linux', 'download', 'iso', 'image', 'binary', 'dvd', 'rhel 10', 'rhel10'],
    item: {
      id: 'inv-dl-rhel10-dvd',
      title: 'RHEL 10.0 Binary DVD',
      description: 'ISO · 10.4 GB · x86_64 · Complete installation media',
      kind: 'download',
      nav: { route: '/downloads/rhel' },
    },
  },
  {
    serviceIds: [],
    tags: ['rhel', 'red hat enterprise linux', 'download', 'iso', 'boot', 'rhel 10', 'rhel10'],
    item: {
      id: 'inv-dl-rhel10-boot',
      title: 'RHEL 10.0 Boot ISO',
      description: 'ISO · 892 MB · x86_64 · Network-based install',
      kind: 'download',
      nav: { route: '/downloads/rhel' },
    },
  },
  {
    serviceIds: [],
    tags: ['rhel', 'red hat enterprise linux', 'download', 'qcow2', 'kvm', 'cloud', 'image', 'rhel 10', 'rhel10'],
    item: {
      id: 'inv-dl-rhel10-qcow2',
      title: 'RHEL 10.0 KVM Guest Image',
      description: 'QCOW2 · 1.2 GB · x86_64 · Cloud & virtualization',
      kind: 'download',
      nav: { route: '/downloads/rhel' },
    },
  },
  {
    serviceIds: [],
    tags: ['openshift', 'ocp', 'download', 'installer', 'oc', 'cli'],
    item: {
      id: 'inv-dl-openshift',
      title: 'OpenShift 4.17 Installer',
      description: 'CLI · openshift-install · Cluster deployment tooling',
      kind: 'download',
      nav: { route: '/downloads/rhel' },
    },
  },
  {
    serviceIds: [],
    tags: ['ansible', 'aap', 'download', 'automation'],
    item: {
      id: 'inv-dl-ansible',
      title: 'Ansible Automation Platform 2.5',
      description: 'Setup bundle · Automation controller & hub',
      kind: 'download',
      nav: { route: '/downloads/rhel' },
    },
  },
];

const kindKeywords: Partial<Record<PaletteResultKind, string[]>> = {
  cluster: ['cluster', 'clusters'],
  host: ['host', 'hosts', 'server', 'servers'],
  system: ['system', 'systems'],
  group: ['group', 'groups'],
  workspace: ['workspace', 'workspaces'],
  playbook: ['playbook', 'playbooks'],
  download: ['download', 'downloads', 'iso', 'image'],
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
  const q = normalize(query);
  const matched = inventoryRecords.filter((record) => recordMatches(record, query, service)).map((record) => record.item);

  const titleScore = (item: PaletteAction): number => {
    const t = normalize(item.title);
    if (t === q) return 3;
    if (t.includes(q)) return 2;
    const tokens = q.split(' ').filter(Boolean);
    if (tokens.every((tok) => t.includes(tok))) return 1;
    return 0;
  };

  const sorted = [...matched].sort((a, b) => titleScore(b) - titleScore(a));

  return {
    playbooks: sorted.filter((item) => item.kind === 'playbook' || item.playbook),
    entities: sorted.filter((item) => item.kind !== 'playbook' && !item.playbook),
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

  const parsed = parseQuery(query);

  if (parsed.prefix) {
    const searchTerm = parsed.term || '';
    const kinds = new Set(parsed.prefix.kinds);

    const serviceItems: PaletteAction[] = [];
    searchableServices.forEach((svc) => {
      serviceItems.push(svc.landing, ...svc.related);
    });

    const allItems = [
      ...serviceItems,
      ...inventoryRecords.map((r) => r.item),
      ...gettingStartedDocs,
      ...relevantDocs,
    ];

    const matchingItems = allItems.filter((item) => {
      const matchesKind = item.kind && kinds.has(item.kind);
      if (!matchesKind) {
        if (parsed.prefix!.key === 'case') {
          const isCaseRelated =
            item.title.toLowerCase().includes('case') ||
            item.title.toLowerCase().includes('support') ||
            item.nav?.route?.includes('/support');
          if (!isCaseRelated) return false;
        } else if (parsed.prefix!.key === 'doc') {
          if (item.kind !== 'documentation') return false;
        } else if (parsed.prefix!.key === 'playbook') {
          if (item.kind !== 'playbook' && !item.playbook) return false;
        } else {
          return false;
        }
      }
      if (parsed.prefix!.key === 'group') {
        const isIamGroup = item.nav?.route?.startsWith('/groups') ||
          (item.meta && item.meta.toLowerCase().includes('iam'));
        if (!isIamGroup) return false;
      }
      if (!searchTerm) return true;
      const hay = normalize([item.title, item.meta, item.description].filter(Boolean).join(' '));
      return hay.includes(normalize(searchTerm));
    });

    const actions = grantedFirst(matchingItems.filter((i) =>
      i.kind === 'action' || i.kind === 'service' || i.kind === 'page' || i.playbook || i.kind === 'playbook',
    ));
    const entities = grantedFirst(matchingItems.filter((i) =>
      i.kind === 'cluster' || i.kind === 'host' || i.kind === 'system' || i.kind === 'group' || i.kind === 'workspace',
    ));
    const docs = matchingItems.filter((i) => i.kind === 'documentation');

    return { actions, entities, docs, prefix: parsed.prefix };
  }

  const service = findBestService(q);
  const allMatchingServices = findAllMatchingServices(q);
  const gettingStarted = findGettingStartedDocs(q, service);
  const extraDocs = findRelevantDocs(q, service);
  const inventory = findRelevantInventory(q, service);

  const isCve =
    q.includes('cve') ||
    q.includes('vulnerab') ||
    q.includes('critical') ||
    q.includes('high severity') ||
    q.includes('severity') ||
    q.includes('fix');

  const isStorage = q.includes('storage') || q.includes('running out') || q.includes('capacity');
  const isSub = q.includes('subscription') || (q.includes('usage') && (q.includes('rhel') || q.includes('subscription')));
  const isRhel10 =
    q.includes('rhel 10') || q.includes('rhel10') ||
    (q.includes('rhel') && q.includes('10')) ||
    (q.includes('red hat enterprise linux') && q.includes('10'));

  const isUpdate =
    !isRhel10 &&
    (q.includes('update') || q.includes('upgrade') || q.includes('patch')) &&
    (q.includes('rhel') || q.includes('package') || q.includes('system'));

  const isSupport =
    q.includes('support case') ||
    q.includes('open a case') ||
    q.includes('file a case') ||
    q.includes('report') ||
    q.includes('issue') ||
    q.includes('bug') ||
    q.includes('ticket') ||
    (q.includes('problem') && (q.includes('report') || q.includes('help') || q.includes('how'))) ||
    (q.includes('help') && (q.includes('report') || q.includes('issue') || q.includes('found')));

  const isWorkspaceAccess =
    (q.includes('workspace') && (q.includes('grant') || q.includes('access') || q.includes('find') || q.includes('add') || q.includes('how'))) ||
    (q.includes('grant access') && q.includes('workspace'));

  const isGroup =
    q.includes('group') ||
    (q.includes('team') && (q.includes('find') || q.includes('manage') || q.includes('show') || q.includes('which')));

  const isSystemLookup =
    (q.includes('details') || q.includes('status') || q.includes('show me') || q.includes('find')) &&
    (q.includes('system') || q.includes('server') || q.includes('host') || q.includes('prod') || q.includes('app-server') || q.includes('cluster'));

  let intent: SearchResolution = { actions: [], entities: [], docs: [] };

  if (isSupport) {
    intent = {
      answer: supportCaseAnswer,
      actions: [
        {
          id: 'act-open-case',
          title: 'Open a support case',
          description: 'Create a new support case with Red Hat',
          kind: 'action',
          nav: { route: '/support/cases/new' },
        },
        {
          id: 'act-view-cases',
          title: 'View my support cases',
          description: 'See existing open and closed cases',
          kind: 'page',
          meta: 'Support Cases',
          nav: { route: '/support/cases' },
        },
        {
          id: 'act-customer-portal',
          title: 'Red Hat Customer Portal',
          description: 'Access the full Customer Portal experience',
          kind: 'page',
          meta: 'Landing page',
          nav: { route: '/support' },
        },
        {
          id: 'act-insights-recs',
          title: 'Red Hat Insights recommendations',
          description: 'Check if Insights already detected this issue',
          kind: 'page',
          meta: 'Insights · Recommendations',
          nav: { route: '/overview', filters: ['Insights', 'Recommendations'] },
        },
      ],
      entities: [],
      docs: [
        {
          id: 'doc-support-case',
          title: 'How to open and manage support cases',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-sosreport',
          title: 'Gathering diagnostic data with sosreport',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-must-gather',
          title: 'Using must-gather for OpenShift support cases',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-support-sla',
          title: 'Red Hat support: scope of coverage and SLAs',
          meta: 'Documentation',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
      ],
    };
  } else if (isWorkspaceAccess) {
    intent = {
      answer: {
        summary:
          'You can manage workspace access from Identity & Access Management. Navigate to a workspace and click "Grant access" to assign user groups and roles. Workspaces provide hierarchical access control — roles assigned to parent workspaces are inherited by child workspaces.',
        actions: [
          {
            id: 'open-workspaces',
            label: 'Open Workspaces',
            variant: 'primary',
            nav: { route: '/workspaces' },
          },
          {
            id: 'open-ws-production',
            label: 'Open Production workspace',
            variant: 'secondary',
            nav: { route: '/workspaces/production' },
          },
        ],
      },
      actions: [
        {
          id: 'act-workspaces',
          title: 'Workspaces',
          description: 'View and manage all workspaces',
          kind: 'page',
          meta: 'IAM · Workspaces',
          nav: { route: '/workspaces' },
        },
        {
          id: 'act-ws-production',
          title: 'Production',
          description: 'Grant access to production clusters and hosts',
          kind: 'page',
          meta: 'Workspace · 3 user groups',
          nav: { route: '/workspaces/production' },
        },
        {
          id: 'act-ws-cost',
          title: 'Cost Management',
          description: 'Grant access to cost and spend resources',
          kind: 'page',
          meta: 'Workspace · 1 user group',
          nav: { route: '/workspaces/cost-management' },
        },
      ],
      entities: inventoryRecords
        .filter((r) => r.item.kind === 'workspace')
        .map((r) => r.item),
      docs: [],
    };
  } else if (isCve) {
    intent = {
      answer: cveAnswer,
      actions: [
        {
          id: 'act-cves-page',
          title: 'CVEs',
          description: 'View all CVEs with severity filters',
          kind: 'page',
          meta: 'Security · Vulnerability',
          nav: { route: '/vulnerability/cves' },
        },
        {
          id: 'act-systems-page',
          title: 'Vulnerable Systems',
          description: 'View systems with applicable vulnerabilities',
          kind: 'page',
          meta: 'Security · Vulnerability',
          nav: { route: '/vulnerability/systems' },
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
          id: 'ent-prod-cluster',
          title: 'prod-cluster-01',
          meta: 'RHEL 9.4 · 2 Critical · 2,854 Advisories',
          status: 'danger',
          kind: 'host',
          nav: { route: '/vulnerability/systems/prod-cluster-01' },
        },
        {
          id: 'ent-host',
          title: 'app-server-04',
          meta: 'RHEL 9.3 · 1 Critical · 627 Advisories',
          status: 'danger',
          kind: 'host',
          nav: { route: '/vulnerability/systems/app-server-04' },
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

  if (!intent.answer && isRhel10) {
    intent = {
      answer: {
        summary:
          'Red Hat Enterprise Linux 10 is now available. RHEL 10 introduces enhanced security with SELinux policy updates, improved container tooling with Podman 5, next-generation performance observability, and streamlined image builder workflows. Existing RHEL 8 and 9 systems can perform an in-place upgrade using the Leapp utility.',
        actions: [
          {
            id: 'open-rhel10-overview',
            label: 'Explore RHEL 10',
            variant: 'primary',
            nav: { route: '/overview', filters: ['RHEL 10'] },
          },
          {
            id: 'open-rhel10-upgrade',
            label: 'Plan upgrade to RHEL 10',
            variant: 'secondary',
          },
        ],
      },
      actions: [
        {
          id: 'act-rhel10-release',
          title: 'RHEL 10 release notes',
          description: 'What\'s new in Red Hat Enterprise Linux 10',
          kind: 'page',
          meta: 'Product Documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'act-rhel10-upgrade',
          title: 'Upgrade to RHEL 10 with Leapp',
          description: 'In-place upgrade guide from RHEL 8 or RHEL 9',
          kind: 'page',
          meta: 'Documentation · Upgrade Planning',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'act-rhel10-image-builder',
          title: 'Image Builder for RHEL 10',
          description: 'Build custom RHEL 10 images for cloud, edge, and bare metal',
          kind: 'service',
          meta: 'Insights · Image Builder',
          nav: { route: '/overview', filters: ['Image Builder', 'RHEL 10'] },
        },
        {
          id: 'act-rhel10-subscriptions',
          title: 'RHEL 10 subscription usage',
          description: 'View subscription allocation and usage for RHEL 10',
          kind: 'page',
          meta: 'Subscriptions · RHEL 10',
          nav: { route: '/overview', filters: ['Subscriptions', 'RHEL 10'] },
        },
      ],
      entities: [
        {
          id: 'dl-rhel10-binary',
          title: 'RHEL 10.0 Binary DVD',
          meta: 'ISO · 10.4 GB · x86_64 · Complete installation media',
          kind: 'download',
          nav: { route: '/downloads/rhel' },
        },
        {
          id: 'dl-rhel10-boot',
          title: 'RHEL 10.0 Boot ISO',
          meta: 'ISO · 892 MB · x86_64 · Network-based install',
          kind: 'download',
          nav: { route: '/downloads/rhel' },
        },
        {
          id: 'dl-rhel10-qcow2',
          title: 'RHEL 10.0 KVM Guest Image',
          meta: 'QCOW2 · 1.2 GB · x86_64 · Cloud & virtualization',
          kind: 'download',
          nav: { route: '/downloads/rhel' },
        },
        {
          id: 'ent-rhel10-activation-key',
          title: 'RHEL 10 Activation Keys',
          meta: 'Register systems with RHEL 10 content',
          kind: 'action',
          nav: { route: '/overview', filters: ['Activation Keys', 'RHEL 10'] },
        },
      ],
      docs: [
        {
          id: 'doc-rhel10-release',
          title: 'RHEL 10.0 Release Notes',
          meta: 'Documentation · June 2025',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-rhel10-install',
          title: 'Installing Red Hat Enterprise Linux 10',
          meta: 'Documentation · Installation Guide',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-rhel10-migration',
          title: 'Migrating to RHEL 10: Planning and considerations',
          meta: 'Documentation · Migration Guide',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-rhel10-security',
          title: 'Security hardening in RHEL 10',
          meta: 'Documentation · Security Guide',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
        {
          id: 'doc-rhel10-containers',
          title: 'Building and running containers on RHEL 10',
          meta: 'Documentation · Podman 5 & Container Tools',
          kind: 'documentation',
          nav: { route: '/learning-resources' },
        },
      ],
    };
  }

  if (!intent.answer && isGroup) {
    const groupName = q.includes('platform') ? 'platform-admins' :
      q.includes('cloud') || q.includes('operations') ? 'cloud-operators' :
      q.includes('security') ? 'security-reviewers' : 'platform-admins';
    const groupDescription = q.includes('platform') ? 'Manages platform infrastructure across all environments' :
      q.includes('cloud') || q.includes('operations') ? 'Manages cloud infrastructure and operations' :
      q.includes('security') ? 'Reviews and approves security policies and configurations' : 'User group in Identity & Access Management';
    intent = {
      answer: {
        summary: `The "${groupName}" group is managed in Identity & Access Management. This group ${groupDescription.toLowerCase()}. You can view its members, assigned roles, and workspaces from the group detail page.`,
        actions: [
          { id: 'open-group', label: `Open ${groupName}`, variant: 'primary', nav: { route: `/groups/${groupName}` } },
          { id: 'open-groups', label: 'View all groups', variant: 'secondary', nav: { route: '/groups' } },
        ],
      },
      actions: [
        { id: 'act-group', title: groupName, description: groupDescription, kind: 'page', meta: 'IAM · User Group', nav: { route: `/groups/${groupName}` } },
        { id: 'act-groups', title: 'Groups', description: 'View and manage all user groups', kind: 'page', meta: 'Identity & Access Management', nav: { route: '/groups' } },
      ],
      entities: [],
      docs: [
        { id: 'doc-groups', title: 'Managing user groups in IAM', meta: 'Documentation', kind: 'documentation', nav: { route: '/learning-resources' } },
      ],
    };
  }

  if (!intent.answer && isSystemLookup) {
    const systemName = q.includes('prod') && q.includes('cluster') ? 'prod-cluster-01' :
      q.includes('app-server') || q.includes('app server') ? 'app-server-04' :
      q.includes('web') ? 'web-server-01' :
      q.includes('db') ? 'db-server-07' : 'prod-cluster-01';
    const systemMeta = systemName === 'prod-cluster-01' ? 'RHEL 9.4 · 2 Critical · 2,854 Advisories' :
      systemName === 'app-server-04' ? 'RHEL 9.3 · 1 Critical · 627 Advisories' :
      systemName === 'web-server-01' ? 'RHEL 8.9 · 442 Advisories' :
      systemName === 'db-server-07' ? 'RHEL 9.4 · 312 Advisories' : 'RHEL · Advisories';
    intent = {
      answer: {
        summary: `Here are the details for ${systemName}. This system is registered with Red Hat Insights and has applicable advisories. You can view its CVEs, remediation options, and compliance status from the system detail page.`,
        actions: [
          { id: 'open-system', label: `Open ${systemName}`, variant: 'primary', nav: { route: `/vulnerability/systems/${systemName}` } },
          { id: 'open-systems', label: 'View all systems', variant: 'secondary', nav: { route: '/vulnerability/systems' } },
        ],
      },
      actions: [
        { id: 'act-system', title: systemName, description: `View system details, CVEs, and remediation`, kind: 'page', meta: systemMeta, status: 'danger', nav: { route: `/vulnerability/systems/${systemName}` } },
        { id: 'act-systems', title: 'Vulnerable Systems', description: 'View all systems with vulnerabilities', kind: 'page', meta: 'Security · Vulnerability', nav: { route: '/vulnerability/systems' } },
      ],
      entities: [],
      docs: [],
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

  const actions = intent.answer
    ? grantedFirst(dedupeById(intent.actions))
    : grantedFirst(dedupeById([...serviceActions, ...inventory.playbooks, ...intent.actions]));
  const entities = intent.answer
    ? grantedFirst(dedupeById(intent.entities))
    : grantedFirst(dedupeById([...inventory.entities, ...intent.entities]));
  const docs = intent.answer
    ? dedupeById(intent.docs)
    : dedupeById([...gettingStarted, ...extraDocs, ...intent.docs]);

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
