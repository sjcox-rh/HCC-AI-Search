import * as React from 'react';
import { Button, CodeBlock, CodeBlockCode, Label, Title } from '@patternfly/react-core';
import {
  ChatbotContent,
  ChatbotFooter,
  ChatbotFootnote,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
} from '@patternfly/chatbot';
import { BarsIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import '@patternfly/chatbot/dist/css/main.css';
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

const WELCOME_PROMPTS = [
  { title: 'Tell me about Ask Red Hat.' },
  { title: 'What technologies are used in Ask Red Hat?' },
];

const GREETING =
  'Hello Hallo Hola Bonjour こんにちは Olá مرحباً Ahoj Ciao 안녕하세요 Hallo 你好\n\nGet answers from our library of support resources.';

const GREETING_TIMESTAMP = '17/11/2026 11:01:44';

interface ChatTurn {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export const LightspeedChatPanel: React.FunctionComponent = () => {
  const demo = useDemoFlowOptional();
  const isDemoActive = Boolean(demo?.lightspeedActive);
  const phase = demo?.lightspeedPhase ?? 'idle';
  const contextPill = demo?.contextPill;
  const selectedChip = demo?.selectedChip;
  const [turns, setTurns] = React.useState<ChatTurn[]>([]);

  const sendMessage = (message: string | number) => {
    const text = String(message).trim();
    if (!text) {
      return;
    }
    setTurns((current) => [
      ...current,
      { id: `user-${current.length}`, role: 'user', content: text },
      {
        id: `bot-${current.length}`,
        role: 'bot',
        content: 'Get answers from our library of support resources.',
      },
    ]);
  };

  return (
    <div className="demo-flow-chat">
      <div className="demo-flow-chat__header">
        <div className="demo-flow-chat__header-row">
          <Button variant="plain" aria-label="Chat options menu" className="demo-flow-chat__icon-btn">
            <BarsIcon />
          </Button>
          <Title headingLevel="h2" size="md" className="demo-flow-chat__title">
            Ask Red Hat
          </Title>
        </div>
        {contextPill && (
          <Label color="teal" className="demo-flow-chat__context-pill" isCompact>
            {contextPill}
          </Label>
        )}
      </div>

      <div className="demo-flow-chat__stage">
        <ChatbotContent>
          <MessageBox ariaLabel="Ask Red Hat conversation">
            <ChatbotWelcomePrompt
              title="Hello, sjcox@redhat.com"
              description="How may I help you today?"
              prompts={WELCOME_PROMPTS.map((prompt) => ({
                title: prompt.title,
                onClick: () => sendMessage(prompt.title),
              }))}
            />
            <Message
              role="bot"
              isAvatarHidden
              isMetadataVisible
              timestamp={GREETING_TIMESTAMP}
              content={GREETING}
            />

            {turns.map((turn) => (
              <Message
                key={turn.id}
                role={turn.role}
                alignment={turn.role === 'user' ? 'end' : 'start'}
                isAvatarHidden
                isMetadataVisible={turn.role === 'bot'}
                content={turn.content}
              />
            ))}

            {isDemoActive && demo?.fleetQuestion && (
              <Message role="user" alignment="end" isAvatarHidden content={demo.fleetQuestion} />
            )}

            {isDemoActive && phase === 'analyzing' && (
              <Message role="bot" isAvatarHidden isLoading content="" aria-label="Lightspeed is analyzing" />
            )}

            {isDemoActive && (phase === 'ready' || phase === 'playbook') && (
              <>
                <Message
                  role="bot"
                  isAvatarHidden
                  isMetadataVisible
                  content={
                    'I reviewed your **42** registered systems against the RHEL 10 hardware and deployment criteria from the guide:\n\n' +
                    '- **36 hosts:** Compatible for direct in-place upgrade or image-mode rebase.\n' +
                    '- **6 hosts:** Incompatible CPU architecture (pre-Haswell / x86-64-v2 detected).\n\n' +
                    'How would you like to proceed?'
                  }
                />
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
              <Message role="bot" isAvatarHidden isMetadataVisible>
                <p>
                  Generated a verification playbook from the guide&apos;s x86-64-v3 requirement. Review the sample
                  task, then open it in Automation Execution:
                </p>
                <CodeBlock className="demo-flow-chat__code">
                  <CodeBlockCode>{ANSIBLE_PLAYBOOK_SNIPPET}</CodeBlockCode>
                </CodeBlock>
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                  Open in Automation Execution
                </Button>
              </Message>
            )}

            {isDemoActive && selectedChip === 'image-builder' && (
              <Message
                role="bot"
                isAvatarHidden
                isMetadataVisible
                content="Drafted a RHEL 10 Image Mode (bootc) template in Image Builder with x86_64 baseline and OpenSSL 3.2 crypto policy defaults. Ready to open Image Builder when you are."
              />
            )}

            {isDemoActive && selectedChip === 'export-csv' && (
              <Message
                role="bot"
                isAvatarHidden
                isMetadataVisible
                content="Exported the 6 incompatible hosts to CSV (hostname, architecture baseline, owner, last check-in). Download is ready for your upgrade planning workspace."
              />
            )}
          </MessageBox>
        </ChatbotContent>

        <ChatbotFooter>
          <MessageBar
            onSendMessage={sendMessage}
            alwayShowSendButton
            hasAttachButton={false}
            hasMicrophoneButton={false}
            aria-label="Send a message"
          />
          <ChatbotFootnote label="Always review AI generated content prior to use." />
        </ChatbotFooter>
      </div>
    </div>
  );
};
