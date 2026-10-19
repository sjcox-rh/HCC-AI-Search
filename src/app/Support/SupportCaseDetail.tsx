import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
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
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
} from '@patternfly/react-core';
import {
  ClockIcon,
  PaperPlaneIcon,
  OutlinedCommentsIcon,
} from '@patternfly/react-icons';

interface Comment {
  id: string;
  author: string;
  role: 'customer' | 'redhat';
  timestamp: string;
  body: string;
}

const caseData: Record<
  string,
  {
    subject: string;
    severity: string;
    severityColor: 'red' | 'orange' | 'blue' | 'grey';
    status: string;
    product: string;
    version: string;
    owner: string;
    opened: string;
    description: string;
    comments: Comment[];
  }
> = {
  '03093474': {
    subject: 'OpenShift upgrade stuck at 87% — multiple operators degraded',
    severity: 'Urgent',
    severityColor: 'red',
    status: 'Waiting on Red Hat',
    product: 'OpenShift Container Platform',
    version: '4.16',
    owner: 'John Smith',
    opened: 'Oct 13, 2026',
    description:
      'We initiated an upgrade from OCP 4.15 to 4.16 on our production cluster (cluster-prod-openshift-01) and it has been stuck at 87% for over 6 hours. The Cluster Version Operator shows multiple degraded operators including kube-apiserver, openshift-apiserver, and authentication. We have already attempted restarting the CVO pod but the issue persists.',
    comments: [
      {
        id: '1',
        author: 'John Smith',
        role: 'customer',
        timestamp: 'Oct 13, 2026 at 10:15 AM',
        body: 'We initiated an upgrade from OCP 4.15 to 4.16 on our production cluster (cluster-prod-openshift-01) and it has been stuck at 87% for over 6 hours. The Cluster Version Operator shows multiple degraded operators including kube-apiserver, openshift-apiserver, and authentication.\n\nWe have already attempted restarting the CVO pod but the issue persists. This is blocking our production deployment timeline.',
      },
      {
        id: '2',
        author: 'Raj Patel',
        role: 'redhat',
        timestamp: 'Oct 13, 2026 at 11:30 AM',
        body: 'Thank you for reaching out. I can see the cluster is experiencing operator degradation during the upgrade. Could you please provide the output of the following commands:\n\n• oc get clusterversion\n• oc get co | grep -v "True.*False.*False"\n• oc logs -n openshift-cluster-version deploy/cluster-version-operator --tail=200\n\nThis will help me identify the root cause of the stalled upgrade.',
      },
      {
        id: '3',
        author: 'John Smith',
        role: 'customer',
        timestamp: 'Oct 13, 2026 at 12:45 PM',
        body: 'Here is the output from the requested commands. The kube-apiserver operator shows "NodeInstallerDegraded" and there appears to be a failing pod on node worker-3.',
      },
      {
        id: '4',
        author: 'Raj Patel',
        role: 'redhat',
        timestamp: 'Oct 13, 2026 at 2:00 PM',
        body: 'Thank you for the logs. I can see the issue — worker-3 has insufficient disk space on /var which is preventing the static pod installer from completing the revision rollout. This is a known issue documented in KB article #7045123.\n\nPlease try the following:\n1. SSH to worker-3\n2. Check disk usage: df -h /var\n3. Clean up old revision directories: crictl rmi --prune\n4. The operator should recover automatically once space is freed\n\nLet me know if this resolves the issue.',
      },
    ],
  },
  '03091822': {
    subject: 'RHEL 9.3 kernel panic on boot after latest errata update',
    severity: 'High',
    severityColor: 'orange',
    status: 'Waiting on Red Hat',
    product: 'Red Hat Enterprise Linux',
    version: '9.3',
    owner: 'John Smith',
    opened: 'Oct 12, 2026',
    description: 'After applying the latest batch of errata updates (RHSA-2026:4521), two of our RHEL 9.3 servers are experiencing kernel panics on boot. The panic trace shows an issue in the nouveau driver module.',
    comments: [
      {
        id: '1',
        author: 'John Smith',
        role: 'customer',
        timestamp: 'Oct 12, 2026 at 3:00 PM',
        body: 'After applying RHSA-2026:4521 errata updates, two RHEL 9.3 servers are kernel panicking on boot. We can boot into rescue mode. The panic trace points to the nouveau driver.',
      },
      {
        id: '2',
        author: 'Lisa Wong',
        role: 'redhat',
        timestamp: 'Oct 12, 2026 at 5:30 PM',
        body: 'I\'m looking into this. Can you please attach the sosreport from rescue mode and the vmcore dump if available? Also, please confirm the exact kernel version before and after the update.',
      },
    ],
  },
};

const defaultCase = {
  subject: 'Support Case',
  severity: 'Normal',
  severityColor: 'blue' as const,
  status: 'Open',
  product: 'Red Hat Product',
  version: '',
  owner: 'User',
  opened: 'Oct 2026',
  description: 'Case details are being loaded.',
  comments: [],
};

