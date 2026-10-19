import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
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
import { AngleRightIcon, AngleDownIcon, EllipsisVIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

interface WorkspaceRow {
  id: string;
  name: string;
  description: string;
  level: number;
  parent?: string;
  children?: string[];
}

const workspaceData: WorkspaceRow[] = [
  {
    id: 'red-hat-uxd',
    name: 'Red Hat UXD',
    description: 'Root workspace for the UXD organization.',
    level: 0,
    children: ['production', 'development', 'cost-management', 'compliance-security', 'default'],
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Production infrastructure, clusters, and host systems.',
    level: 1,
    parent: 'red-hat-uxd',
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Development and staging environments for application teams.',
    level: 1,
    parent: 'red-hat-uxd',
  },
  {
    id: 'cost-management',
    name: 'Cost Management',
    description: 'Subscription tracking, spend analysis, and cost optimization resources.',
    level: 1,
    parent: 'red-hat-uxd',
  },
  {
    id: 'compliance-security',
    name: 'Compliance & Security',
    description: 'Compliance auditing, vulnerability management, and security policy resources.',
    level: 1,
    parent: 'red-hat-uxd',
  },
  {
    id: 'default',
    name: 'Default',
    description: 'Default workspace for ungrouped and unassigned resources.',
    level: 1,
    parent: 'red-hat-uxd',
  },
];

const Workspaces: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set(['red-hat-uxd']));
  const [searchValue, setSearchValue] = React.useState('');
  const [kebabOpen, setKebabOpen] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const parents = workspaceData.filter((w) => w.children && w.children.length > 0).map((w) => w.id);
    setExpandedRows(new Set(parents));
  };

  const visibleRows = workspaceData.filter((row) => {
    if (row.level === 0) return true;
    if (row.parent && expandedRows.has(row.parent)) return true;
    return false;
  });

  const filteredRows = searchValue
    ? visibleRows.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()))
    : visibleRows;

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
            User Access
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Workspaces</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">
          Workspaces
        </Title>
        <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Workspaces provide a flexible, hierarchical, approach to organizing your assets and streamlining access
          management. Configure workspaces to fit your organizational structure.
        </Content>
        <Button
          variant="link"
          isInline
          icon={<ExternalLinkAltIcon />}
          iconPosition="end"
          component="a"
          href="#"
          style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}
        >
          Learn more about workspaces
        </Button>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Find by name"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                style={{ width: '240px' }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={() => {}}>
                Create workspace
              </Button>
            </ToolbarItem>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredRows.length}
                perPage={10}
                page={1}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Workspaces table" className="iam-table">
          <Thead>
            <Tr>
              <Th width={10} aria-label="Expand">
                <Button variant="plain" aria-label="Expand all" onClick={expandAll} style={{ padding: 0 }}>
                  <AngleRightIcon />
                </Button>
              </Th>
              <Th width={30}>Name</Th>
              <Th>Description</Th>
              <Th width={10} aria-label="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {filteredRows.map((row) => (
              <Tr
                key={row.id}
                style={row.level > 0 ? { paddingLeft: `${row.level * 32}px` } : undefined}
              >
                <Td dataLabel="Expand">
                  {row.children && row.children.length > 0 ? (
                    <Button
                      variant="plain"
                      aria-label={expandedRows.has(row.id) ? 'Collapse' : 'Expand'}
                      onClick={() => toggleExpand(row.id)}
                      style={{ padding: 0 }}
                    >
                      {expandedRows.has(row.id) ? <AngleDownIcon /> : <AngleRightIcon />}
                    </Button>
                  ) : (
                    <span style={{ display: 'inline-block', width: '24px', paddingLeft: row.level > 0 ? '16px' : '0' }} />
                  )}
                </Td>
                <Td dataLabel="Name">
                  <Button
                    variant="link"
                    isInline
                    onClick={() => navigate(`/workspaces/${row.id}`)}
                  >
                    {row.name}
                  </Button>
                </Td>
                <Td dataLabel="Description">{row.description}</Td>
                <Td dataLabel="Actions" isActionCell>
                  <Dropdown
                    isOpen={kebabOpen === row.id}
                    onSelect={() => setKebabOpen(null)}
                    onOpenChange={(isOpen) => setKebabOpen(isOpen ? row.id : null)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="plain"
                        onClick={() => setKebabOpen(kebabOpen === row.id ? null : row.id)}
                        isExpanded={kebabOpen === row.id}
                        aria-label={`Actions for ${row.name}`}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    popperProps={{ position: 'right' }}
                  >
                    <DropdownList>
                      <DropdownItem key="edit">Edit</DropdownItem>
                      <DropdownItem key="delete" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                        Delete
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
};

export { Workspaces };
