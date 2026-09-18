export type CatalogCategory =
  | 'Red Hat Enterprise Linux'
  | 'Red Hat OpenShift'
  | 'Red Hat Ansible Automation Platform'
  | 'Identity & Access Management (IAM)'
  | 'Console Settings'
  | 'Subscription Services'
  | 'Other';

export const catalogCategoryOrder: CatalogCategory[] = [
  'Red Hat Enterprise Linux',
  'Red Hat OpenShift',
  'Red Hat Ansible Automation Platform',
  'Identity & Access Management (IAM)',
  'Console Settings',
  'Subscription Services',
  'Other',
];

export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  category: CatalogCategory;
  route?: string;
}

export const catalogEntries: CatalogEntry[] = [
  {
    id: 'rhel-insights',
    name: 'Red Hat Insights',
    description:
      'Proactive identification and remediation of threats to security, performance, availability, and stability',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'rhel-patch',
    name: 'Patch Management',
    description: 'Automated patching and system updates for Red Hat Enterprise Linux environments',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'rhel-rhc',
    name: 'Remote Host Configuration (RHC)',
    description: 'Configure and manage remote host connections and system configurations',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'rhel-activation-keys',
    name: 'Activation Keys',
    description: 'Manage activation keys for system registration and subscription management',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'rhel-registration-assistant',
    name: 'Registration Assistant',
    description: 'Step-by-step guidance for registering systems to Red Hat services',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'rhel-staleness-deletion',
    name: 'Staleness & Deletion',
    description: 'Configure system staleness detection and automated deletion policies',
    category: 'Red Hat Enterprise Linux',
  },
  {
    id: 'openshift-clusters',
    name: 'OpenShift Clusters',
    description: 'Manage and monitor your OpenShift Kubernetes clusters across hybrid cloud environments',
    category: 'Red Hat OpenShift',
  },
  {
    id: 'container-registry',
    name: 'Container Registry',
    description: 'Secure container image registry for storing, managing, and deploying container images',
    category: 'Red Hat OpenShift',
  },
  {
    id: '60day-trial-openshift-ai',
    name: '60-Day Product Trial | OpenShift AI',
    description: 'Create, train, and service artificial intelligence and machine learning (AI/ML) models.',
    category: 'Red Hat OpenShift',
  },
  {
    id: 'developer-sandbox-openshift-ai',
    name: 'Developer Sandbox | OpenShift AI',
    description: 'Create, train, and service artificial intelligence and machine learning (AI/ML) models.',
    category: 'Red Hat OpenShift',
  },
  {
    id: 'automation-hub',
    name: 'Automation Hub',
    description: 'Centralized repository for discovering, downloading, and sharing Ansible content collections',
    category: 'Red Hat Ansible Automation Platform',
  },
  {
    id: 'automation-controller',
    name: 'Automation Controller',
    description: 'Enterprise automation control plane for scheduling, scaling, and managing Ansible playbooks',
    category: 'Red Hat Ansible Automation Platform',
  },
  {
    id: 'ansible-registration-assistant',
    name: 'Registration Assistant',
    description: 'Guided setup for registering and configuring Ansible automation workflows',
    category: 'Red Hat Ansible Automation Platform',
  },
  {
    id: 'users',
    name: 'Users',
    description: 'Manage user accounts and their access permissions',
    category: 'Identity & Access Management (IAM)',
    route: '/users',
  },
  {
    id: 'groups',
    name: 'Groups',
    description: 'Create and manage user groups and group-based permissions',
    category: 'Identity & Access Management (IAM)',
    route: '/groups',
  },
  {
    id: 'roles',
    name: 'Roles',
    description: 'Define and manage user roles with specific permissions and access levels',
    category: 'Identity & Access Management (IAM)',
    route: '/roles',
  },
  {
    id: 'authentication-factors',
    name: 'Authentication Factors',
    description: 'Configure multi-factor authentication and security settings',
    category: 'Identity & Access Management (IAM)',
  },
  {
    id: 'service-accounts',
    name: 'Service Accounts',
    description: 'Create and manage service accounts for automated systems and application integrations',
    category: 'Identity & Access Management (IAM)',
    route: '/service-accounts',
  },
  {
    id: 'identity-provider-information',
    name: 'Identity Provider Information',
    description: 'Configure and manage external identity providers and federation settings',
    category: 'Identity & Access Management (IAM)',
  },
  {
    id: 'workspaces',
    name: 'Workspaces',
    description: 'Manage organizational workspaces and their access controls',
    category: 'Identity & Access Management (IAM)',
    route: '/workspaces',
  },
  {
    id: 'user-access-item',
    name: 'User Access',
    description: 'Manage user permissions, roles, and access controls across Red Hat services',
    category: 'Identity & Access Management (IAM)',
    route: '/user-access',
  },
  {
    id: 'service-accounts-item',
    name: 'Service Accounts',
    description: 'Create and manage service accounts for automated systems and application integrations',
    category: 'Identity & Access Management (IAM)',
    route: '/service-accounts',
  },
  {
    id: 'alert-manager-settings',
    name: 'Alert Manager | Settings',
    description: 'Configure and manage system alerts and notifications',
    category: 'Console Settings',
    route: '/alert-manager',
  },
  {
    id: 'data-integration-settings',
    name: 'Data Integration | Settings',
    description: 'Manage data integration workflows and connectors',
    category: 'Console Settings',
    route: '/data-integration',
  },
  {
    id: 'event-log-settings',
    name: 'Event Log | Settings',
    description: 'View and configure system event logging',
    category: 'Console Settings',
    route: '/event-log',
  },
  {
    id: 'overview-settings',
    name: 'Overview | Settings',
    description: 'Access the main console overview and dashboard',
    category: 'Console Settings',
    route: '/overview',
  },
  {
    id: 'directory-domain-services',
    name: 'Directory and Domain Services',
    description: 'Configure directory services and domain management settings',
    category: 'Console Settings',
  },
  {
    id: 'console-alert-manager',
    name: 'Alert Manager',
    description: 'Configure and manage system alerts, notifications, and escalation policies',
    category: 'Console Settings',
    route: '/alert-manager',
  },
  {
    id: 'console-data-integration',
    name: 'Data Integration',
    description: 'Manage data integration workflows, connectors, and synchronization settings',
    category: 'Console Settings',
    route: '/data-integration',
  },
  {
    id: 'preferences',
    name: 'Preferences',
    description: 'Customize your console experience, themes, and personal settings',
    category: 'Console Settings',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure alert preferences and notification settings for system events',
    category: 'Console Settings',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    description: 'View and manage your Red Hat product subscriptions and entitlements',
    category: 'Subscription Services',
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Access billing information, invoices, and payment methods for Red Hat services',
    category: 'Subscription Services',
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Access comprehensive guides, tutorials, and technical documentation for Red Hat products',
    category: 'Other',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Get help from Red Hat support team, submit cases, and access community resources',
    category: 'Other',
    route: '/support',
  },
];

