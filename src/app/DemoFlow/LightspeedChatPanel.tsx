import * as React from 'react';
import {
  Button,
  CodeBlock,
  CodeBlockCode,
  Label,
  Title,
} from '@patternfly/react-core';
import { BarsIcon, CommentsIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { ANSIBLE_PLAYBOOK_SNIPPET } from './demoFlowData';
import { useDemoFlowOptional } from './DemoFlowContext';
import './DemoFlow.css';

const ACTION_CHIPS = [
  {
    id: 'playbook',
    label: 'Generate Ansible playbook to verify x86-64-v3 flags across all hosts',
  },
  {
    id: 'image-builder',
    label: 'Create RHEL 10 Image Mode template in Image Builder',
  },
  {
    id: 'export-csv',
    label: 'Export incompatible host inventory to CSV',
  },
] as const;

export const LightspeedChatPanel: React.FunctionComponent = () => {
  const demo = useDemoFlowOptional();
  const isDemoActive = Boolean(demo?.lightspeedActive);
  const phase = demo?.lightspeedPhase ?? 'idle';
  const contextPill = demo?.contextPill;
  const selectedChip = demo?.selectedChip;

  return (
    <div className="demo-flow-chat">
      <div className="demo-flow-chat__header">
        <div className="demo-flow-chat__header-row">
          <Button variant="plain" aria-label="Chat options menu" className="demo-flow-chat__icon-btn">
            <BarsIcon />
          </Button>
          <div className="demo-flow-chat__avatar" aria-hidden>
            <CommentsIcon />
          </div>
          <Title headingLevel="h2" size="md" className="demo-flow-chat__title">
            Ask Red Hat · Lightspeed
          </Title>
        </div>
        {contextPill && (
          <Label color="teal" className="demo-flow-chat__context-pill" isCompact>
            {contextPill}
          </Label>
        )}
      </div>

      <div className="demo-flow-chat__messages">
        {!isDemoActive && (
          <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
            <div className="demo-flow-chat__bot-avatar" aria-hidden>
              <CommentsIcon />
            </div>
            <div className="demo-flow-chat__bubble-body">
              Hi! I&apos;m here to help with your questions and feedback. How can I assist you today?
            </div>
          </div>
        )}

        {isDemoActive && phase === 'analyzing' && (
          <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
            <div className="demo-flow-chat__bot-avatar" aria-hidden>
              <CommentsIcon />
            </div>
            <div className="demo-flow-chat__bubble-body demo-flow-chat__typing" aria-label="Lightspeed is analyzing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {isDemoActive && (phase === 'ready' || phase === 'playbook') && (
          <>
            <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
              <div className="demo-flow-chat__bot-avatar" aria-hidden>
                <CommentsIcon />
              </div>
              <div className="demo-flow-chat__bubble-body">
                <p>
                  I reviewed your <strong>42</strong> registered systems against the RHEL 10 hardware
                  and deployment criteria from the guide:
                </p>
                <ul>
                  <li>
                    <strong>36 hosts:</strong> Compatible for direct in-place upgrade or image-mode
                    rebase.
                  </li>
                  <li>
                    <strong>6 hosts:</strong> Incompatible CPU architecture (pre-Haswell / x86-64-v2
                    detected).
                  </li>
                </ul>
                <p>How would you like to proceed?</p>
              </div>
            </div>

            <div className="demo-flow-chat__chips" role="group" aria-label="Lightspeed suggested actions">
              {ACTION_CHIPS.map((chip) => (
                <Button
                  key={chip.id}
                  variant={selectedChip === chip.id ? 'primary' : 'secondary'}
                  className="demo-flow-chat__chip"
                  onClick={() => demo?.selectActionChip(chip.id)}
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </>
        )}

        {isDemoActive && phase === 'playbook' && selectedChip === 'playbook' && (
          <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
            <div className="demo-flow-chat__bot-avatar" aria-hidden>
              <CommentsIcon />
            </div>
            <div className="demo-flow-chat__bubble-body">
              <p>
                Generated a verification playbook from the guide&apos;s x86-64-v3 requirement. Review
                the sample task, then open it in Automation Execution:
              </p>
              <CodeBlock className="demo-flow-chat__code">
                <CodeBlockCode>{ANSIBLE_PLAYBOOK_SNIPPET}</CodeBlockCode>
              </CodeBlock>
              <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                Open in Automation Execution
              </Button>
            </div>
          </div>
        )}

        {isDemoActive && selectedChip === 'image-builder' && (
          <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
            <div className="demo-flow-chat__bot-avatar" aria-hidden>
              <CommentsIcon />
            </div>
            <div className="demo-flow-chat__bubble-body">
              Drafted a RHEL 10 Image Mode (<code>bootc</code>) template in Image Builder with x86_64
              baseline and OpenSSL 3.2 crypto policy defaults. Ready to open Image Builder when you
              are.
            </div>
          </div>
        )}

        {isDemoActive && selectedChip === 'export-csv' && (
          <div className="demo-flow-chat__bubble demo-flow-chat__bubble--bot">
            <div className="demo-flow-chat__bot-avatar" aria-hidden>
              <CommentsIcon />
            </div>
            <div className="demo-flow-chat__bubble-body">
              Exported the 6 incompatible hosts to CSV (hostname, architecture baseline, owner,
              last check-in). Download is ready for your upgrade planning workspace.
            </div>
          </div>
        )}
      </div>

      <div className="demo-flow-chat__input">
        <input type="text" placeholder="Ask Lightspeed…" aria-label="Ask Lightspeed" disabled={!isDemoActive} />
        <Button variant="primary" className="demo-flow-chat__send" isDisabled={!isDemoActive} aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
