import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Content,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Label,
  Title,
  Tooltip,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import {
  AngleDownIcon,
  AngleRightIcon,
  BookOpenIcon,
  ClusterIcon,
  HddIcon,
  HomeIcon,
  LayerGroupIcon,
  ListIcon,
  LockIcon,
  PlayIcon,
  SearchIcon,
  ServerIcon,
  TerminalIcon,
} from '@patternfly/react-icons';
import SparkleIcon from '@app/bgimages/sparkle-icon.svg';
import {
  commonActions,
  getContextualSuggestions,
  getShortcutLabel,
  PaletteAction,
  PaletteResultKind,
  recentEntities,
  resolveQuery,
  SearchNavTarget,
} from './searchPaletteData';
import { SearchFeedback } from './SearchFeedback';
import {
  DEFAULT_SERVICE_ID,
  getSelectedService,
  SearchServiceDetail,
  SearchServicesPanel,
} from './SearchServicesPanel';
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
  type: 'row' | 'group-header';
  groupKey?: ResultGroupKey;
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

type ResultGroupKey =
  | 'services'
  | 'inventories'
  | 'learning'
  | 'playbooks';

const resultGroupLabel: Record<ResultGroupKey, string> = {
  services: 'Services & pages',
  inventories: 'Inventories',
  learning: 'Learning resources',
  playbooks: 'Playbooks & actions',
};

const resultGroupOrder: ResultGroupKey[] = ['services', 'inventories', 'learning', 'playbooks'];

