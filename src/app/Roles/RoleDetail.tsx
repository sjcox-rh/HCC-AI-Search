import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  PageSection,
  Pagination,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

interface PermissionRow {
  application: string;
  resourceType: string;
  operation: string;
  lastModified: string;
}

interface RoleInfo {
  name: string;
  description: string;
  permissions: PermissionRow[];
}

const roleData: Record<string, RoleInfo> = {
  'cloud-administrator': {
    name: 'Cloud administrator',
    description: 'Perform any available operation on any source.',
    permissions: [
      { application: 'sources', resourceType: '*', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'cost-management', resourceType: 'aws.account', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'cost-management', resourceType: 'azure.subscription', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'cost-management', resourceType: 'gcp.project', operation: '*', lastModified: '29 Jun 2026' },
    ],
  },
  'compliance-administrator': {
    name: 'Compliance administrator',
    description: 'Perform any available operation on Compliance resources.',
    permissions: [
      { application: 'compliance', resourceType: 'policy', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'compliance', resourceType: 'system', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'compliance', resourceType: 'report', operation: '*', lastModified: '29 Jun 2026' },
    ],
  },
  'cost-administrator': {
    name: 'Cost administrator',
    description: 'Perform any available operation on cost management resources.',
    permissions: [
      { application: 'cost-management', resourceType: '*', operation: '*', lastModified: '29 Jun 2026' },
    ],
  },
  'rbac-administrator': {
    name: 'RBAC administrator',
    description: 'Perform any available operation on RBAC resources.',
    permissions: [
      { application: 'rbac', resourceType: 'role', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'rbac', resourceType: 'group', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'rbac', resourceType: 'policy', operation: '*', lastModified: '29 Jun 2026' },
      { application: 'rbac', resourceType: 'permission', operation: '*', lastModified: '29 Jun 2026' },
    ],
  },
  'automation-analytics-admin': {
    name: 'Automation Analytics administrator',
    description: 'Perform any available operation on Automation Analytics resources.',
    permissions: [
      { application: 'automation-analytics', resourceType: '*', operation: '*', lastModified: '29 Jun 2026' },
    ],
  },
  'automation-analytics-editor': {
    name: 'Automation Analytics editor',
    description: 'Perform read and update operations on Automation Analytics resources.',
    permissions: [
      { application: 'automation-analytics', resourceType: '*', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'automation-analytics', resourceType: '*', operation: 'update', lastModified: '29 Jun 2026' },
    ],
  },
  'automation-analytics-viewer': {
    name: 'Automation Analytics viewer',
    description: 'Perform read operations on Automation Analytics resources.',
    permissions: [
      { application: 'automation-analytics', resourceType: '*', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'compliance-viewer': {
    name: 'Compliance viewer',
    description: 'Perform read operations on Compliance resources.',
    permissions: [
      { application: 'compliance', resourceType: 'policy', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'compliance', resourceType: 'system', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'compliance', resourceType: 'report', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'compliance', resourceType: 'profile', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'vulnerability-viewer': {
    name: 'Vulnerability viewer',
    description: 'Perform read operations on Vulnerability resources.',
    permissions: [
      { application: 'vulnerability', resourceType: 'cve', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'vulnerability', resourceType: 'system', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'vulnerability', resourceType: 'report', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'cost-cloud-viewer': {
    name: 'Cost cloud viewer',
    description: 'Perform read operations on cost reports related to cloud sources.',
    permissions: [
      { application: 'cost-management', resourceType: 'aws.account', operation: 'read', lastModified: '19 Jun 2026' },
      { application: 'cost-management', resourceType: 'azure.subscription', operation: 'read', lastModified: '19 Jun 2026' },
      { application: 'cost-management', resourceType: 'gcp.project', operation: 'read', lastModified: '19 Jun 2026' },
      { application: 'cost-management', resourceType: 'gcp.account', operation: 'read', lastModified: '19 Jun 2026' },
      { application: 'cost-management', resourceType: 'oci.payer-tenant', operation: 'read', lastModified: '19 Jun 2026' },
    ],
  },
  'cost-openshift-viewer': {
    name: 'Cost OpenShift viewer',
    description: 'Perform read operations on cost reports related to OpenShift sources.',
    permissions: [
      { application: 'cost-management', resourceType: 'openshift.cluster', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'content-template-admin': {
    name: 'Content Template administrator',
    description: 'Perform any available operation on any Content Template resource.',
    permissions: [
      { application: 'content-template', resourceType: 'template', operation: '*', lastModified: '02 Oct 2026' },
      { application: 'content-template', resourceType: 'notification-template', operation: '*', lastModified: '02 Oct 2026' },
      { application: 'content-template', resourceType: 'email-template', operation: '*', lastModified: '02 Oct 2026' },
    ],
  },
  'content-template-administrator': {
    name: 'Content Template administrator',
    description: 'Perform any available operation on any Content Template resource.',
    permissions: [
      { application: 'content-template', resourceType: 'template', operation: '*', lastModified: '02 Oct 2026' },
      { application: 'content-template', resourceType: 'notification-template', operation: '*', lastModified: '02 Oct 2026' },
      { application: 'content-template', resourceType: 'email-template', operation: '*', lastModified: '02 Oct 2026' },
    ],
  },
  'content-template-viewer': {
    name: 'Content Template viewer',
    description: 'Perform read-only operations on Content Template resources.',
    permissions: [
      { application: 'content-template', resourceType: 'template', operation: 'read', lastModified: '02 Oct 2026' },
      { application: 'content-template', resourceType: 'notification-template', operation: 'read', lastModified: '02 Oct 2026' },
    ],
  },
  'subscriptions-viewer': {
    name: 'Subscriptions viewer',
    description: 'Perform read operations on any Subscriptions resource.',
    permissions: [
      { application: 'subscriptions', resourceType: '*', operation: 'read', lastModified: '02 Jun 2026' },
    ],
  },
  'ansible-lightspeed-admin': {
    name: 'Ansible Lightspeed administrator',
    description: 'Perform read operations for Organization Administrators on all Lightspeed charts.',
    permissions: [
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-recommendations', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-user-sentiment', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-module-usage', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-active-users', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'cost-price-list-administrator': {
    name: 'Cost Price List administrator',
    description: 'Perform read and write operations on cost models.',
    permissions: [
      { application: 'cost-management', resourceType: 'rate', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'cost-management', resourceType: 'rate', operation: 'write', lastModified: '29 Jun 2026' },
    ],
  },
  'cost-price-list-viewer': {
    name: 'Cost Price List viewer',
    description: 'Perform read operations on cost models.',
    permissions: [
      { application: 'cost-management', resourceType: 'rate', operation: 'read', lastModified: '29 Jun 2026' },
      { application: 'cost-management', resourceType: 'markup', operation: 'read', lastModified: '29 Jun 2026' },
    ],
  },
  'alert-overrider': {
    name: 'Alert overrider',
    description: 'Override workspace default alert settings for themselves in their personal alert preferences.',
    permissions: [
      { application: 'notifications', resourceType: 'user-preference', operation: 'read', lastModified: '04 Sep 2025' },
      { application: 'notifications', resourceType: 'user-preference', operation: 'write', lastModified: '04 Sep 2025' },
    ],
  },
};

const RoleDetail: React.FunctionComponent = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const role = roleData[roleId || ''];
  if (!role) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Content><p>Role not found.</p></Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Red Hat Hybrid Cloud Console
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/my-user-access'); }}>
            Identity &amp; Access Management
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/user-access'); }}>
            User Access
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/roles'); }}>
            Roles
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{role.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">{role.name}</Title>
        <Content>
          <p style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{role.description}</p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <MenuToggle variant="secondary">Applications</MenuToggle>
            </ToolbarItem>
            <ToolbarItem>
              <MenuToggle variant="secondary">Filter by applications…</MenuToggle>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    aria-label="Actions"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem>Edit role</DropdownItem>
                  <DropdownItem>Delete role</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={role.permissions.length}
                perPage={10}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Role permissions" className="iam-table">
          <Thead>
            <Tr>
              <Th width={30}>Application</Th>
              <Th width={30}>Resource type</Th>
              <Th width={20}>Operation</Th>
              <Th width={20}>Last modified</Th>
            </Tr>
          </Thead>
          <Tbody>
            {role.permissions.map((p, idx) => (
              <Tr key={idx}>
                <Td dataLabel="Application">{p.application}</Td>
                <Td dataLabel="Resource type">{p.resourceType}</Td>
                <Td dataLabel="Operation">{p.operation}</Td>
                <Td dataLabel="Last modified">{p.lastModified}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination" style={{ marginInlineStart: 'auto' }}>
              <Pagination
                itemCount={role.permissions.length}
                perPage={10}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
    </>
  );
};

export { RoleDetail };