export const catalogEntryById: Record<string, CatalogEntry> = Object.fromEntries(
  catalogEntries.map((entry) => [entry.id, entry]),
);

const DEFAULT_CATALOG_IDS = [
  'rhel-insights',
  'rhel-patch',
  'openshift-clusters',
  'container-registry',
  'automation-hub',
  'automation-controller',
  'user-access-item',
  'service-accounts-item',
  'preferences',
  'notifications',
  'subscriptions',
  'billing',
  'documentation',
  'support',
];

const catalogIdsByNavItem: Record<string, string[]> = {
  ansible: ['automation-hub', 'automation-controller', 'ansible-registration-assistant'],
  rhel: [
    'rhel-insights',
    'rhel-patch',
    'rhel-rhc',
    'rhel-activation-keys',
    'rhel-registration-assistant',
    'rhel-staleness-deletion',
  ],
  openshift: [
    'openshift-clusters',
    'container-registry',
    '60day-trial-openshift-ai',
    'developer-sandbox-openshift-ai',
  ],
  'ai-ml': ['60day-trial-openshift-ai', 'developer-sandbox-openshift-ai'],
  'alerting-data-integrations': [
    'alert-manager-settings',
    'data-integration-settings',
    'event-log-settings',
    'overview-settings',
  ],
  'identity-access-mgmt': [
    'users',
    'groups',
    'roles',
    'authentication-factors',
    'service-accounts',
    'identity-provider-information',
    'workspaces',
    'directory-domain-services',
  ],
  'system-configuration': [
    'rhel-rhc',
    'rhel-activation-keys',
    'rhel-registration-assistant',
    'rhel-staleness-deletion',
    'ansible-registration-assistant',
    'console-alert-manager',
    'console-data-integration',
  ],
  'subscriptions-spend': ['subscriptions', 'billing'],
};

export interface CatalogGroup {
  category: CatalogCategory;
  items: CatalogEntry[];
}

const entriesForIds = (ids: string[]): CatalogEntry[] =>
  ids.map((id) => catalogEntryById[id]).filter((entry): entry is CatalogEntry => Boolean(entry));

const groupEntries = (entries: CatalogEntry[]): CatalogGroup[] =>
  catalogCategoryOrder
    .map((category) => ({
      category,
      items: entries.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.items.length > 0);

export const getCatalogGroups = (navItemId: string): CatalogGroup[] =>
  groupEntries(entriesForIds(catalogIdsByNavItem[navItemId] ?? DEFAULT_CATALOG_IDS));

export const getFavoriteGroups = (favoritedIds: Iterable<string>): CatalogGroup[] =>
  groupEntries(entriesForIds(Array.from(favoritedIds)));
