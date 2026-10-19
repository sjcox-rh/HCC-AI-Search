import * as React from 'react';
import {
  Button,
  Content,
  MenuToggle,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon } from '@patternfly/react-icons';

interface UserGroup {
  id: string;
  name: string;
  members: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: number;
}

interface GrantAccessWizardProps {
  workspaceName: string;
  onClose: () => void;
}

const availableGroups: UserGroup[] = [
  { id: 'platform-admins', name: 'platform-admins', members: 12 },
  { id: 'dev-ops-team', name: 'dev-ops-team', members: 8 },
  { id: 'security-reviewers', name: 'security-reviewers', members: 5 },
  { id: 'cloud-operators', name: 'cloud-operators', members: 6 },
  { id: 'application-developers', name: 'application-developers', members: 15 },
  { id: 'cost-management-admins', name: 'cost-management-admins', members: 3 },
  { id: 'default-access', name: 'Default access', members: 48 },
  { id: 'rbac-admins', name: 'RBAC Admins', members: 5 },
];

const availableRoles: Role[] = [
  { id: 'cloud-administrator', name: 'Cloud administrator', description: 'Perform any available operation on any source.', permissions: 8 },
  { id: 'compliance-administrator', name: 'Compliance administrator', description: 'Perform any available operation on Compliance resources.', permissions: 4 },
  { id: 'cost-administrator', name: 'Cost administrator', description: 'Perform any available operation on cost management resources.', permissions: 5 },
  { id: 'rbac-administrator', name: 'RBAC administrator', description: 'Perform any available operation on RBAC resources.', permissions: 6 },
  { id: 'automation-analytics-admin', name: 'Automation Analytics administrator', description: 'Perform any available operation on Automation Analytics resources.', permissions: 3 },
  { id: 'vulnerability-viewer', name: 'Vulnerability viewer', description: 'Perform read operations on Vulnerability resources.', permissions: 2 },
  { id: 'subscriptions-viewer', name: 'Subscriptions viewer', description: 'Perform read operations on any Subscriptions resource.', permissions: 2 },
];

