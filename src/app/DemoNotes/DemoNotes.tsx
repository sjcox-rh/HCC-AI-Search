import * as React from 'react';
import { useFeedbackMode } from '@app/FeedbackOverlay/FeedbackOverlay';
import './DemoNotes.css';

interface Prompt {
  label: string;
  type: 'nav' | 'ai';
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  prompts: Prompt[];
}

interface Area {
  id: string;
  name: string;
  useCases: UseCase[];
}

const demoAreas: Area[] = [
  {
    id: 'hcc-core',
    name: 'HCC Core',
    useCases: [
      {
        id: 'support-case',
        title: 'Open a support case',
        description:
          'I found an issue, how do I report it? Link to open a support case.',
        prompts: [
          { label: 'support case', type: 'nav' },
          { label: 'open a case', type: 'nav' },
          { label: 'case:', type: 'nav' },
          { label: 'support', type: 'nav' },
          { label: 'I found an issue, how do I report it?', type: 'ai' },
          { label: 'How do I open a support case?', type: 'ai' },
          {
            label: 'I need help with an OpenShift cluster issue',
            type: 'ai',
          },
        ],
      },
      {
        id: 'find-iam-group',
        title: 'Find IAM group by name',
        description:
          'Find a group by name, jump directly into its detail view with Roles tab active.',
        prompts: [
          { label: 'group:', type: 'nav' },
          { label: 'group: platform-admins', type: 'nav' },
          { label: 'group: cloud-operators', type: 'nav' },
          { label: 'platform-admins', type: 'nav' },
          { label: 'security-reviewers', type: 'nav' },
          { label: 'Find the platform-admins group', type: 'ai' },
          { label: 'Which group manages cloud operations?', type: 'ai' },
          { label: 'Show me the security-reviewers group and their roles', type: 'ai' },
        ],
      },
      {
        id: 'extra-metadata',
        title: 'Extra metadata in results',
        description:
          'Add extra metadata to the results: e.g. prod-cluster-01 OpenShift · Production · 3 Critical vulnerabilities',
        prompts: [
          { label: 'prod-cluster-01', type: 'nav' },
          { label: 'cluster:', type: 'nav' },
          { label: 'app-server-04', type: 'nav' },
          { label: 'rhel-prod-host-group', type: 'nav' },
          { label: 'Show me prod-cluster-01 details', type: 'ai' },
          { label: 'Which clusters have critical vulnerabilities?', type: 'ai' },
          { label: 'What is the status of app-server-04?', type: 'ai' },
        ],
      },
      {
        id: 'workspace-grant-access',
        title: 'Find a workspace and grant access',
        description:
          'Locate a workspace by name and assign user groups and roles.',
        prompts: [
          { label: 'workspace:', type: 'nav' },
          { label: 'workspace: Production', type: 'nav' },
          { label: 'workspaces', type: 'nav' },
          { label: 'Find a workspace and grant access', type: 'ai' },
          { label: 'Grant access to the Production workspace', type: 'ai' },
          { label: 'Who has access to the Cost Management workspace?', type: 'ai' },
          { label: 'How do I add a user group to a workspace?', type: 'ai' },
        ],
      },
    ],
  },
  {
    id: 'lightspeed',
    name: 'Red Hat Lightspeed',
    useCases: [
      {
        id: 'find-system-by-name',
        title: 'Find system by name',
        description:
          'Type a partial RHEL system name; jump directly to its details page.',
        prompts: [
          { label: 'app-server', type: 'nav' },
          { label: 'app-server-04', type: 'nav' },
          { label: 'prod-cluster-01', type: 'nav' },
          { label: 'host:', type: 'nav' },
          { label: 'host: app-server', type: 'nav' },
          { label: 'Find the system app-server-04', type: 'ai' },
          { label: 'Show me details for prod-cluster-01', type: 'ai' },
        ],
      },
      {
        id: 'find-system-by-severity',
        title: 'Find system by severity',
        description:
          'Ask about systems with high severity levels to find critical issues.',
        prompts: [
          { label: 'critical vulnerabilities', type: 'nav' },
          { label: 'high severity', type: 'nav' },
          { label: 'Where can I find systems that have high severity levels?', type: 'ai' },
          { label: 'Which systems have critical CVEs?', type: 'ai' },
          { label: 'Show me all RHEL hosts with unresolved vulnerabilities', type: 'ai' },
        ],
      },
    ],
  },
];

