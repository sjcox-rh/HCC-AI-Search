import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AngleDownIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { GrantAccessWizard } from './GrantAccessWizard';

interface GroupAssignment {
  id: string;
  name: string;
  description: string;
  users: number;
  roles: number;
  lastModified: string;
}

interface WorkspaceInfo {
  name: string;
  description: string;
  hierarchy: string[];
  groupAssignments: GroupAssignment[];
}

const workspaceDetails: Record<string, WorkspaceInfo> = {
  'red-hat-uxd': {
    name: 'Red Hat UXD',
    description: 'Root workspace for the UXD organization.',
    hierarchy: ['Red Hat UXD'],
    groupAssignments: [
      { id: 'platform-admins', name: 'platform-admins', description: 'Organization-wide platform administrators', users: 12, roles: 4, lastModified: '07 Oct 2026' },
      { id: 'default-access', name: 'Default access', description: 'Default access for all organization members', users: 48, roles: 1, lastModified: '19 May 2021' },
    ],
  },
  production: {
    name: 'Production',
    description: 'Production infrastructure, clusters, and host systems.',
    hierarchy: ['Red Hat UXD', 'Production'],
    groupAssignments: [
      { id: 'platform-admins', name: 'platform-admins', description: 'Organization-wide platform administrators', users: 12, roles: 4, lastModified: '07 Oct 2026' },
      { id: 'cloud-operators', name: 'cloud-operators', description: 'Cloud infrastructure and cluster operators', users: 6, roles: 5, lastModified: '15 Sep 2026' },
      { id: 'security-reviewers', name: 'security-reviewers', description: 'Security compliance and vulnerability reviewers', users: 5, roles: 2, lastModified: '28 Sep 2026' },
    ],
  },
  development: {
    name: 'Development',
    description: 'Development and staging environments for application teams.',
    hierarchy: ['Red Hat UXD', 'Development'],
    groupAssignments: [
      { id: 'application-developers', name: 'application-developers', description: 'Application development team members', users: 15, roles: 3, lastModified: '10 Sep 2026' },
      { id: 'dev-ops-team', name: 'dev-ops-team', description: 'DevOps engineers and automation specialists', users: 8, roles: 3, lastModified: '01 Oct 2026' },
    ],
  },
  'cost-management': {
    name: 'Cost Management',
    description: 'Subscription tracking, spend analysis, and cost optimization resources.',
    hierarchy: ['Red Hat UXD', 'Cost Management'],
    groupAssignments: [
      { id: 'cost-management-admins', name: 'cost-management-admins', description: 'Cost and spend management administrators', users: 3, roles: 1, lastModified: '23 Aug 2026' },
    ],
  },
  'compliance-security': {
    name: 'Compliance & Security',
    description: 'Compliance auditing, vulnerability management, and security policy resources.',
    hierarchy: ['Red Hat UXD', 'Compliance & Security'],
    groupAssignments: [
      { id: 'security-reviewers', name: 'security-reviewers', description: 'Security compliance and vulnerability reviewers', users: 5, roles: 2, lastModified: '28 Sep 2026' },
      { id: 'rbac-admins', name: 'RBAC Admins', description: 'Role-based access control administrators', users: 5, roles: 16, lastModified: '23 Feb 2022' },
    ],
  },
  default: {
    name: 'Default',
    description: 'Default workspace for ungrouped and unassigned resources.',
    hierarchy: ['Red Hat UXD', 'Default'],
    groupAssignments: [
      { id: 'default-access', name: 'Default access', description: 'Default access for all organization members', users: 48, roles: 1, lastModified: '19 May 2021' },
      { id: 'default-admin-access', name: 'Default admin access', description: 'Default administrator access', users: 12, roles: 2, lastModified: '07 Apr 2022' },
    ],
  },
};