const SupportCaseDetail: React.FunctionComponent = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);
  const [newComment, setNewComment] = React.useState('');

  const data = caseData[caseId || ''] || defaultCase;

  return (
    <>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem to="/support">Support</BreadcrumbItem>
          <BreadcrumbItem to="/support/cases">Cases</BreadcrumbItem>
          <BreadcrumbItem isActive>{caseId}</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Split hasGutter>
          <SplitItem isFilled>
            <Content component="h1">{data.subject}</Content>
            <Flex spaceItems={{ default: 'spaceItemsMd' }} style={{ marginBlockStart: 'var(--pf-t--global--spacer--sm)' }}>
              <FlexItem>
                <Label color={data.severityColor}>{data.severity}</Label>
              </FlexItem>
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem><ClockIcon color="var(--pf-t--global--icon--color--status--warning--default)" /></FlexItem>
                  <FlexItem>{data.status}</FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Case #{caseId} · Opened {data.opened}
                </Content>
              </FlexItem>
            </Flex>
          </SplitItem>
          <SplitItem>
            <Button variant="secondary">Escalate</Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Tabs activeKey={activeTab} onSelect={(_e, idx) => setActiveTab(idx as number)}>
          <Tab eventKey={0} title={<TabTitleText>Comments</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Case Info</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>History</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Private Notes</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        {activeTab === 0 && (
          <Grid hasGutter>
            <GridItem span={8}>
              <Card>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                    {data.comments.map((comment) => (
                      <FlexItem key={comment.id}>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <Content component="h4" style={{ margin: 0 }}>{comment.author}</Content>
                          </FlexItem>
                          <FlexItem>
                            <Label color={comment.role === 'redhat' ? 'red' : 'blue'} isCompact>
                              {comment.role === 'redhat' ? 'Red Hat' : 'Customer'}
                            </Label>
                          </FlexItem>
                          <FlexItem>
                            <Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {comment.timestamp}
                            </Content>
                          </FlexItem>
                        </Flex>
                        <Content component={ContentVariants.p} style={{ whiteSpace: 'pre-wrap', marginBlockStart: 'var(--pf-t--global--spacer--sm)' }}>
                          {comment.body}
                        </Content>
                        <Divider style={{ marginBlockStart: 'var(--pf-t--global--spacer--md)' }} />
                      </FlexItem>
                    ))}
                    <FlexItem>
                      <Content component="h4" style={{ marginBlockEnd: 'var(--pf-t--global--spacer--sm)' }}>
                        <OutlinedCommentsIcon /> Add a comment
                      </Content>
                      <TextArea
                        aria-label="Add a comment"
                        placeholder="Type your reply..."
                        value={newComment}
                        onChange={(_e, val) => setNewComment(val)}
                        rows={4}
                      />
                      <Flex style={{ marginBlockStart: 'var(--pf-t--global--spacer--sm)' }}>
                        <FlexItem>
                          <Button variant="primary" icon={<PaperPlaneIcon />}>Send reply</Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="secondary">Attach file</Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={4}>
              <Card>
                <CardBody>
                  <Content component="h4" style={{ marginBlockEnd: 'var(--pf-t--global--spacer--md)' }}>Case Information</Content>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Case ID</DescriptionListTerm>
                      <DescriptionListDescription>{caseId}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Product</DescriptionListTerm>
                      <DescriptionListDescription>{data.product} {data.version}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Severity</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Label color={data.severityColor}>{data.severity}</Label>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>{data.status}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Owner</DescriptionListTerm>
                      <DescriptionListDescription>{data.owner}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Opened</DescriptionListTerm>
                      <DescriptionListDescription>{data.opened}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Summary</DescriptionListTerm>
                  <DescriptionListDescription>{data.subject}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription style={{ whiteSpace: 'pre-wrap' }}>{data.description}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Product</DescriptionListTerm>
                  <DescriptionListDescription>{data.product} {data.version}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Severity</DescriptionListTerm>
                  <DescriptionListDescription><Label color={data.severityColor}>{data.severity}</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>{data.status}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Case Owner</DescriptionListTerm>
                  <DescriptionListDescription>{data.owner}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Opened</DescriptionListTerm>
                  <DescriptionListDescription>{data.opened}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardBody>
              <Content component="h4" style={{ marginBlockEnd: 'var(--pf-t--global--spacer--md)' }}>Case History</Content>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem><Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{data.opened}</Content></FlexItem>
                    <FlexItem>—</FlexItem>
                    <FlexItem>Case opened by {data.owner}</FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem><Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{data.opened}</Content></FlexItem>
                    <FlexItem>—</FlexItem>
                    <FlexItem>Severity set to <Label color={data.severityColor} isCompact>{data.severity}</Label></FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem><Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{data.opened}</Content></FlexItem>
                    <FlexItem>—</FlexItem>
                    <FlexItem>Case assigned to Red Hat Support</FlexItem>
                  </Flex>
                </FlexItem>
                {data.comments.length > 1 && (
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem><Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{data.comments[1].timestamp}</Content></FlexItem>
                      <FlexItem>—</FlexItem>
                      <FlexItem>First response from Red Hat ({data.comments[1].author})</FlexItem>
                    </Flex>
                  </FlexItem>
                )}
              </Flex>
            </CardBody>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardBody>
              <Content component="h4" style={{ marginBlockEnd: 'var(--pf-t--global--spacer--md)' }}>Private Notes</Content>
              <Content component={ContentVariants.p} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                Private notes are only visible to members of your organization. Red Hat support engineers cannot see these notes.
              </Content>
              <TextArea
                aria-label="Private notes"
                placeholder="Add a private note..."
                rows={6}
                style={{ marginBlockStart: 'var(--pf-t--global--spacer--md)' }}
              />
              <Button variant="primary" style={{ marginBlockStart: 'var(--pf-t--global--spacer--sm)' }}>
                Save note
              </Button>
            </CardBody>
          </Card>
        )}
      </PageSection>
    </>
  );
};

export { SupportCaseDetail };
