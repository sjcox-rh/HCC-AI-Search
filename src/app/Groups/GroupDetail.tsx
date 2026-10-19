import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Content,
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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface RoleRow {
  id: string;
  name: string;
  description: string;
  lastModified: string;
}

interface MemberRow {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}

interface ServiceAccountRow {
  id: string;
  name: string;
  clientId: string;
  description: string;
  createdAt: string;
}

interface GroupInfo {
  name: string;
  roles: RoleRow[];
  members: MemberRow[];
  serviceAccounts: ServiceAccountRow[];
}

const groupData: Record<string, GroupInfo> = {
  'platform-admins': {
    name: 'platform-admins',
    roles: [
      { id: 'cloud-administrator', name: 'Cloud administrator', description: 'Perform any available operation on any source.', lastModified: '29 Jun 2026' },
      { id: 'compliance-administrator', name: 'Compliance administrator', description: 'Perform any available operation on Compliance resources.', lastModified: '29 Jun 2026' },
      { id: 'cost-administrator', name: 'Cost administrator', description: 'Perform any available operation on cost management resources.', lastModified: '29 Jun 2026' },
      { id: 'rbac-administrator', name: 'RBAC administrator', description: 'Perform any available operation on RBAC resources.', lastModified: '29 Jun 2026' },
    ],
    members: [
      { id: 'm1', username: 'sjcox', email: 'sjcox@redhat.com', firstName: 'Sarah', lastName: 'Cox', status: 'Active' },
      { id: 'm2', username: 'jsmith', email: 'jsmith@redhat.com', firstName: 'John', lastName: 'Smith', status: 'Active' },
      { id: 'm3', username: 'agarcia', email: 'agarcia@redhat.com', firstName: 'Ana', lastName: 'Garcia', status: 'Active' },
      { id: 'm4', username: 'mchen', email: 'mchen@redhat.com', firstName: 'Michael', lastName: 'Chen', status: 'Active' },
      { id: 'm5', username: 'kpatel', email: 'kpatel@redhat.com', firstName: 'Kavita', lastName: 'Patel', status: 'Active' },
      { id: 'm6', username: 'rwilson', email: 'rwilson@redhat.com', firstName: 'Rachel', lastName: 'Wilson', status: 'Active' },
      { id: 'm7', username: 'dlee', email: 'dlee@redhat.com', firstName: 'David', lastName: 'Lee', status: 'Active' },
      { id: 'm8', username: 'nbrown', email: 'nbrown@redhat.com', firstName: 'Nancy', lastName: 'Brown', status: 'Active' },
      { id: 'm9', username: 'tmartin', email: 'tmartin@redhat.com', firstName: 'Tom', lastName: 'Martin', status: 'Active' },
      { id: 'm10', username: 'ljones', email: 'ljones@redhat.com', firstName: 'Lisa', lastName: 'Jones', status: 'Active' },
      { id: 'm11', username: 'bwright', email: 'bwright@redhat.com', firstName: 'Brian', lastName: 'Wright', status: 'Active' },
      { id: 'm12', username: 'elopez', email: 'elopez@redhat.com', firstName: 'Elena', lastName: 'Lopez', status: 'Active' },
    ],
    serviceAccounts: [
      { id: 'sa1', name: 'platform-ci-bot', clientId: 'sa-platform-ci-bot', description: 'CI/CD pipeline automation account', createdAt: '15 Mar 2026' },
    ],
  },
  'dev-ops-team': {
    name: 'dev-ops-team',
    roles: [
      { id: 'automation-analytics-admin', name: 'Automation Analytics administrator', description: 'Perform any available operation on Automation Analytics resources.', lastModified: '29 Jun 2026' },
      { id: 'automation-analytics-editor', name: 'Automation Analytics editor', description: 'Perform read and update operations on Automation Analytics resources.', lastModified: '29 Jun 2026' },
      { id: 'content-template-admin', name: 'Content Template administrator', description: 'Perform any available operation on any Content Template resource.', lastModified: '02 Oct 2026' },
    ],
    members: [
      { id: 'm1', username: 'kpatel', email: 'kpatel@redhat.com', firstName: 'Kavita', lastName: 'Patel', status: 'Active' },
      { id: 'm2', username: 'rwilson', email: 'rwilson@redhat.com', firstName: 'Rachel', lastName: 'Wilson', status: 'Active' },
      { id: 'm3', username: 'dlee', email: 'dlee@redhat.com', firstName: 'David', lastName: 'Lee', status: 'Active' },
      { id: 'm4', username: 'tmartin', email: 'tmartin@redhat.com', firstName: 'Tom', lastName: 'Martin', status: 'Active' },
      { id: 'm5', username: 'ljones', email: 'ljones@redhat.com', firstName: 'Lisa', lastName: 'Jones', status: 'Active' },
      { id: 'm6', username: 'bwright', email: 'bwright@redhat.com', firstName: 'Brian', lastName: 'Wright', status: 'Active' },
      { id: 'm7', username: 'nhall', email: 'nhall@redhat.com', firstName: 'Nathan', lastName: 'Hall', status: 'Active' },
      { id: 'm8', username: 'syang', email: 'syang@redhat.com', firstName: 'Sophie', lastName: 'Yang', status: 'Active' },
    ],
    serviceAccounts: [],
  },
  'security-reviewers': {
    name: 'security-reviewers',
    roles: [
      { id: 'compliance-viewer', name: 'Compliance viewer', description: 'Perform read operations on Compliance resources.', lastModified: '29 Jun 2026' },
      { id: 'vulnerability-viewer', name: 'Vulnerability viewer', description: 'Perform read operations on Vulnerability resources.', lastModified: '29 Jun 2026' },
    ],
    members: [
      { id: 'm1', username: 'agarcia', email: 'agarcia@redhat.com', firstName: 'Ana', lastName: 'Garcia', status: 'Active' },
      { id: 'm2', username: 'mchen', email: 'mchen@redhat.com', firstName: 'Michael', lastName: 'Chen', status: 'Active' },
      { id: 'm3', username: 'nbrown', email: 'nbrown@redhat.com', firstName: 'Nancy', lastName: 'Brown', status: 'Active' },
      { id: 'm4', username: 'elopez', email: 'elopez@redhat.com', firstName: 'Elena', lastName: 'Lopez', status: 'Active' },
      { id: 'm5', username: 'jkim', email: 'jkim@redhat.com', firstName: 'Jae', lastName: 'Kim', status: 'Active' },
    ],
    serviceAccounts: [],
  },
  'cloud-operators': {
    name: 'cloud-operators',
    roles: [
      { id: 'cloud-administrator', name: 'Cloud administrator', description: 'Perform any available operation on any source.', lastModified: '29 Jun 2026' },
      { id: 'cost-cloud-viewer', name: 'Cost cloud viewer', description: 'Perform read operations on cost reports related to cloud sources.', lastModified: '19 Jun 2026' },
      { id: 'cost-openshift-viewer', name: 'Cost OpenShift viewer', description: 'Perform read operations on cost reports related to OpenShift sources.', lastModified: '29 Jun 2026' },
      { id: 'subscriptions-viewer', name: 'Subscriptions viewer', description: 'Perform read operations on any Subscriptions resource.', lastModified: '02 Jun 2026' },
      { id: 'content-template-viewer', name: 'Content Template viewer', description: 'Perform read-only operations on Content Template resources.', lastModified: '02 Oct 2026' },
    ],
    members: [
      { id: 'm1', username: 'jsmith', email: 'jsmith@redhat.com', firstName: 'John', lastName: 'Smith', status: 'Active' },
      { id: 'm2', username: 'dlee', email: 'dlee@redhat.com', firstName: 'David', lastName: 'Lee', status: 'Active' },
      { id: 'm3', username: 'rwilson', email: 'rwilson@redhat.com', firstName: 'Rachel', lastName: 'Wilson', status: 'Active' },
      { id: 'm4', username: 'nhall', email: 'nhall@redhat.com', firstName: 'Nathan', lastName: 'Hall', status: 'Active' },
      { id: 'm5', username: 'syang', email: 'syang@redhat.com', firstName: 'Sophie', lastName: 'Yang', status: 'Active' },
      { id: 'm6', username: 'adiaz', email: 'adiaz@redhat.com', firstName: 'Antonio', lastName: 'Diaz', status: 'Active' },
    ],
    serviceAccounts: [
      { id: 'sa1', name: 'cloud-monitor-bot', clientId: 'sa-cloud-monitor', description: 'Cloud infrastructure monitoring account', createdAt: '20 May 2026' },
    ],
  },
  'application-developers': {
    name: 'application-developers',
    roles: [
      { id: 'automation-analytics-viewer', name: 'Automation Analytics viewer', description: 'Perform read operations on Automation Analytics resources.', lastModified: '29 Jun 2026' },
      { id: 'content-template-viewer', name: 'Content Template viewer', description: 'Perform read-only operations on Content Template resources.', lastModified: '02 Oct 2026' },
      { id: 'compliance-viewer', name: 'Compliance viewer', description: 'Perform read operations on Compliance resources.', lastModified: '29 Jun 2026' },
    ],
    members: [
      { id: 'm1', username: 'sjcox', email: 'sjcox@redhat.com', firstName: 'Sarah', lastName: 'Cox', status: 'Active' },
      { id: 'm2', username: 'kpatel', email: 'kpatel@redhat.com', firstName: 'Kavita', lastName: 'Patel', status: 'Active' },
      { id: 'm3', username: 'tmartin', email: 'tmartin@redhat.com', firstName: 'Tom', lastName: 'Martin', status: 'Active' },
      { id: 'm4', username: 'ljones', email: 'ljones@redhat.com', firstName: 'Lisa', lastName: 'Jones', status: 'Active' },
      { id: 'm5', username: 'bwright', email: 'bwright@redhat.com', firstName: 'Brian', lastName: 'Wright', status: 'Active' },
      { id: 'm6', username: 'elopez', email: 'elopez@redhat.com', firstName: 'Elena', lastName: 'Lopez', status: 'Active' },
      { id: 'm7', username: 'jkim', email: 'jkim@redhat.com', firstName: 'Jae', lastName: 'Kim', status: 'Active' },
      { id: 'm8', username: 'syang', email: 'syang@redhat.com', firstName: 'Sophie', lastName: 'Yang', status: 'Active' },
      { id: 'm9', username: 'nhall', email: 'nhall@redhat.com', firstName: 'Nathan', lastName: 'Hall', status: 'Active' },
      { id: 'm10', username: 'adiaz', email: 'adiaz@redhat.com', firstName: 'Antonio', lastName: 'Diaz', status: 'Active' },
      { id: 'm11', username: 'cfreeman', email: 'cfreeman@redhat.com', firstName: 'Chris', lastName: 'Freeman', status: 'Active' },
      { id: 'm12', username: 'pmurphy', email: 'pmurphy@redhat.com', firstName: 'Paula', lastName: 'Murphy', status: 'Active' },
      { id: 'm13', username: 'rperez', email: 'rperez@redhat.com', firstName: 'Rosa', lastName: 'Perez', status: 'Active' },
      { id: 'm14', username: 'wthompson', email: 'wthompson@redhat.com', firstName: 'Will', lastName: 'Thompson', status: 'Active' },
      { id: 'm15', username: 'hdavis', email: 'hdavis@redhat.com', firstName: 'Hannah', lastName: 'Davis', status: 'Active' },
    ],
    serviceAccounts: [],
  },
  'cost-management-admins': {
    name: 'cost-management-admins',
    roles: [
      { id: 'cost-administrator', name: 'Cost administrator', description: 'Perform any available operation on cost management resources.', lastModified: '29 Jun 2026' },
    ],
    members: [
      { id: 'm1', username: 'jsmith', email: 'jsmith@redhat.com', firstName: 'John', lastName: 'Smith', status: 'Active' },
      { id: 'm2', username: 'nbrown', email: 'nbrown@redhat.com', firstName: 'Nancy', lastName: 'Brown', status: 'Active' },
      { id: 'm3', username: 'mchen', email: 'mchen@redhat.com', firstName: 'Michael', lastName: 'Chen', status: 'Active' },
    ],
    serviceAccounts: [],
  },
};

