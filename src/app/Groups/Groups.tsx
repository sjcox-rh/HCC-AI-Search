import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
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
import { AngleDownIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface GroupData {
  id: string;
  name: string;
  roles: number;
  members: number;
  lastModified: string;
}

const allGroups: GroupData[] = [
  { id: 'platform-admins', name: 'platform-admins', roles: 4, members: 12, lastModified: '07 Oct 2026' },
  { id: 'dev-ops-team', name: 'dev-ops-team', roles: 3, members: 8, lastModified: '01 Oct 2026' },
  { id: 'security-reviewers', name: 'security-reviewers', roles: 2, members: 5, lastModified: '28 Sep 2026' },
  { id: 'cloud-operators', name: 'cloud-operators', roles: 5, members: 6, lastModified: '15 Sep 2026' },
  { id: 'application-developers', name: 'application-developers', roles: 3, members: 15, lastModified: '10 Sep 2026' },
  { id: 'cost-management-admins', name: 'cost-management-admins', roles: 1, members: 3, lastModified: '23 Aug 2026' },
  { id: 'default-access', name: 'Default access', roles: 0, members: 0, lastModified: '19 May 2021' },
  { id: 'default-admin-access', name: 'Default admin access', roles: 0, members: 0, lastModified: '07 Apr 2022' },
  { id: 'rbac-admins', name: 'RBAC Admins', roles: 16, members: 5, lastModified: '23 Feb 2022' },
];

const Groups: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState(searchParams.get('filter') || '');
  const [activeSortIndex, setActiveSortIndex] = React.useState(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [rowMenuOpen, setRowMenuOpen] = React.useState<string | null>(null);

  const filteredGroups = React.useMemo(() => {
    if (!searchValue) return allGroups;
    const q = searchValue.toLowerCase();
    return allGroups.filter((g) => g.name.toLowerCase().includes(q));
  }, [searchValue]);

  const paginatedGroups = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredGroups.slice(start, start + perPage);
  }, [filteredGroups, page, perPage]);

  const allSelected = paginatedGroups.length > 0 && paginatedGroups.every((g) => selectedRows.includes(g.id));
  const someSelected = paginatedGroups.some((g) => selectedRows.includes(g.id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? paginatedGroups.map((g) => g.id) : []);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRows((prev) => (checked ? [...prev, id] : prev.filter((r) => r !== id)));
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
          <BreadcrumbItem isActive>Groups</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Groups</Title>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Checkbox
                id="select-all-groups"
                isChecked={allSelected ? true : someSelected ? null : false}
                onChange={(_e, checked) => handleSelectAll(checked)}
                aria-label="Select all groups"
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
                value={searchValue}
                onChange={(_e, value) => { setSearchValue(value); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={() => navigate('/groups/new')}>
                Create group
              </Button>
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredGroups.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp, p) => { setPerPage(pp); setPage(p); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Groups table" className="iam-table">
          <Thead>
            <Tr>
              <Th screenReaderText="Select" width={10} />
              <Th
                width={30}
                sort={{
                  sortBy: { index: activeSortIndex, direction: activeSortDirection },
                  onSort: (_e, idx, dir) => { setActiveSortIndex(idx); setActiveSortDirection(dir); },
                  columnIndex: 0,
                }}
              >
                Name
              </Th>
              <Th width={15}>Roles</Th>
              <Th width={15}>Members</Th>
              <Th
                width={20}
                sort={{
                  sortBy: { index: activeSortIndex, direction: activeSortDirection },
                  onSort: (_e, idx, dir) => { setActiveSortIndex(idx); setActiveSortDirection(dir); },
                  columnIndex: 4,
                }}
              >
                Last modified
              </Th>
              <Th screenReaderText="Actions" width={10} />
            </Tr>
          </Thead>
          <Tbody>
            {paginatedGroups.map((group) => (
              <Tr key={group.id} isRowSelected={selectedRows.includes(group.id)}>
                <Td
                  select={{
                    rowIndex: 0,
                    onSelect: (_e, checked) => handleRowSelect(group.id, checked),
                    isSelected: selectedRows.includes(group.id),
                  }}
                />
                <Td dataLabel="Name">
                  <Button variant="link" isInline onClick={() => navigate(`/groups/${group.id}`)}>
                    {group.name}
                  </Button>
                </Td>
                <Td dataLabel="Roles">
                  <Button variant="link" isInline onClick={() => navigate(`/groups/${group.id}`)}>
                    {group.roles}
                  </Button>
                </Td>
                <Td dataLabel="Members">
                  <Button variant="link" isInline onClick={() => navigate(`/groups/${group.id}?tab=members`)}>
                    {group.members}
                  </Button>
                </Td>
                <Td dataLabel="Last modified">{group.lastModified}</Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={rowMenuOpen === group.id}
                    onOpenChange={(open) => setRowMenuOpen(open ? group.id : null)}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="plain"
                        aria-label={`Actions for ${group.name}`}
                        onClick={() => setRowMenuOpen(rowMenuOpen === group.id ? null : group.id)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination" style={{ marginInlineStart: 'auto' }}>
              <Pagination
                itemCount={filteredGroups.length}
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

export { Groups };