const kindToGroup = (kind: ResultKind): ResultGroupKey => {
  switch (kind) {
    case 'service':
    case 'page':
      return 'services';
    case 'cluster':
    case 'host':
    case 'system':
    case 'group':
      return 'inventories';
    case 'documentation':
      return 'learning';
    case 'playbook':
    case 'action':
    case 'suggestion':
      return 'playbooks';
    default:
      return 'services';
  }
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
  const [selectedServiceId, setSelectedServiceId] = React.useState(DEFAULT_SERVICE_ID);
  const [favoritedItems, setFavoritedItems] = React.useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<ResultGroupKey>>(new Set());
  const selectedService = getSelectedService(selectedServiceId);
  const showSearchShortcuts = selectedServiceId === DEFAULT_SERVICE_ID && favoritedItems.size === 0;

  const toggleGroup = React.useCallback((key: ResultGroupKey) => {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleFavorite = React.useCallback((id: string) => {
    setFavoritedItems((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const hasQuery = query.trim().length > 0;
  const resolution = React.useMemo(() => resolveQuery(query), [query]);
  const suggestions = React.useMemo(() => getContextualSuggestions(currentPath), [currentPath]);
  const hasResults = Boolean(
    resolution.answer ||
      resolution.actions.length ||
      resolution.entities.length ||
      resolution.docs.length,
  );

  const closeAndReset = React.useCallback(() => {
    setSelectedIndex(0);
    setPlaybookMessage(null);
    setSelectedServiceId(DEFAULT_SERVICE_ID);
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
      if (action.id === 'ai-guidance') {
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
      if (action.access === 'restricted') {
        goTo(action.requestAccess);
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

  const resultGroups = React.useMemo(() => {
    if (!hasQuery) return [];

    const taggedRows: { item: PaletteAction; kind: ResultKind }[] = [
      ...resolution.actions.map((item) => ({ item, kind: kindForItem(item) })),
      ...resolution.entities.map((item) => ({ item, kind: entityKind(item) })),
      ...resolution.docs.map((item) => ({ item, kind: (item.kind || 'documentation') as ResultKind })),
    ];

    const groups: Record<ResultGroupKey, { item: PaletteAction; kind: ResultKind }[]> = {
      services: [],
      inventories: [],
      learning: [],
      playbooks: [],
    };

    taggedRows.forEach((row) => {
      groups[kindToGroup(row.kind)].push(row);
    });

    return resultGroupOrder
      .filter((key) => groups[key].length > 0)
      .map((key) => ({ key, label: resultGroupLabel[key], rows: groups[key] }));
  }, [hasQuery, resolution]);

  const flatItems = React.useMemo((): FlatItem[] => {
    const items: FlatItem[] = [];

    if (!hasQuery) {
      if (showSearchShortcuts) {
        commonActions.forEach((item) => items.push({ id: item.id, type: 'row', run: () => runAction(item) }));
        suggestions.forEach((item) => items.push({ id: item.id, type: 'row', run: () => runAction(item) }));
        recentEntities.forEach((item) => items.push({ id: item.id, type: 'row', run: () => runAction(item) }));
      }
      return items;
    }

    resolution.answer?.actions.forEach((action) => {
      items.push({
        id: action.id,
        type: 'row',
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

    resultGroups.forEach((group) => {
      items.push({
        id: `group-header-${group.key}`,
        type: 'group-header',
        groupKey: group.key,
        run: () => toggleGroup(group.key),
      });
      if (!collapsedGroups.has(group.key)) {
        group.rows.forEach(({ item }) => items.push({ id: item.id, type: 'row', run: () => runAction(item) }));
      }
    });

    return items;
  }, [hasQuery, resolution, runAction, runPlaybook, goTo, suggestions, showSearchShortcuts, resultGroups, collapsedGroups, toggleGroup]);

  React.useEffect(() => {
    setSelectedIndex(0);
    setCollapsedGroups(new Set());
  }, [query, isOpen, selectedServiceId]);

  React.useEffect(() => {
    if (!isOpen || hasQuery) {
      setSelectedServiceId(DEFAULT_SERVICE_ID);
    }
  }, [isOpen, hasQuery]);

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
      const target = event.target as HTMLElement | null;
      const isNestedControl = Boolean(
        target?.closest(
          '.ai-search-palette__feedback, .ai-search-palette__item-access, .ai-search-palette__services, .ai-search-palette__service-detail',
        ),
      );

      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndReset();
        return;
      }
      if (isNestedControl) {
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
      if (event.key === 'ArrowLeft') {
        const selected = flatItems[selectedIndex];
        if (selected?.type === 'group-header' && selected.groupKey && !collapsedGroups.has(selected.groupKey)) {
          event.preventDefault();
          toggleGroup(selected.groupKey);
        }
        return;
      }
      if (event.key === 'ArrowRight') {
        const selected = flatItems[selectedIndex];
        if (selected?.type === 'group-header' && selected.groupKey && collapsedGroups.has(selected.groupKey)) {
          event.preventDefault();
          toggleGroup(selected.groupKey);
        }
        return;
      }
      const isInInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (event.key === ' ' && !isInInput) {
        const selected = flatItems[selectedIndex];
        if (selected?.type === 'group-header') {
          event.preventDefault();
          selected.run();
        }
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

  const renderRow = (item: PaletteAction, kind: ResultKind) => {
    const isRestricted = item.access === 'restricted';
    const RowTag = isRestricted ? 'div' : 'button';

    return (
      <RowTag
        {...(!isRestricted ? { type: 'button' as const } : {})}
        key={item.id}
        id={`ai-search-item-${item.id}`}
        className={`ai-search-palette__item${isActive(item.id) ? ' is-active' : ''}${
          isRestricted ? ' is-restricted' : ''
        }`}
        role="option"
        aria-selected={isActive(item.id)}
        aria-label={
          isRestricted
            ? `${item.title}, access required, owned by ${item.owner || 'unknown'}`
            : undefined
        }
        onMouseEnter={() => {
          const index = flatItems.findIndex((flat) => flat.id === item.id);
          if (index >= 0) {
            setSelectedIndex(index);
          }
        }}
        onClick={() => runAction(item)}
      >
        <Tooltip
          content={isRestricted ? `${resultTypeLabel[kind]} · Access required` : resultTypeLabel[kind]}
          position="left"
        >
          <span
            className="ai-search-palette__type"
            aria-label={isRestricted ? `${resultTypeLabel[kind]}, access required` : resultTypeLabel[kind]}
          >
            <Icon {...(isRestricted ? { status: 'warning' as const } : {})}>
              {isRestricted ? <LockIcon /> : resultTypeIcon[kind]}
            </Icon>
          </span>
        </Tooltip>
        <span className="ai-search-palette__item-body">
          <span className="ai-search-palette__item-title">{item.title}</span>
          {(item.description || item.meta) && (
            <span className="ai-search-palette__item-meta">{item.meta || item.description}</span>
          )}
          {isRestricted && item.owner && (
            <span className="ai-search-palette__item-meta">Owner: {item.owner}</span>
          )}
        </span>
        {isRestricted && (
          <span className="ai-search-palette__item-access">
            <Label status="warning" isCompact>
              Access required
            </Label>
            <Button
              variant="link"
              isInline
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                goTo(item.requestAccess);
              }}
            >
              Request access
            </Button>
          </span>
        )}
      </RowTag>
    );
  };

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
        className={`ai-search-palette__dropdown${!hasQuery ? ' is-zero-state' : ''}`}
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

          {!hasQuery && (
            <Split className="ai-search-palette__zero-state">
              <SplitItem className="ai-search-palette__services">
                <SearchServicesPanel
                  selectedItemId={selectedServiceId}
                  onSelectService={setSelectedServiceId}
                  onNavigate={goTo}
                />
              </SplitItem>
              <SplitItem isFilled className="ai-search-palette__zero-results">
                {selectedService && !showSearchShortcuts ? (
                  <div className="ai-search-palette__service-detail">
                    <SearchServiceDetail
                      item={selectedService}
                      favoritedItems={favoritedItems}
                      onToggleFavorite={toggleFavorite}
                      onNavigate={goTo}
                    />
                  </div>
                ) : (
                  <div role="listbox" aria-label="Search suggestions">
                    {sectionTitle('Common actions')}
                    {commonActions.map((item) => renderRow(item, kindForItem(item)))}

                    {sectionTitle('Suggestions')}
                    {suggestions.map((item) => renderRow(item, 'suggestion'))}

                    {sectionTitle('Recent history')}
                    {recentEntities.map((item) => renderRow(item, entityKind(item)))}
                  </div>
                )}
              </SplitItem>
            </Split>
          )}

          {hasQuery && (
          <div role="listbox" aria-label="Search results">
            {resolution.answer && (
              <>
                {sectionTitle('AI Answer')}
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

            {!hasResults && (
              <Content className="ai-search-palette__empty">
                <p>No matching results. Try another query, or tell us what you expected below.</p>
              </Content>
            )}

            {resultGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.key);
              const headerId = `group-header-${group.key}`;
              return (
                <React.Fragment key={group.key}>
                  <button
                    type="button"
                    id={`ai-search-item-${headerId}`}
                    className={`ai-search-palette__group-header${isActive(headerId) ? ' is-active' : ''}`}
                    aria-expanded={!isCollapsed}
                    onClick={() => toggleGroup(group.key)}
                    onMouseEnter={() => {
                      const index = flatItems.findIndex((flat) => flat.id === headerId);
                      if (index >= 0) setSelectedIndex(index);
                    }}
                  >
                    <Icon size="sm">
                      {isCollapsed ? <AngleRightIcon /> : <AngleDownIcon />}
                    </Icon>
                    <span className="ai-search-palette__group-header-text">
                      {group.label} ({group.rows.length})
                    </span>
                  </button>
                  {!isCollapsed && group.rows.map(({ item, kind }) => renderRow(item, kind))}
                </React.Fragment>
              );
            })}
          </div>
          )}
        </CardBody>
        <CardFooter>
          {hasQuery && <SearchFeedback query={query.trim()} />}
          {!hasQuery && <Divider />}
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
