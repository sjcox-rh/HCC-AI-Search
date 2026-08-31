import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionLink,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Content,
  Flex,
  FlexItem,
  Icon,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import {
  BookOpenIcon,
  ClusterIcon,
  HddIcon,
  HomeIcon,
  LayerGroupIcon,
  ListIcon,
  PlayIcon,
  SearchIcon,
  ServerIcon,
  TerminalIcon,
} from '@patternfly/react-icons';
import SparkleIcon from '@app/bgimages/sparkle-icon.svg';
import {
  activeAlert,
  getContextualSuggestions,
  getShortcutLabel,
  PaletteAction,
  PaletteResultKind,
  recentEntities,
  resolveQuery,
  SearchNavTarget,
} from './searchPaletteData';
import './SearchPalette.css';

export interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  query: string;
  onQueryChange: (value: string) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

interface FlatItem {
  id: string;
  run: () => void;
}

type ResultKind = PaletteResultKind;

const resultTypeLabel: Record<ResultKind, string> = {
  playbook: 'Playbook',
  action: 'Action',
  service: 'Landing page',
  page: 'Page',
  documentation: 'Documentation',
  cluster: 'Cluster',
  host: 'Host',
  system: 'System',
  group: 'Group',
  suggestion: 'Suggestion',
};

const resultTypeIcon: Record<ResultKind, React.ReactNode> = {
  playbook: <PlayIcon />,
  action: <TerminalIcon />,
  service: <HomeIcon />,
  page: <ListIcon />,
  documentation: <BookOpenIcon />,
  cluster: <ClusterIcon />,
  host: <ServerIcon />,
  system: <HddIcon />,
  group: <LayerGroupIcon />,
  suggestion: <SearchIcon />,
};

const kindForItem = (item: PaletteAction): ResultKind => {
  if (item.kind) {
    return item.kind;
  }
  if (item.playbook) {
    return 'playbook';
  }
  return 'action';
};

const entityKind = (item: PaletteAction): ResultKind => {
  if (item.kind) {
    return item.kind;
  }
  const title = item.title.toLowerCase();
  if (title.includes('cluster')) {
    return 'cluster';
  }
  if (title.includes('group')) {
    return 'group';
  }
  if (title.includes('system')) {
    return 'system';
  }
  return 'host';
};

