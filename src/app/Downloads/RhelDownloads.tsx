import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
  FormSelect,
  FormSelectOption,
  Label,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { ArrowRightIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const downloads = [
  {
    id: 'rhel-10-binary-dvd',
    name: 'RHEL 10.0 Binary DVD',
    filename: 'rhel-10.0-x86_64-dvd.iso',
    description: 'Complete installation media for supported x86_64 hardware.',
    size: '10.4 GB',
    arch: 'x86_64',
    format: 'ISO',
  },
  {
    id: 'rhel-10-boot-iso',
    name: 'RHEL 10.0 Boot ISO',
    filename: 'rhel-10.0-x86_64-boot.iso',
    description: 'Minimal boot image for network-based installation.',
    size: '892 MB',
    arch: 'x86_64',
    format: 'ISO',
  },
  {
    id: 'rhel-10-qcow2',
    name: 'RHEL 10.0 KVM Guest Image',
    filename: 'rhel-10.0-x86_64-kvm.qcow2',
    description: 'Pre-built cloud image for KVM/libvirt virtualization.',
    size: '1.2 GB',
    arch: 'x86_64',
    format: 'QCOW2',
  },
  {
    id: 'rhel-10-aws',
    name: 'RHEL 10.0 AWS AMI',
    filename: 'ami-rhel-10.0-x86_64',
    description: 'Amazon Machine Image for AWS deployment.',
    size: '—',
    arch: 'x86_64',
    format: 'AMI',
  },
];

export const RhelDownloads: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = React.useState('server');
  const [version, setVersion] = React.useState('10.0');
  const [arch, setArch] = React.useState('x86_64');

  return (
    <Page
      sidebar={
        <PageSidebar>
          <PageSidebarBody>
            <Nav aria-label="Downloads navigation">
              <NavList>
                <NavItem onClick={() => navigate('/')}>Console home</NavItem>
                <NavItem onClick={() => navigate('/learning-resources')}>Downloads overview</NavItem>
                <NavExpandable title="Product downloads" isExpanded>
                  <NavItem isActive>Red Hat Enterprise Linux</NavItem>
                  <NavItem>OpenShift</NavItem>
                  <NavItem>Ansible Automation Platform</NavItem>
                  <NavItem>Application Services</NavItem>
                  <NavItem>Satellite</NavItem>
                  <NavItem>Other products</NavItem>
                </NavExpandable>
                <NavItem>Packages and advisories</NavItem>
                <NavItem>Saved selections</NavItem>
                <NavItem>Downloads help</NavItem>
              </NavList>
            </Nav>
          </PageSidebarBody>
        </PageSidebar>
      }
    >
      <PageSection variant="default" style={{ paddingBlockEnd: 0 }}>
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Hybrid Cloud Console
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/learning-resources'); }}>
            Downloads
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Red Hat Enterprise Linux</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection variant="default" style={{ paddingBlockEnd: 0 }}>
        <Content component="small" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Choose software
        </Content>
        <Split hasGutter>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="xl">Red Hat Enterprise Linux</Title>
            <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              A consistent foundation for your applications, from the datacenter to the cloud.
            </Content>
          </SplitItem>
          <SplitItem>
            <Label color="blue" isCompact>◆ Account: Acme Corp</Label>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection variant="default">
        <Card>
          <CardBody>
            <Split hasGutter>
              <SplitItem isFilled>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>What do you need?</Title>
                <Flex gap={{ default: 'gapLg' }}>
                  <FlexItem>
                    <Content component="small" style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Variant</Content>
                    <FormSelect value={variant} onChange={(_e, v) => setVariant(v)} aria-label="Variant">
                      <FormSelectOption value="server" label="Server" />
                      <FormSelectOption value="workstation" label="Workstation" />
                    </FormSelect>
                  </FlexItem>
                  <FlexItem>
                    <Content component="small" style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Version</Content>
                    <FormSelect value={version} onChange={(_e, v) => setVersion(v)} aria-label="Version">
                      <FormSelectOption value="10.0" label="10.0" />
                      <FormSelectOption value="9.4" label="9.4" />
                      <FormSelectOption value="8.10" label="8.10" />
                    </FormSelect>
                  </FlexItem>
                  <FlexItem>
                    <Content component="small" style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Architecture</Content>
                    <FormSelect value={arch} onChange={(_e, v) => setArch(v)} aria-label="Architecture">
                      <FormSelectOption value="x86_64" label="x86_64 (Intel / AMD)" />
                      <FormSelectOption value="aarch64" label="aarch64 (ARM)" />
                      <FormSelectOption value="s390x" label="s390x (IBM Z)" />
                    </FormSelect>
                  </FlexItem>
                  <FlexItem>
                    <Content component="small" style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Environment</Content>
                    <FormSelect value="manual" aria-label="Environment">
                      <FormSelectOption value="manual" label="I'll choose manually" />
                      <FormSelectOption value="bare-metal" label="Bare metal" />
                      <FormSelectOption value="cloud" label="Cloud" />
                    </FormSelect>
                  </FlexItem>
                </Flex>
                <Content component="small" style={{ marginTop: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Available versions and architectures follow your software type. No connected system is required to make a selection.
                </Content>
              </SplitItem>
              <SplitItem>
                <Button variant="link" isInline style={{ fontSize: '13px' }}>Selections you control</Button>
              </SplitItem>
            </Split>
          </CardBody>
        </Card>
      </PageSection>

      <PageSection variant="default" style={{ paddingBlockStart: 0 }}>
        <Content style={{ marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pf-t--global--color--brand--default)' }}>
            ℹ <strong>Choose the software that fits your task</strong>
          </span>
          <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginLeft: '24px' }}>
            The catalog shows your chosen release and architecture. Review purpose and prerequisites before downloading.
          </Content>
        </Content>

        <Divider style={{ marginBlock: '16px' }} />

        <Flex alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
          <FlexItem>
            <Title headingLevel="h2" size="lg">Available software</Title>
          </FlexItem>
          <FlexItem>
            <Label isCompact>{downloads.length}</Label>
          </FlexItem>
        </Flex>

        {downloads.map((dl) => (
          <Card key={dl.id} isCompact style={{ marginBottom: '12px' }}>
            <CardBody>
              <Split hasGutter>
                <SplitItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--nonstatus--red--default)' }}>🎩</SplitItem>
                <SplitItem isFilled>
                  <Button variant="link" isInline style={{ fontWeight: 600 }}>
                    {dl.name} <ExternalLinkAltIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Button>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{dl.filename}</Content>
                  <Content component="p" style={{ marginTop: '4px' }}>{dl.description}</Content>
                  <DescriptionList isHorizontal isCompact style={{ marginTop: '8px' }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>{dl.format}</DescriptionListTerm>
                      <DescriptionListDescription>{dl.size} · {dl.arch}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </SplitItem>
                <SplitItem>
                  <Button variant="secondary">
                    View details <ArrowRightIcon style={{ marginLeft: '4px' }} />
                  </Button>
                </SplitItem>
              </Split>
            </CardBody>
          </Card>
        ))}

        <Divider style={{ marginBlock: '16px' }} />

        <Button variant="link" isInline>▸ How are these choices determined?</Button>
      </PageSection>

      <PageSection variant="default" style={{ paddingBlockStart: 0 }}>
        <Card>
          <CardBody>
            <Split hasGutter>
              <SplitItem isFilled>
                <Title headingLevel="h3" size="md">Maintaining an existing RHEL system?</Title>
              </SplitItem>
              <SplitItem>
                <Button variant="link">Packages and advisories <ArrowRightIcon style={{ marginLeft: '4px' }} /></Button>
              </SplitItem>
            </Split>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};
