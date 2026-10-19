import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';

interface RoleData {
  id: string;
  name: string;
  description: string;
  groups: number;
  permissions: number;
  lastModified: string;
}

const allRoles: RoleData[] = [
  { id: 'ansible-lightspeed-admin', name: 'Ansible Lightspeed administrator', description: 'Perform read operations for Organization Administrators on all Lightspeed charts.', groups: 1, permissions: 4, lastModified: '29 Jun 2026' },
  { id: 'automation-analytics-admin', name: 'Automation Analytics administrator', description: 'Perform any available operation on Automation Analytics resources.', groups: 2, permissions: 1, lastModified: '29 Jun 2026' },
  { id: 'automation-analytics-editor', name: 'Automation Analytics editor', description: 'Perform read and update operations on Automation Analytics resources.', groups: 3, permissions: 2, lastModified: '29 Jun 2026' },
  { id: 'automation-analytics-viewer', name: 'Automation Analytics viewer', description: 'Perform read operations on Automation Analytics resources.', groups: 3, permissions: 1, lastModified: '29 Jun 2026' },
  { id: 'cloud-administrator', name: 'Cloud administrator', description: 'Perform any available operation on any source.', groups: 4, permissions: 1, lastModified: '29 Jun 2026' },
  { id: 'compliance-administrator', name: 'Compliance administrator', description: 'Perform any available operation on Compliance resources.', groups: 3, permissions: 3, lastModified: '29 Jun 2026' },
  { id: 'compliance-viewer', name: 'Compliance viewer', description: 'Perform read operations on Compliance resources.', groups: 1, permissions: 4, lastModified: '29 Jun 2026' },
  { id: 'content-template-administrator', name: 'Content Template administrator', description: 'Perform any available operation on any Content Template resource.', groups: 1, permissions: 3, lastModified: '02 Oct 2026' },
  { id: 'content-template-viewer', name: 'Content Template viewer', description: 'Perform read-only operations on Content Template resources.', groups: 1, permissions: 2, lastModified: '02 Oct 2026' },
  { id: 'cost-administrator', name: 'Cost administrator', description: 'Perform any available operation on cost management resources.', groups: 1, permissions: 1, lastModified: '29 Jun 2026' },
  { id: 'cost-cloud-viewer', name: 'Cost cloud viewer', description: 'Perform read operations on cost reports related to cloud sources.', groups: 0, permissions: 5, lastModified: '19 Jun 2026' },
  { id: 'cost-openshift-viewer', name: 'Cost OpenShift viewer', description: 'Perform read operations on cost reports related to OpenShift sources.', groups: 0, permissions: 1, lastModified: '29 Jun 2026' },
  { id: 'cost-price-list-administrator', name: 'Cost Price List administrator', description: 'Perform read and write operations on cost models.', groups: 0, permissions: 2, lastModified: '29 Jun 2026' },
  { id: 'cost-price-list-viewer', name: 'Cost Price List viewer', description: 'Perform read operations on cost models.', groups: 0, permissions: 2, lastModified: '29 Jun 2026' },
  { id: 'rbac-administrator', name: 'RBAC administrator', description: 'Perform any available operation on RBAC resources.', groups: 1, permissions: 4, lastModified: '29 Jun 2026' },
  { id: 'subscriptions-viewer', name: 'Subscriptions viewer', description: 'Perform read operations on any Subscriptions resource.', groups: 1, permissions: 1, lastModified: '02 Jun 2026' },
  { id: 'vulnerability-viewer', name: 'Vulnerability viewer', description: 'Perform read operations on Vulnerability resources.', groups: 1, permissions: 3, lastModified: '29 Jun 2026' },
  { id: 'alert-overrider', name: 'Alert overrider', description: 'Override workspace default alert settings for themselves in their personal alert preferences.', groups: 1, permissions: 2, lastModified: '04 Sep 2025' },
].sort((a, b) => a.name.localeCompare(b.name));

const Roles: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchValue, setSearchValue] = React.useState('');
  const [activeSortIndex, setActiveSortIndex] = React.useState(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filteredRoles = React.useMemo(() => {
    let result = allRoles;
    if (searchValue) {
      const q = searchValue.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [searchValue]);

  const paginatedRoles = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRoles.slice(start, start + perPage);
  }, [filteredRoles, page, perPage]);

  const handleRoleClick = (roleId: string) => {
    if (roleId === 'alert-overrider') {
      navigate('/user-access/roles/alert-overrider');
    } else {
      navigate(`/roles/${roleId}`);
    }
  };

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
          <BreadcrumbItem isActive>Roles</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Roles</Title>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <MenuToggle variant="secondary">Name</MenuToggle>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Filter by name"
                value={searchValue}
                onChange={(_e, value) => { setSearchValue(value); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary">Create role</Button>
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredRoles.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Roles table" className="iam-table">
          <Thead>
            <Tr>
              <Th
                width={25}
                sort={{
                  sortBy: { index: activeSortIndex, direction: activeSortDirection },
                  onSort: (_e, idx, dir) => { setActiveSortIndex(idx); setActiveSortDirection(dir); },
                  columnIndex: 0,
                }}
              >
                Name
              </Th>
              <Th width={40}>Description</Th>
              <Th width={10}>Groups</Th>
              <Th width={10}>Perm…</Th>
              <Th
                width={15}
                sort={{
                  sortBy: { index: activeSortIndex, direction: activeSortDirection },
                  onSort: (_e, idx, dir) => { setActiveSortIndex(idx); setActiveSortDirection(dir); },
                  columnIndex: 4,
                }}
              >
                Last…
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRoles.map((role) => (
              <Tr key={role.id}>
                <Td dataLabel="Name">
                  <Button variant="link" isInline onClick={() => handleRoleClick(role.id)}>
                    {role.name}
                  </Button>
                </Td>
                <Td dataLabel="Description">{role.description}</Td>
                <Td dataLabel="Groups">
                  <Button variant="link" isInline onClick={() => handleRoleClick(role.id)}>
                    {role.groups}
                  </Button>
                </Td>
                <Td dataLabel="Permissions">
                  <Button variant="link" isInline onClick={() => handleRoleClick(role.id)}>
                    {role.permissions}
                  </Button>
                </Td>
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
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
    </>
  );
};

export { Roles };