const SearchPalette: React.FunctionComponent<SearchPaletteProps> = ({
  isOpen,
  onClose,
  currentPath,
  query,
  onQueryChange,
  anchorRef,
}) => {
  const navigate = useNavigate();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [playbookMessage, setPlaybookMessage] = React.useState<string | null>(null);
  const [panelStyle, setPanelStyle] = React.useState<React.CSSProperties>({});

  const hasQuery = query.trim().length > 0;
  const resolution = React.useMemo(() => resolveQuery(query), [query]);
  const suggestions = React.useMemo(() => getContextualSuggestions(currentPath), [currentPath]);

  const closeAndReset = React.useCallback(() => {
    setSelectedIndex(0);
    setPlaybookMessage(null);
    onClose();
  }, [onClose]);

  const goTo = React.useCallback(
    (nav?: SearchNavTarget) => {
      if (!nav) {
        return;
      }
      closeAndReset();
      navigate(nav.route, {
        state: nav.filters || nav.query ? { searchFilters: nav.filters, searchQuery: nav.query } : undefined,
      });
    },
    [closeAndReset, navigate],
  );

  const runPlaybook = React.useCallback(() => {
    setPlaybookMessage('Remediation playbook queued for Ansible Automation Platform (prototype).');
  }, []);

  const applyQuery = React.useCallback(
    (nextQuery: string) => {
      onQueryChange(nextQuery);
      setSelectedIndex(0);
      setPlaybookMessage(null);
    },
    [onQueryChange],
  );

  const runAction = React.useCallback(
    (action: PaletteAction) => {
      if (action.id === 'alert-storage' || action.id === 'ai-guidance') {
        applyQuery('Which OpenShift clusters are running out of storage?');
        return;
      }
      if (action.id === 'ctx-home-cve' || action.id === 'ctx-cves') {
        applyQuery('Show me all RHEL 8 servers with critical CVEs in production');
        return;
      }
      if (action.id === 'ctx-home-storage') {
        applyQuery('Which OpenShift clusters are running out of storage?');
        return;
      }
      if (action.id === 'ctx-patch') {
        applyQuery('Generate patch status report');
        return;
      }
      if (action.playbook) {
        runPlaybook();
        return;
      }
      if (action.nav) {
        goTo(action.nav);
      }
    },
    [applyQuery, goTo, runPlaybook],
  );

  const flatItems = React.useMemo((): FlatItem[] => {
    const items: FlatItem[] = [];

    if (!hasQuery) {
      items.push({ id: activeAlert.id, run: () => runAction(activeAlert) });
      suggestions.forEach((item) => items.push({ id: item.id, run: () => runAction(item) }));
      recentEntities.forEach((item) => items.push({ id: item.id, run: () => runAction(item) }));
      return items;
    }

    resolution.answer?.actions.forEach((action) => {
      items.push({
        id: action.id,
        run: () => {
          if (action.playbook) {
            runPlaybook();
            return;
          }
          if (action.nav) {
            goTo(action.nav);
          }
        },
      });
    });
    resolution.actions.forEach((item) => items.push({ id: item.id, run: () => runAction(item) }));
    resolution.entities.forEach((item) => items.push({ id: item.id, run: () => runAction(item) }));
    resolution.docs.forEach((item) => items.push({ id: item.id, run: () => runAction(item) }));
    return items;
  }, [hasQuery, resolution, runAction, runPlaybook, goTo, suggestions]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }
      const rect = anchor.getBoundingClientRect();
      setPanelStyle({
        top: rect.bottom - 1,
        left: rect.left,
        width: rect.width,
        ['--ai-search-palette--InsetBlockStart' as string]: `${rect.bottom - 1}px`,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, query, anchorRef]);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndReset();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => (flatItems.length === 0 ? 0 : (current + 1) % flatItems.length));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) =>
          flatItems.length === 0 ? 0 : (current - 1 + flatItems.length) % flatItems.length,
        );
        return;
      }
      if (event.key === 'Enter') {
        const selected = flatItems[selectedIndex];
        if (selected) {
          event.preventDefault();
          selected.run();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, flatItems, selectedIndex, closeAndReset]);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      closeAndReset();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen, anchorRef, closeAndReset]);

  const isActive = (id: string) => flatItems[selectedIndex]?.id === id;

  const renderRow = (item: PaletteAction, kind: ResultKind) => (
    <button
      type="button"
      key={item.id}
      id={`ai-search-item-${item.id}`}
      className={`ai-search-palette__item${isActive(item.id) ? ' is-active' : ''}`}
      role="option"
      aria-selected={isActive(item.id)}
      onMouseEnter={() => {
        const index = flatItems.findIndex((flat) => flat.id === item.id);
        if (index >= 0) {
          setSelectedIndex(index);
        }
      }}
      onClick={() => runAction(item)}
    >
      <Tooltip content={resultTypeLabel[kind]} position="left">
        <span className="ai-search-palette__type" aria-label={resultTypeLabel[kind]}>
          <Icon status={item.status}>{resultTypeIcon[kind]}</Icon>
        </span>
      </Tooltip>
      <span className="ai-search-palette__item-body">
        <span className="ai-search-palette__item-title">{item.title}</span>
        {(item.description || item.meta) && (
          <span className="ai-search-palette__item-meta">{item.meta || item.description}</span>
        )}
      </span>
    </button>
  );

  const sectionTitle = (text: string) => (
    <Title headingLevel="h3" size="md" className="ai-search-palette__section-title">
      {text}
    </Title>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="ai-search-palette__backdrop" />
      <div ref={panelRef} className="ai-search-palette__panel" style={panelStyle}>
      <Card
        className="ai-search-palette__dropdown"
        isCompact
        role="dialog"
        aria-label="Search results"
      >
        <CardBody className="ai-search-palette__body">
          {playbookMessage && (
            <Flex>
              <FlexItem>
                <Alert variant="success" isInline title="Playbook generated">
                  {playbookMessage}
                </Alert>
              </FlexItem>
            </Flex>
          )}

          <div role="listbox" aria-label="Search results">
            {!hasQuery && (
              <>
                {sectionTitle('Active alerts')}
                <Alert
                  variant="warning"
                  isInline
                  title={activeAlert.title}
                  actionLinks={
                    <AlertActionLink onClick={() => runAction(activeAlert)}>Resolve with AI Guidance</AlertActionLink>
                  }
                >
                  {activeAlert.description}
                </Alert>

                {sectionTitle('Suggestions')}
                {suggestions.map((item) => renderRow(item, 'suggestion'))}

                {sectionTitle('Recent history')}
                {recentEntities.map((item) => renderRow(item, entityKind(item)))}
              </>
            )}

            {hasQuery && resolution.answer && (
              <>
                {sectionTitle('Direct AI answer')}
                <Card isCompact>
                  <CardHeader>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <img src={SparkleIcon} alt="" width={16} height={16} />
                      </FlexItem>
                      <FlexItem>
                        <CardTitle>Insights summary</CardTitle>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                      <FlexItem>
                        <Content>
                          <p>{resolution.answer.summary}</p>
                        </Content>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }}>
                          {resolution.answer.actions.map((action) => (
                            <FlexItem key={action.id}>
                              <Button
                                variant={action.variant || 'secondary'}
                                onMouseEnter={() => {
                                  const index = flatItems.findIndex((flat) => flat.id === action.id);
                                  if (index >= 0) {
                                    setSelectedIndex(index);
                                  }
                                }}
                                onClick={() => {
                                  if (action.playbook) {
                                    runPlaybook();
                                    return;
                                  }
                                  if (action.nav) {
                                    goTo(action.nav);
                                  }
                                }}
                              >
                                {action.label}
                              </Button>
                            </FlexItem>
                          ))}
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </>
            )}

            {hasQuery && (
              <>
                {resolution.actions.map((item) => renderRow(item, kindForItem(item)))}
                {resolution.entities.map((item) => renderRow(item, entityKind(item)))}
                {resolution.docs.map((item) => renderRow(item, item.kind || 'documentation'))}
              </>
            )}
          </div>
        </CardBody>
        <CardFooter>
          <div className="ai-search-palette__footer">
            <span>
              <span className="ai-search-palette__kbd">↑↓</span> Navigate
            </span>
            <span>
              <span className="ai-search-palette__kbd">Enter</span> Execute
            </span>
            <span>
              <span className="ai-search-palette__kbd">Esc</span> Close
            </span>
            <span>
              <span className="ai-search-palette__kbd">{getShortcutLabel()}</span> Open
            </span>
          </div>
        </CardFooter>
      </Card>
      </div>
    </>
  );
};

export { SearchPalette };