interface DemoNotesProps {
  onPromptClick?: (prompt: string) => void;
  forceCollapsed?: boolean;
}

const DemoNotes: React.FunctionComponent<DemoNotesProps> = ({
  onPromptClick,
  forceCollapsed = false,
}) => {
  const commentMode = useFeedbackMode();
  const [isOpen, setIsOpen] = React.useState(true);
  const [expandedAreas, setExpandedAreas] = React.useState<Set<string>>(
    () => new Set(demoAreas.map((a) => a.id)),
  );
  const [expandedUseCases, setExpandedUseCases] = React.useState<Set<string>>(
    () => new Set(),
  );

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleUseCase = (id: string) => {
    setExpandedUseCases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside
      className={`demo-notes${isOpen && !forceCollapsed && !commentMode ? '' : ' demo-notes--collapsed'}`}
      aria-label="Demo notes and test prompts"
    >
      <button
        type="button"
        className="demo-notes__edge-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Collapse reference guide' : 'Expand reference guide'}
      >
        <span className="demo-notes__edge-arrow">{isOpen ? '▸' : '◂'}</span>
      </button>

      <div className="demo-notes__header">
        <span className="demo-notes__title">Reference Guide</span>
      </div>

      <div className="demo-notes__body">
        <p className="demo-notes__intro">
          Search queries &amp; prompts to test each use case. Click a prompt to
          load it into search.
        </p>

        {demoAreas.map((area) => {
          const areaExpanded = expandedAreas.has(area.id);
          return (
            <div key={area.id} className="demo-notes__area">
              <button
                type="button"
                className="demo-notes__area-header"
                onClick={() => toggleArea(area.id)}
                aria-expanded={areaExpanded}
              >
                <span className="demo-notes__chevron">
                  {areaExpanded ? '▾' : '▸'}
                </span>
                <span className="demo-notes__area-name">{area.name}</span>
              </button>

              {areaExpanded && (
                <div className="demo-notes__area-body">
                  {area.useCases.map((uc) => {
                    const ucExpanded = expandedUseCases.has(uc.id);
                    const navPrompts = uc.prompts.filter(
                      (p) => p.type === 'nav',
                    );
                    const aiPrompts = uc.prompts.filter(
                      (p) => p.type === 'ai',
                    );
                    return (
                      <div key={uc.id} className="demo-notes__use-case">
                        <button
                          type="button"
                          className="demo-notes__uc-header"
                          onClick={() => toggleUseCase(uc.id)}
                          aria-expanded={ucExpanded}
                        >
                          <span className="demo-notes__chevron">
                            {ucExpanded ? '▾' : '▸'}
                          </span>
                          <span className="demo-notes__uc-title">
                            {uc.title}
                          </span>
                        </button>

                        {ucExpanded && (
                          <div className="demo-notes__uc-body">
                            <p className="demo-notes__uc-desc">
                              {uc.description}
                            </p>

                            {navPrompts.length > 0 && (
                              <div className="demo-notes__prompt-group">
                                <span className="demo-notes__prompt-label demo-notes__prompt-label--nav">
                                  Navigation
                                </span>
                                <ul className="demo-notes__prompt-list">
                                  {navPrompts.map((p, i) => (
                                    <li key={i}>
                                      <button
                                        type="button"
                                        className="demo-notes__prompt"
                                        onClick={() =>
                                          onPromptClick?.(p.label)
                                        }
                                      >
                                        {p.label}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {aiPrompts.length > 0 && (
                              <div className="demo-notes__prompt-group">
                                <span className="demo-notes__prompt-label demo-notes__prompt-label--ai">
                                  ✦ AI prompt
                                </span>
                                <ul className="demo-notes__prompt-list">
                                  {aiPrompts.map((p, i) => (
                                    <li key={i}>
                                      <button
                                        type="button"
                                        className="demo-notes__prompt"
                                        onClick={() =>
                                          onPromptClick?.(p.label)
                                        }
                                      >
                                        {p.label}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export { DemoNotes };