const GrantAccessWizard: React.FunctionComponent<GrantAccessWizardProps> = ({ workspaceName, onClose }) => {
  const [selectedGroups, setSelectedGroups] = React.useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = React.useState<Set<string>>(new Set());
  const [groupSearch, setGroupSearch] = React.useState('');
  const [roleSearch, setRoleSearch] = React.useState('');

  const filteredGroups = groupSearch
    ? availableGroups.filter((g) => g.name.toLowerCase().includes(groupSearch.toLowerCase()))
    : availableGroups;

  const filteredRoles = roleSearch
    ? availableRoles.filter((r) => r.name.toLowerCase().includes(roleSearch.toLowerCase()))
    : availableRoles;

  const handleGroupSelect = (id: string, checked: boolean) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleRoleSelect = (id: string, checked: boolean) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectedGroupNames = availableGroups
    .filter((g) => selectedGroups.has(g.id))
    .map((g) => g.name)
    .join(', ');

  const selectedRoleNames = availableRoles
    .filter((r) => selectedRoles.has(r.id))
    .map((r) => r.name)
    .join(', ');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '900px',
          maxHeight: '80vh',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          borderRadius: 'var(--pf-t--global--border--radius--medium)',
          boxShadow: 'var(--pf-t--global--box-shadow--lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: 'var(--pf-t--global--spacer--lg)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title headingLevel="h1" size="xl">
              Grant access in {workspaceName}
            </Title>
            <Button variant="plain" aria-label="Close" onClick={onClose} style={{ marginTop: '-4px' }}>
              <EllipsisVIcon />
            </Button>
          </div>
          <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </Content>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <Wizard onClose={onClose} onSave={onClose}>
            <WizardStep name="Select user group(s)" id="step-groups">
              <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                <Title headingLevel="h3" size="lg">
                  Select user group(s) you want to grant access to
                </Title>
                <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Select the user group(s) you wish to grant access to. If you don&apos;t see the group you wish to select,
                  you must create a new group in{' '}
                  <Button variant="link" isInline>
                    Users and Groups
                  </Button>
                  .
                </Content>

                <Toolbar style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <ToolbarContent>
                    <ToolbarItem>
                      <MenuToggle variant="plainText" aria-label="Filter type">
                        User name group
                      </MenuToggle>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Search"
                        value={groupSearch}
                        onChange={(_event, value) => setGroupSearch(value)}
                        onClear={() => setGroupSearch('')}
                        style={{ width: '200px' }}
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Button variant="primary">Add group</Button>
                    </ToolbarItem>
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination itemCount={filteredGroups.length} perPage={10} page={1} isCompact />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                <Table aria-label="Select user groups" className="iam-table">
                  <Thead>
                    <Tr>
                      <Th width={10} aria-label="Select" />
                      <Th width={50} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 0 }}>
                        User group name
                      </Th>
                      <Th sort={{ sortBy: {}, onSort: () => {}, columnIndex: 1 }}>Members</Th>
                      <Th width={10} aria-label="Actions" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredGroups.map((group) => (
                      <Tr key={group.id} isRowSelected={selectedGroups.has(group.id)}>
                        <Td
                          dataLabel="Select"
                          select={{
                            rowIndex: 0,
                            onSelect: (_event, isSelected) => handleGroupSelect(group.id, isSelected),
                            isSelected: selectedGroups.has(group.id),
                          }}
                        />
                        <Td dataLabel="User group name">{group.name}</Td>
                        <Td dataLabel="Members">
                          <Button variant="link" isInline>
                            {group.members}
                          </Button>
                        </Td>
                        <Td dataLabel="Actions" isActionCell>
                          <Button variant="plain" aria-label={`Actions for ${group.name}`}>
                            <EllipsisVIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </WizardStep>

            <WizardStep name="Select role(s)" id="step-roles">
              <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                <Title headingLevel="h3" size="lg">
                  Select role(s) for {selectedGroupNames || 'the selected group'}
                </Title>
                <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Select one or more roles to link to this group.
                </Content>

                <Toolbar style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <ToolbarContent>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Search"
                        value={roleSearch}
                        onChange={(_event, value) => setRoleSearch(value)}
                        onClear={() => setRoleSearch('')}
                        style={{ width: '200px' }}
                      />
                    </ToolbarItem>
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination itemCount={filteredRoles.length} perPage={10} page={1} isCompact />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                <Table aria-label="Select roles" className="iam-table">
                  <Thead>
                    <Tr>
                      <Th width={10} aria-label="Select" />
                      <Th width={30} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 0 }}>
                        Name
                      </Th>
                      <Th sort={{ sortBy: {}, onSort: () => {}, columnIndex: 1 }}>Description</Th>
                      <Th width={15} sort={{ sortBy: {}, onSort: () => {}, columnIndex: 2 }}>
                        Permissions
                      </Th>
                      <Th width={10} aria-label="Actions" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRoles.map((role) => (
                      <Tr key={role.id} isRowSelected={selectedRoles.has(role.id)}>
                        <Td
                          dataLabel="Select"
                          select={{
                            rowIndex: 0,
                            onSelect: (_event, isSelected) => handleRoleSelect(role.id, isSelected),
                            isSelected: selectedRoles.has(role.id),
                          }}
                        />
                        <Td dataLabel="Name">{role.name}</Td>
                        <Td dataLabel="Description">{role.description}</Td>
                        <Td dataLabel="Permissions">
                          <Button variant="link" isInline>
                            {role.permissions}
                          </Button>
                        </Td>
                        <Td dataLabel="Actions" isActionCell>
                          <Button variant="plain" aria-label={`Actions for ${role.name}`}>
                            <EllipsisVIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </WizardStep>

            <WizardStep name="Review" id="step-review">
              <div style={{ padding: 'var(--pf-t--global--spacer--lg)' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  Review
                </Title>

                <div style={{ display: 'flex', gap: 'var(--pf-t--global--spacer--lg)', marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  <strong style={{ minWidth: '80px' }}>Group</strong>
                  <span>{selectedGroupNames || 'None selected'}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--pf-t--global--spacer--lg)' }}>
                  <strong style={{ minWidth: '80px' }}>Roles</strong>
                  <span>{selectedRoleNames || 'None selected'}</span>
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </div>
      </div>
    </div>
  );
};

export { GrantAccessWizard };
