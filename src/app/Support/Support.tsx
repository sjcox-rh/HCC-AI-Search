import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Grid,
  GridItem,
  Label,
  PageBreadcrumb,
  PageSection,
  Split,
  SplitItem,
  Timestamp,
} from '@patternfly/react-core';
import './Support.css';
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

const statCards = [
  { label: 'Active Cases', value: '6', detail: '2 waiting on Red Hat & 4 waiting on Customer' },
  { label: 'Escalations', value: '2', detail: '26 Closed' },
  { label: 'Avg. Initial Response', value: '1.2h', detail: 'Last 30 days' },
  { label: 'Avg. Resolution Time', value: '3.4d', detail: 'Last 30 days' },
];

interface RecentCase {
  id: string;
  subject: string;
  severity: string;
  severityColor: 'red' | 'orange' | 'blue' | 'grey';
  status: string;
  statusIcon: React.ReactNode;
  updated: string;
}

const recentCases: RecentCase[] = [
  {
    id: '03093474',
    subject: 'OpenShift upgrade stuck at 87% — multiple operators degraded',
    severity: 'Urgent',
    severityColor: 'red',
    status: 'Waiting on Red Hat',
    statusIcon: <ClockIcon color="var(--pf-t--global--icon--color--status--warning--default)" />,
    updated: '2 hours ago',
  },
  {
    id: '03091822',
    subject: 'RHEL 9.3 kernel panic on boot after latest errata update',
    severity: 'High',
    severityColor: 'orange',
    status: 'Waiting on Red Hat',
    statusIcon: <ClockIcon color="var(--pf-t--global--icon--color--status--warning--default)" />,
    updated: '5 hours ago',
  },
  {
    id: '03089105',
    subject: 'Subscription Manager unable to register new RHEL systems',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Waiting on Customer',
    statusIcon: <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--info--default)" />,
    updated: '1 day ago',
  },
  {
    id: '03087331',
    subject: 'Insights client failing to upload advisor data',
    severity: 'Normal',
    severityColor: 'blue',
    status: 'Waiting on Customer',
    statusIcon: <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--info--default)" />,
    updated: '2 days ago',
  },
  {
    id: '03085990',
    subject: 'Cannot deploy application on ROSA cluster — pod scheduling failures',
    severity: 'High',
    severityColor: 'orange',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    updated: '3 days ago',
  },
  {
    id: '03084201',
    subject: 'AAP controller license expiration warning',
    severity: 'Low',
    severityColor: 'grey',
    status: 'Closed',
    statusIcon: <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />,
    updated: '5 days ago',
  },
];

const Support: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';

  return (
    <>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem isActive>Support</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection hasBodyWrapper={false}>
        <Split hasGutter>
          <SplitItem isFilled>
            <Content component="h1">Dashboard</Content>
          </SplitItem>
          <SplitItem>
            <Button variant="secondary" onClick={() => navigate('/support/cases/new')}>
              Ask Red Hat Support
            </Button>
          </SplitItem>
          <SplitItem>
            <Button variant="primary" onClick={() => navigate('/support/cases/new')}>
              Open a support case
            </Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Grid hasGutter>
          {statCards.map((stat) => (
            <GridItem span={3} key={stat.label}>
              <Card isFullHeight>
                <CardBody>
                  <Content component={ContentVariants.p} style={{ fontWeight: 600, marginBlockEnd: 'var(--pf-t--global--spacer--sm)' }}>
                    {stat.label}
                  </Content>
                  <Content component="h2" style={{ fontSize: '2rem', fontWeight: 400, marginBlockEnd: 'var(--pf-t--global--spacer--xs)' }}>
                    {stat.value}
                  </Content>
                  <Content component={ContentVariants.p} style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--body--sm)' }}>
                    {stat.detail}
                  </Content>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Card>
          <CardBody>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBlockEnd: 'var(--pf-t--global--spacer--md)' }}>
              <FlexItem>
                <Content component="h3" style={{ margin: 0 }}>Recent Cases</Content>
              </FlexItem>
              <FlexItem>
                <Button variant="link" onClick={() => navigate('/support/cases')}>
                  View all cases <ArrowRightIcon />
                </Button>
              </FlexItem>
            </Flex>
            <Divider />
            <table className="pf-v6-c-table pf-m-grid-md support-cases-table" role="grid">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Case ID</th>
                  <th style={{ width: '40%' }}>Subject</th>
                  <th style={{ width: '12%' }}>Severity</th>
                  <th style={{ width: '20%' }}>Status</th>
                  <th style={{ width: '18%' }}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((c) => (
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
                    <td>{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { Support };
