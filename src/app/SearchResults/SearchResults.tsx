import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Label,
  PageSection,
  Switch,
  Title,
  Tooltip,
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
  PaletteAction,
  PaletteResultKind,
  resolveQuery,
  SearchNavTarget,
} from '../SearchPalette/searchPaletteData';
import { SearchFeedback } from '../SearchPalette/SearchFeedback';
import '../SearchPalette/SearchPalette.css';
import './SearchResults.css';

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

type ResultGroupKey = 'services' | 'inventories' | 'learning' | 'playbooks';

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

const kindForItem = (item: PaletteAction): ResultKind => {
  if (item.kind) return item.kind;
  if (item.playbook) return 'playbook';
  return 'action';
};

const entityKind = (item: PaletteAction): ResultKind => {
  if (item.kind) return item.kind;
  const title = item.title.toLowerCase();
  if (title.includes('cluster')) return 'cluster';
  if (title.includes('group')) return 'group';
  if (title.includes('system')) return 'system';
  return 'host';
};

const SearchResults: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const resolution = React.useMemo(() => resolveQuery(query), [query]);
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<ResultGroupKey>>(new Set());
  const [showAiAnswers, setShowAiAnswers] = React.useState(true);
  const [playbookMessage, setPlaybookMessage] = React.useState<string | null>(null);

  const hasResults = Boolean(
    resolution.answer || resolution.actions.length || resolution.entities.length || resolution.docs.length,
  );

  const goTo = React.useCallback(
    (nav?: SearchNavTarget) => {
      if (!nav) return;
      navigate(nav.route, {
        state: nav.filters || nav.query ? { searchFilters: nav.filters, searchQuery: nav.query } : undefined,
      });
    },
    [navigate],
  );

  const runPlaybook = React.useCallback(() => {
    setPlaybookMessage('Remediation playbook queued for Ansible Automation Platform (prototype).');
  }, []);

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

  const resultGroups = React.useMemo(() => {
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
  }, [resolution]);

  const totalResults = resultGroups.reduce((sum, g) => sum + g.rows.length, 0);

  const topResults = React.useMemo(() => {
    const top: { item: PaletteAction; kind: ResultKind }[] = [];
    const seen = new Set<string>();
    const MAX_TOP = 5;

    const addIfNew = (item: PaletteAction, kind: ResultKind) => {
      if (!seen.has(item.id) && top.length < MAX_TOP) {
        seen.add(item.id);
        top.push({ item, kind });
      }
    };

    // First: landing pages (service kind)
    resolution.actions.forEach((item) => {
      const kind = kindForItem(item);
      if (kind === 'service') addIfNew(item, kind);
    });

    // Then: first entity
    if (resolution.entities.length > 0) {
      const item = resolution.entities[0];
      addIfNew(item, entityKind(item));
    }

    // Then: first doc
    if (resolution.docs.length > 0) {
      const item = resolution.docs[0];
      addIfNew(item, (item.kind || 'documentation') as ResultKind);
    }

    // Fill remaining from actions (pages, playbooks)
    resolution.actions.forEach((item) => {
      const kind = kindForItem(item);
      if (kind !== 'service') addIfNew(item, kind);
    });

    // Fill from entities
    resolution.entities.slice(1).forEach((item) => {
      addIfNew(item, entityKind(item));
    });

    return top;
  }, [resolution]);

  const renderRow = (item: PaletteAction, kind: ResultKind) => {
    const isRestricted = item.access === 'restricted';
    return (
      <div
        key={item.id}
        className={`ai-search-results__item${isRestricted ? ' is-restricted' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isRestricted && item.nav) goTo(item.nav);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isRestricted && item.nav) goTo(item.nav);
        }}
      >
        <Tooltip content={resultTypeLabel[kind]} position="left">
          <span className="ai-search-palette__type">
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
            <Label status="warning" isCompact>Access required</Label>
            <Button
              variant="link"
              isInline
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                goTo(item.requestAccess);
              }}
            >
              Request access
            </Button>
          </span>
        )}
      </div>
    );
  };

  if (!query) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Content>
          <p>Enter a search query to see results.</p>
        </Content>
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <div className="ai-search-results">
        <Flex
          className="ai-search-results__header"
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
        >
          <FlexItem>
            <Title headingLevel="h1" size="xl">
              Search results for &ldquo;{query}&rdquo;
            </Title>
            <Content component="small">{totalResults} results found</Content>
          </FlexItem>
        </Flex>

        {/* Results summary bar */}
        {resultGroups.length > 0 && (
          <div className="ai-search-results__summary">
            {topResults.length > 0 && (
              <Button
                variant="plain"
                isInline
                size="sm"
                className="ai-search-results__summary-chip"
                onClick={() => {
                  const el = document.getElementById('search-results-group-top');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Top results
                <Label isCompact>{topResults.length}</Label>
              </Button>
            )}
            {resultGroups.map((group) => (
              <Button
                key={group.key}
                variant="plain"
                isInline
                size="sm"
                className="ai-search-results__summary-chip"
                onClick={() => {
                  if (collapsedGroups.has(group.key)) {
                    toggleGroup(group.key);
                  }
                  requestAnimationFrame(() => {
                    const el = document.getElementById(`search-results-group-${group.key}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  });
                }}
              >
                {group.label}
                <Label isCompact>{group.rows.length}</Label>
              </Button>
            ))}
            {resolution.answer && (
              <span className="ai-search-results__summary-ai">
                <Switch
                  id="ai-answers-toggle-page"
                  label="AI answers"
                  isChecked={showAiAnswers}
                  onChange={(_event, checked) => setShowAiAnswers(checked)}
                  isReversed
                />
              </span>
            )}
          </div>
        )}

        {playbookMessage && (
          <Alert variant="success" isInline title="Playbook generated" className="ai-search-results__alert">
            {playbookMessage}
          </Alert>
        )}

        {/* AI Answer card */}
        {resolution.answer && showAiAnswers && (
          <Card isCompact className="ai-search-results__ai-card">
            <CardHeader>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <img src={SparkleIcon} alt="" width={16} height={16} />
                </FlexItem>
                <FlexItem flex={{ default: 'flex_1' }}>
                  <CardTitle>AI summary</CardTitle>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="plain"
                    size="sm"
                    aria-label="Dismiss AI summary"
                    onClick={() => setShowAiAnswers(false)}
                  >
                    ✕
                  </Button>
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
                          onClick={() => {
                            if (action.playbook) {
                              runPlaybook();
                              return;
                            }
                            if (action.nav) goTo(action.nav);
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
        )}

        {!hasResults && (
          <Content className="ai-search-results__empty">
            <p>No matching results for &ldquo;{query}&rdquo;. Try another query.</p>
          </Content>
        )}

        {/* Top results */}
        {topResults.length > 0 && (
          <div className="ai-search-results__group" id="search-results-group-top">
            <Title headingLevel="h2" size="md" className="ai-search-results__top-heading">
              Top results
            </Title>
            <div className="ai-search-results__group-items">
              {topResults.map(({ item, kind }) => renderRow(item, kind))}
            </div>
          </div>
        )}

        {/* Grouped results */}
        {resultGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.key);
          return (
            <div key={group.key} className="ai-search-results__group" id={`search-results-group-${group.key}`}>
              <button
                type="button"
                className="ai-search-results__group-header"
                aria-expanded={!isCollapsed}
                onClick={() => toggleGroup(group.key)}
              >
                <Icon size="sm">
                  {isCollapsed ? <AngleRightIcon /> : <AngleDownIcon />}
                </Icon>
                <span className="ai-search-results__group-header-text">
                  {group.label} ({group.rows.length})
                </span>
              </button>
              {!isCollapsed && (
                <div className="ai-search-results__group-items">
                  {group.rows.map(({ item, kind }) => renderRow(item, kind))}
                </div>
              )}
            </div>
          );
        })}

        <Divider />
        <SearchFeedback query={query} />
      </div>
    </PageSection>
  );
};

export { SearchResults };