const WorkspaceDetail: React.FunctionComponent = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [activeSubTab, setActiveSubTab] = React.useState<string | number>(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const [kebabOpen, setKebabOpen] = React.useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);

  const workspace = workspaceId ? workspaceDetails[workspaceId] : undefined;
  const displayName = workspace?.name || workspaceId || 'Unknown';
  const description = workspace?.description || '';
  const hierarchy = workspace?.hierarchy || [displayName];
  const groupAssignments = workspace?.groupAssignments || [];

  const filteredGroups = searchValue
    ? groupAssignments.filter((g) => g.name.toLowerCase().includes(searchValue.toLowerCase()))
    : groupAssignments;

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(new Set(filteredGroups.map((g) => g.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/my-user-access');
            }}
          >
            Identity &amp; Access Management
          </BreadcrumbItem>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/user-access');
            }}
          >
            Access Management
          </BreadcrumbItem>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/workspaces');
            }}
          >
            Workspaces
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">
          {displayName}
        </Title>
        <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--xs)', color: 'var(--pf-t--global--text--color--subtle)' }}>
          {description}
        </Content>
        <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
          <strong>Workspace hierarchy:</strong>{' '}
          {hierarchy.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span style={{ margin: '0 4px' }}>&gt;</span>}
              {idx < hierarchy.length - 1 ? (
                <Button variant="link" isInline onClick={() => navigate(`/workspaces/${item.toLowerCase().replace(/\s+/g, '-')}`)}>
                  {item}
                </Button>
              ) : (
                <span>{item}</span>
              )}
            </React.Fragment>
          ))}
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_e, tabIndex) => setActiveTabKey(tabIndex)}
        >
          <Tab eventKey={0} title={<TabTitleText>Role assignments</TabTitleText>}>
            <div style={{ paddingTop: 'var(--pf-t--global--spacer--md)' }}>
              <Tabs
                activeKey={activeSubTab}
                onSelect={(_e, tabIndex) => setActiveSubTab(tabIndex)}
                isSubtab
              >
                <Tab eventKey={0} title={<TabTitleText>Roles assigned in this workspace</TabTitleText>}>
                  <div style={{ paddingTop: 'var(--pf-t--global--spacer--md)' }}>
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Checkbox
                            id="select-all-groups"
                            isChecked={selectAll}
                            onChange={(_event, checked) => handleSelectAll(checked)}
                            aria-label="Select all rows"
                          />
                          <Button variant="plain" aria-label="Bulk actions" style={{ paddingLeft: '4px' }}>
                            <AngleDownIcon />
                          </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                          <MenuToggle variant="plainText" aria-label="Filter type">
                            User name group
                          </MenuToggle>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search"
                            value={searchValue}
                            onChange={(_event, value) => setSearchValue(value)}
                            onClear={() => setSearchValue('')}
                            style={{ width: '200px' }}
                          />
                        </ToolbarItem>
                        <ToolbarItem>
                          <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                            Grant access
                          </Button>
                        </ToolbarItem>
                        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                          <Pagination
                            itemCount={filteredGroups.length}
                            perPage={10}
                            page={1}
                            isCompact
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    <Table aria-label="Role assignments table" className="iam-table">
                      <Thead>
                        <Tr>
                          <Th width={10} aria-label="Select" />
                          <Th width={20} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 0 }}>
                            User group name
                          </Th>
                          <Th sort={{ sortBy: {}, onSort: () => {}, columnIndex: 1 }}>Description</Th>
                          <Th width={10} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 2 }}>
                            Users
                          </Th>
                          <Th width={10} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 3 }}>
                            Roles
                          </Th>
                          <Th width={15} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 4 }}>
                            Last modified
                          </Th>
                          <Th width={10} aria-label="Actions" />
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredGroups.map((group) => (
                          <Tr key={group.id} isRowSelected={selectedRows.has(group.id)}>
                            <Td
                              dataLabel="Select"
                              select={{
                                rowIndex: 0,
                                onSelect: (_event, isSelected) => handleSelectRow(group.id, isSelected),
                                isSelected: selectedRows.has(group.id),
                              }}
                            />
                            <Td dataLabel="User group name">
                              <Button variant="link" isInline onClick={() => navigate(`/groups/${group.id}`)}>
                                {group.name}
                              </Button>
                            </Td>
                            <Td dataLabel="Description">{group.description}</Td>
                            <Td dataLabel="Users">{group.users}</Td>
                            <Td dataLabel="Roles">{group.roles}</Td>
                            <Td dataLabel="Last modified">{group.lastModified}</Td>
                            <Td dataLabel="Actions" isActionCell>
                              <Dropdown
                                isOpen={kebabOpen === group.id}
                                onSelect={() => setKebabOpen(null)}
                                onOpenChange={(isOpen) => setKebabOpen(isOpen ? group.id : null)}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="plain"
                                    onClick={() => setKebabOpen(kebabOpen === group.id ? null : group.id)}
                                    isExpanded={kebabOpen === group.id}
                                    aria-label={`Actions for ${group.name}`}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  <DropdownItem key="edit">Edit</DropdownItem>
                                  <DropdownItem key="remove" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                    Remove
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                        {filteredGroups.length === 0 && (
                          <Tr>
                            <Td colSpan={7}>
                              <div style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--2xl)' }}>
                                No user groups assigned to this workspace.
                              </div>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Roles assigned in parent workspaces</TabTitleText>}>
                  <div style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--2xl)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    No roles inherited from parent workspaces.
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Assets</TabTitleText>}>
            <div style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--2xl)', color: 'var(--pf-t--global--text--color--subtle)' }}>
              No assets assigned to this workspace.
            </div>
          </Tab>
        </Tabs>
      </PageSection>

      {isWizardOpen && (
        <GrantAccessWizard
          workspaceName={displayName}
          onClose={() => setIsWizardOpen(false)}
        />
      )}
    </>
  );
};

export { WorkspaceDetail };
