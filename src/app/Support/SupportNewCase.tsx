import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionGroup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  ContentVariants,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  PageBreadcrumb,
  PageSection,
  Split,
  SplitItem,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

const SupportNewCase: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = React.useState('');
  const [product, setProduct] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [severity, setSeverity] = React.useState('normal');
  const [description, setDescription] = React.useState('');

  return (
    <>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem to="/support">Support</BreadcrumbItem>
          <BreadcrumbItem to="/support/cases">Cases</BreadcrumbItem>
          <BreadcrumbItem isActive>Open a case</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Content component="h1">Open a support case</Content>
        <Content component={ContentVariants.p} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
          Provide details about your issue so our support team can help resolve it quickly.
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBlockStart: 0 }}>
        <Grid hasGutter>
          <GridItem span={8}>
            <Card>
              <CardBody>
                <Form>
                  <FormGroup label="Summary" isRequired fieldId="case-summary">
                    <TextInput
                      isRequired
                      id="case-summary"
                      value={summary}
                      onChange={(_e, val) => setSummary(val)}
                      placeholder="Brief description of the issue"
                    />
                  </FormGroup>

                  <FormGroup label="Product" isRequired fieldId="case-product">
                    <FormSelect
                      id="case-product"
                      value={product}
                      onChange={(_e, val) => setProduct(val)}
                    >
                      <FormSelectOption value="" label="Select a product" isPlaceholder />
                      <FormSelectOption value="ocp" label="OpenShift Container Platform" />
                      <FormSelectOption value="rhel" label="Red Hat Enterprise Linux" />
                      <FormSelectOption value="rosa" label="Red Hat OpenShift Service on AWS" />
                      <FormSelectOption value="aap" label="Ansible Automation Platform" />
                      <FormSelectOption value="satellite" label="Red Hat Satellite" />
                      <FormSelectOption value="insights" label="Red Hat Insights" />
                      <FormSelectOption value="rhacs" label="Red Hat Advanced Cluster Security" />
                    </FormSelect>
                  </FormGroup>

                  <FormGroup label="Version" fieldId="case-version">
                    <TextInput
                      id="case-version"
                      value={version}
                      onChange={(_e, val) => setVersion(val)}
                      placeholder="e.g. 4.16, 9.3"
                    />
                  </FormGroup>

                  <FormGroup label="Severity" isRequired fieldId="case-severity">
                    <FormSelect
                      id="case-severity"
                      value={severity}
                      onChange={(_e, val) => setSeverity(val)}
                    >
                      <FormSelectOption value="urgent" label="1 (Urgent) — Production system down" />
                      <FormSelectOption value="high" label="2 (High) — Significant business impact" />
                      <FormSelectOption value="normal" label="3 (Normal) — General issue" />
                      <FormSelectOption value="low" label="4 (Low) — General question or enhancement" />
                    </FormSelect>
                  </FormGroup>

                  <FormGroup label="Description" isRequired fieldId="case-description">
                    <TextArea
                      isRequired
                      id="case-description"
                      value={description}
                      onChange={(_e, val) => setDescription(val)}
                      placeholder="Provide as much detail as possible. Include error messages, steps to reproduce, and any troubleshooting already attempted."
                      rows={8}
                    />
                  </FormGroup>

                  <FormGroup label="Attachments" fieldId="case-attachments">
                    <Button variant="secondary">Attach files</Button>
                    <Content component={ContentVariants.small} style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBlockStart: 'var(--pf-t--global--spacer--xs)' }}>
                      Attach sosreport, must-gather output, logs, or screenshots to help diagnose the issue faster.
                    </Content>
                  </FormGroup>

                  <ActionGroup>
                    <Button variant="primary" onClick={() => navigate('/support/case/03093474')}>
                      Submit case
                    </Button>
                    <Button variant="link" onClick={() => navigate('/support')}>
                      Cancel
                    </Button>
                  </ActionGroup>
                </Form>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardBody>
                <Content component="h4" style={{ marginBlockEnd: 'var(--pf-t--global--spacer--sm)' }}>Tips for a fast resolution</Content>
                <Content component="ul">
                  <Content component="li">Include the exact error message or log output</Content>
                  <Content component="li">Attach a sosreport (RHEL) or must-gather (OpenShift)</Content>
                  <Content component="li">Note when the issue started and any recent changes</Content>
                  <Content component="li">List the steps to reproduce the problem</Content>
                  <Content component="li">Include the number of affected systems</Content>
                </Content>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export { SupportNewCase };