const GroupDetail: React.FunctionComponent = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'members' ? 1 : tabParam === 'service-accounts' ? 2 : 0;
  const [activeTab, setActiveTab] = React.useState<number>(initialTab);
  const [roleSearch, setRoleSearch] = React.useState('');
  const [memberSearch, setMemberSearch] = React.useState('');
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [rolePage, setRolePage] = React.useState(1);
  const [memberPage, setMemberPage] = React.useState(1);

  const group = groupData[groupId || ''];
  if (!group) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Content><p>Group not found.</p></Content>
      </PageSection>
    );
  }

  const filteredRoles = roleSearch
    ? group.roles.filter((r) => r.name.toLowerCase().includes(roleSearch.toLowerCase()))
    : group.roles;

  const filteredMembers = memberSearch
    ? group.members.filter(
        (m) =>
          m.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.firstName.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.lastName.toLowerCase().includes(memberSearch.toLowerCase()),
      )
    : group.members;

  const allRolesSelected = filteredRoles.length > 0 && filteredRoles.every((r) => selectedRoles.includes(r.id));
  const someRolesSelected = filteredRoles.some((r) => selectedRoles.includes(r.id));

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
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/groups'); }}>
            Groups
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{group.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">{group.name}</Title>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(_e, key) => setActiveTab(key as number)}
        >
          {/* ── Roles tab ── */}
          <Tab eventKey={0} title={<TabTitleText>Roles</TabTitleText>}>
            <div style={{ paddingBlockStart: 'var(--pf-t--global--spacer--md)' }}>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <Checkbox
                      id="select-all-roles"
                      isChecked={allRolesSelected ? true : someRolesSelected ? null : false}
                      onChange={(_e, checked) =>
                        setSelectedRoles(checked ? filteredRoles.map((r) => r.id) : [])
                      }
                      aria-label="Select all roles"
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <MenuToggle variant="plain" aria-label="Select bulk action">
                      <AngleDownIcon />
                    </MenuToggle>
                  </ToolbarItem>
                  <ToolbarItem>
                    <MenuToggle variant="secondary">Name</MenuToggle>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by name"
                      value={roleSearch}
                      onChange={(_e, v) => { setRoleSearch(v); setRolePage(1); }}
                      onClear={() => { setRoleSearch(''); setRolePage(1); }}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="primary">Add role</Button>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination">
                    <Pagination
                      itemCount={filteredRoles.length}
                      perPage={10}
                      page={rolePage}
                      onSetPage={(_e, p) => setRolePage(p)}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Roles in group" className="iam-table">
                <Thead>
                  <Tr>
                    <Th screenReaderText="Select" width={10} />
                    <Th width={30}>Name</Th>
                    <Th width={45}>Description</Th>
                    <Th width={15}>Last modified</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredRoles.map((role) => (
                    <Tr key={role.id} isRowSelected={selectedRoles.includes(role.id)}>
                      <Td
                        select={{
                          rowIndex: 0,
                          onSelect: (_e, checked) =>
                            setSelectedRoles((prev) =>
                              checked ? [...prev, role.id] : prev.filter((r) => r !== role.id),
                            ),
                          isSelected: selectedRoles.includes(role.id),
                        }}
                      />
                      <Td dataLabel="Name">
                        <Button variant="link" isInline onClick={() => navigate(`/roles/${role.id}`)}>
                          {role.name}
                        </Button>
                      </Td>
                      <Td dataLabel="Description">{role.description}</Td>
                      <Td dataLabel="Last modified">{role.lastModified}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem variant="pagination" style={{ marginInlineStart: 'auto' }}>
                    <Pagination
                      itemCount={filteredRoles.length}
                      perPage={10}
                      page={rolePage}
                      onSetPage={(_e, p) => setRolePage(p)}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </div>
          </Tab>

          {/* ── Members tab ── */}
          <Tab eventKey={1} title={<TabTitleText>Members</TabTitleText>}>
            <div style={{ paddingBlockStart: 'var(--pf-t--global--spacer--md)' }}>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by username"
                      value={memberSearch}
                      onChange={(_e, v) => { setMemberSearch(v); setMemberPage(1); }}
                      onClear={() => { setMemberSearch(''); setMemberPage(1); }}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="primary">Add member</Button>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination">
                    <Pagination
                      itemCount={filteredMembers.length}
                      perPage={10}
                      page={memberPage}
                      onSetPage={(_e, p) => setMemberPage(p)}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Members in group" className="iam-table">
                <Thead>
                  <Tr>
                    <Th width={20}>Username</Th>
                    <Th width={30}>Email</Th>
                    <Th width={15}>First name</Th>
                    <Th width={15}>Last name</Th>
                    <Th width={15}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredMembers.map((m) => (
                    <Tr key={m.id}>
                      <Td dataLabel="Username">{m.username}</Td>
                      <Td dataLabel="Email">{m.email}</Td>
                      <Td dataLabel="First name">{m.firstName}</Td>
                      <Td dataLabel="Last name">{m.lastName}</Td>
                      <Td dataLabel="Status">{m.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Tab>

          {/* ── Service accounts tab ── */}
          <Tab eventKey={2} title={<TabTitleText>Service accounts</TabTitleText>}>
            <div style={{ paddingBlockStart: 'var(--pf-t--global--spacer--md)' }}>
              {group.serviceAccounts.length === 0 ? (
                <Content style={{ paddingBlock: 'var(--pf-t--global--spacer--xl)', textAlign: 'center' }}>
                  <p>No service accounts are assigned to this group.</p>
                  <Button variant="primary" style={{ marginBlockStart: 'var(--pf-t--global--spacer--md)' }}>
                    Add service account
                  </Button>
                </Content>
              ) : (
                <Table aria-label="Service accounts in group" className="iam-table">
                  <Thead>
                    <Tr>
                      <Th width={25}>Name</Th>
                      <Th width={25}>Client ID</Th>
                      <Th width={30}>Description</Th>
                      <Th width={15}>Created</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {group.serviceAccounts.map((sa) => (
                      <Tr key={sa.id}>
                        <Td dataLabel="Name">{sa.name}</Td>
                        <Td dataLabel="Client ID"><code>{sa.clientId}</code></Td>
                        <Td dataLabel="Description">{sa.description}</Td>
                        <Td dataLabel="Created">{sa.createdAt}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </div>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { GroupDetail };
