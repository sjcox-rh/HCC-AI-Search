import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Label,
  List,
  ListItem,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { RHEL10_MIGRATION_DOC_HEADING } from './demoFlowData';
import { useDemoFlowOptional } from './DemoFlowContext';
import './DemoFlow.css';

export const Rhel10MigrationHelpContent: React.FunctionComponent = () => {
  const demo = useDemoFlowOptional();

  return (
    <div className="demo-flow-help">
      <Content>
        <Title headingLevel="h2" size="lg">
          {RHEL10_MIGRATION_DOC_HEADING}
        </Title>
        <p className="demo-flow-help__lede">
          Official Red Hat guidance for planning an in-place upgrade to RHEL 10 and evaluating
          Image Mode (<code>bootc</code>) as an alternate deployment model.
        </p>
      </Content>

      <Divider className="demo-flow-help__divider" />

      <Card isCompact className="demo-flow-help__callout demo-flow-help__callout--info">
        <CardBody>
          <Title headingLevel="h3" size="md">
            Hardware baseline
          </Title>
          <p>
            <Label color="blue" isCompact>
              x86-64-v3
            </Label>{' '}
            is required. Processors lacking AVX / AVX2 (pre-Haswell / x86-64-v2 class) will fail the
            upgrade path.
          </p>
        </CardBody>
      </Card>

      <Card isCompact className="demo-flow-help__callout demo-flow-help__callout--info">
        <CardBody>
          <Title headingLevel="h3" size="md">
            Deployment type
          </Title>
          <List>
            <ListItem>
              <strong>Traditional package mode</strong> — dnf / Leapp in-place upgrade on existing
              hosts.
            </ListItem>
            <ListItem>
              <strong>Image Mode (bootc)</strong> — container-based OS images built and managed in
              Image Builder, then rebased onto fleets.
            </ListItem>
          </List>
        </CardBody>
      </Card>

      <Card isCompact className="demo-flow-help__callout demo-flow-help__callout--warning">
        <CardBody>
          <Title headingLevel="h3" size="md">
            Crypto policy
          </Title>
          <p>
            RHEL 10 defaults include post-quantum cryptography (PQC) readiness and OpenSSL 3.2
            baselines. Validate TLS clients and appliance agents before cutover.
          </p>
        </CardBody>
      </Card>

      <Alert
        variant="warning"
        isInline
        title="Want to check your fleet?"
        customIcon={<ExclamationTriangleIcon />}
        className="demo-flow-help__fleet"
      >
        <p>
          Red Hat Insights detected <strong>42 systems</strong> in your inventory.{' '}
          <strong>6 systems</strong> do not meet the x86-64-v3 CPU baseline.
        </p>
        <Button
          variant="primary"
          className="demo-flow-help__fleet-btn"
          onClick={() => demo?.analyzeFleetInLightspeed()}
        >
          Analyze Fleet Compatibility in Lightspeed
        </Button>
      </Alert>
    </div>
  );
};
