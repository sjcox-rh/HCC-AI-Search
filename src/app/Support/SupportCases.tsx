import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  ContentVariants,
  Divider,
  Flex,
  FlexItem,
  Label,
  PageBreadcrumb,
  PageSection,
  Pagination,
  SearchInput,
  Split,
  SplitItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import './Support.css';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

interface SupportCase {
  id: string;
  subject: string;
  severity: string;
  severityColor: 'red' | 'orange' | 'blue' | 'grey';
  status: string;
  statusIcon: React.ReactNode;
  product: string;
  owner: string;
  opened: string;
  updated: string;
}

const allCases: SupportCase[] = [
  {
    id: '03093474',
    subject: 'OpenShift upgrade stuck at 87% — multiple operators degraded',
    severity: 'Urgent',
    severityColor: 'red',
    status: 'Waiting on Red Hat',
    statusIcon: <ClockIcon color="var(--pf-t--global--icon--color--status--warning--default)" />,
    product: 'OpenShift Container Platform 4.16',
    owner: 'John Smith',
    opened: 'Oct 13, 2026',
    updated: '2 hours ago',
  },
  {
    id: '03091822',
    subject: 'RHEL 9.3 kernel panic on boot after latest errata update',
    severity: 'High',
    severityColor: 'orange',
    status: 'Waiting on Red Hat',
    statusIcon: <ClockIcon color="var(--pf-t--global--icon--color--status--warning--default)" />,
    product: 'Red Hat Enterprise Linux 9.3',
    owner: 'John Smith',
    opened: 'Oct 12, 2026',
    updated: '5 hours ago',
  },
  {
    id: '03089105',
    subject: 'Subscription Manager unable to register new RHEL systems',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Waiting on Customer',
    statusIcon: <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--info--default)" />,
    product: 'Red Hat Enterprise Linux 9.4',
    owner: 'Sarah Chen',
    opened: 'Oct 10, 2026',
    updated: '1 day ago',
  },
  {
    id: '03087331',
    subject: 'Insights client failing to upload advisor data',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Waiting on Customer',
    statusIcon: <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--info--default)" />,
    product: 'Red Hat Insights',
    owner: 'John Smith',
    opened: 'Oct 8, 2026',
    updated: '2 days ago',
  },
  {
    id: '03085990',
    subject: 'Cannot deploy application on ROSA cluster — pod scheduling failures',
    severity: 'High',
    severityColor: 'orange',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'Red Hat OpenShift Service on AWS',
    owner: 'Mike Davis',
    opened: 'Oct 5, 2026',
    updated: '3 days ago',
  },
  {
    id: '03084201',
    subject: 'AAP controller license expiration warning',
    severity: 'Low',
    severityColor: 'grey',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'Ansible Automation Platform 2.4',
    owner: 'Sarah Chen',
    opened: 'Oct 3, 2026',
    updated: '5 days ago',
  },
  {
    id: '03082150',
    subject: 'Persistent volume claims stuck in pending state',
    severity: 'High',
    severityColor: 'orange',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'OpenShift Container Platform 4.15',
    owner: 'John Smith',
    opened: 'Sep 28, 2026',
    updated: '1 week ago',
  },
  {
    id: '03080444',
    subject: 'RHEL 8 system not receiving security errata updates',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'Red Hat Enterprise Linux 8.10',
    owner: 'Mike Davis',
    opened: 'Sep 25, 2026',
    updated: '2 weeks ago',
  },
  {
    id: '03078932',
    subject: 'Satellite sync failing for custom content views',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'Red Hat Satellite 6.14',
    owner: 'Sarah Chen',
    opened: 'Sep 22, 2026',
    updated: '3 weeks ago',
  },
  {
    id: '03077100',
    subject: 'Cannot connect to cluster API after certificate renewal',
    severity: 'Urgent',
    severityColor: 'red',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    product: 'OpenShift Container Platform 4.14',
    owner: 'John Smith',
    opened: 'Sep 18, 2026',
    updated: '4 weeks ago',
  },
];

const SupportCases: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const filtered = searchValue
    ? allCases.filter(
        (c) =>
          c.subject.toLowerCase().includes(searchValue.toLowerCase()) ||
          c.id.includes(searchValue) ||
          c.product.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : allCases;

  return (
    <>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem to="/support">Support</BreadcrumbItem>
          <BreadcrumbItem isActive>Cases</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection hasBodyWrapper={false}>
        <Split hasGutter>
          <SplitItem isFilled>
            <Content component="h1">Support Cases</Content>
          </SplitItem>
          <SplitItem>
            <Button variant="primary" onClick={() => navigate('/support/cases/new')}>
              Open a support case
            </Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Card>
          <CardBody>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem style={{ flex: 1, maxWidth: '400px' }}>
                  <SearchInput
                    placeholder="Search cases..."
                    value={searchValue}
                    onChange={(_e, val) => setSearchValue(val)}
                    onClear={() => setSearchValue('')}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="secondary">Severity</Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="secondary">Status</Button>
                </ToolbarItem>
                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {filtered.length} of {allCases.length} loaded
                  </Content>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Divider />
            <table className="pf-v6-c-table pf-m-grid-md support-cases-table" role="grid">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Case ID</th>
                  <th style={{ width: '32%' }}>Subject</th>
                  <th style={{ width: '10%' }}>Severity</th>
                  <th style={{ width: '16%' }}>Status</th>
                  <th style={{ width: '18%' }}>Product</th>
                  <th style={{ width: '8%' }}>Owner</th>
                  <th style={{ width: '8%' }}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/support/case/${c.id}`)}>
                    <td>
                      <Button variant="link" isInline>{c.id}</Button>
                    </td>
                    <td>{c.subject}</td>
                    <td>
                      <Label color={c.severityColor}>{c.severity}</Label>
                    </td>
                    <td>
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
                        <FlexItem>{c.statusIcon}</FlexItem>
                        <FlexItem>{c.status}</FlexItem>
                      </Flex>
                    </td>
                    <td>{c.product}</td>
                    <td>{c.owner}</td>
                    <td>{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={filtered.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_e, p) => setPage(p)}
                    onPerPageSelect={() => {}}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { SupportCases };
