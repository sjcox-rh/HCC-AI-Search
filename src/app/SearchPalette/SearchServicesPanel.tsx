import * as React from 'react';
import {
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Flex,
  FlexItem,
  Icon,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemAction,
  MenuList,
  Title,
} from '@patternfly/react-core';
import {
  BellIcon,
  BrainIcon,
  CreditCardIcon,
  CubeIcon,
  EyeIcon,
  ListIcon,
  PlayIcon,
  RocketIcon,
  ServerIcon,
  ShieldAltIcon,
  StarIcon,
  UsersIcon,
  WrenchIcon,
} from '@patternfly/react-icons';
import { SearchNavTarget, ServiceNavItem, serviceNavItems } from './searchPaletteData';
import { CatalogEntry, CatalogGroup, getCatalogGroups, getFavoriteGroups } from './serviceCatalogData';

export interface SearchServicesPanelProps {
  selectedItemId: string;
  onSelectService: (id: string) => void;
  onNavigate: (nav?: SearchNavTarget) => void;
}

export interface SearchServiceDetailProps {
  item: ServiceNavItem;
  favoritedItems: Set<string>;
  onToggleFavorite: (id: string) => void;
  onNavigate: (nav?: SearchNavTarget) => void;
}

const DEFAULT_SERVICE_ID = 'my-favorite-services';

const serviceIcon = (icon: ServiceNavItem['icon']): React.ReactNode => {
  switch (icon) {
    case 'wrench':
      return <WrenchIcon />;
    case 'server':
      return <ServerIcon />;
    case 'cube':
      return <CubeIcon />;
    case 'star':
      return <StarIcon />;
    case 'brain':
      return <BrainIcon />;
    case 'bell':
      return <BellIcon />;
    case 'rocket':
      return <RocketIcon />;
    case 'users':
      return <UsersIcon />;
    case 'list':
      return <ListIcon />;
    case 'eye':
      return <EyeIcon />;
    case 'play':
      return <PlayIcon />;
    case 'shield':
      return <ShieldAltIcon />;
    case 'credit-card':
      return <CreditCardIcon />;
    default:
      return <ListIcon />;
  }
};

export const getSelectedService = (id: string): ServiceNavItem | undefined =>
  serviceNavItems.find((item) => item.id === id);

const CatalogMenu: React.FunctionComponent<{
  groups: CatalogGroup[];
  favoritedItems: Set<string>;
  onToggleFavorite: (id: string) => void;
  onNavigate: (nav?: SearchNavTarget) => void;
}> = ({ groups, favoritedItems, onToggleFavorite, onNavigate }) => {
  const renderEntry = (entry: CatalogEntry) => {
    const isFavorited = favoritedItems.has(entry.id);
    return (
      <MenuItem
        key={entry.id}
        itemId={entry.id}
        description={entry.description}
        onClick={() => {
          if (entry.route) {
            onNavigate({ route: entry.route });
          }
        }}
        actions={
          <MenuItemAction
            icon={<StarIcon />}
            actionId="favorite"
            isFavorited={isFavorited}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(entry.id);
            }}
          />
        }
      >
        {entry.name}
      </MenuItem>
    );
  };

  return (
    <Menu isPlain>
      <MenuContent>
        {groups.map((group) => (
          <MenuGroup key={group.category} label={group.category} labelHeadingLevel="h2">
            <Divider />
            <MenuList>{group.items.map(renderEntry)}</MenuList>
          </MenuGroup>
        ))}
      </MenuContent>
    </Menu>
  );
};

const SearchServiceDetail: React.FunctionComponent<SearchServiceDetailProps> = ({
  item,
  favoritedItems,
  onToggleFavorite,
  onNavigate,
}) => {
  if (item.id === DEFAULT_SERVICE_ID) {
    const favoriteGroups = getFavoriteGroups(favoritedItems);
    if (favoriteGroups.length === 0) {
      return (
        <EmptyState variant="sm" titleText="No favorited services" headingLevel="h3" icon={StarIcon}>
          <EmptyStateBody>Add a service to your favorites to get started here.</EmptyStateBody>
          <EmptyStateFooter>
            <Button variant="primary" onClick={() => onNavigate({ route: '/all-services' })}>
              View all services
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        <FlexItem>
          <Title headingLevel="h3" size="xl">
            {item.name}
          </Title>
        </FlexItem>
        <FlexItem>
          <CatalogMenu
            groups={favoriteGroups}
            favoritedItems={favoritedItems}
            onToggleFavorite={onToggleFavorite}
            onNavigate={onNavigate}
          />
        </FlexItem>
      </Flex>
    );
  }

  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
      <FlexItem>
        <Title headingLevel="h3" size="xl">
          {item.name}
        </Title>
      </FlexItem>
      <FlexItem>
        <CatalogMenu
          groups={getCatalogGroups(item.id)}
          favoritedItems={favoritedItems}
          onToggleFavorite={onToggleFavorite}
          onNavigate={onNavigate}
        />
      </FlexItem>
    </Flex>
  );
};

const SearchServicesPanel: React.FunctionComponent<SearchServicesPanelProps> = ({
  selectedItemId,
  onSelectService,
  onNavigate,
}) => {
  const platforms = serviceNavItems.filter((item) => item.group === 'Platforms');
  const services = serviceNavItems.filter((item) => item.group === 'Services');

  return (
    <Menu isPlain aria-label="Platforms and services">
      <MenuContent>
        <MenuList>
          <MenuGroup
            label={
              <h3 className="pf-v6-c-menu__group-title">Platforms</h3>
            }
          >
            {platforms.map((item) => (
              <MenuItem
                key={item.id}
                itemId={item.id}
                className={`ai-search-palette__platform-link${selectedItemId === item.id ? ' is-selected' : ''}`}
                onClick={() => onSelectService(item.id)}
              >
                {item.name}
              </MenuItem>
            ))}
          </MenuGroup>
          <Divider component="li" />
          <MenuGroup
            label={
              <h3 className="pf-v6-c-menu__group-title">
                <Flex
                  className="ai-search-palette__services-heading"
                  alignItems={{ default: 'alignItemsCenter' }}
                  justifyContent={{ default: 'justifyContentSpaceBetween' }}
                  flexWrap={{ default: 'nowrap' }}
                  spaceItems={{ default: 'spaceItemsSm' }}
                >
                  <FlexItem>Services</FlexItem>
                  <FlexItem>
                    <Button
                      variant="link"
                      isInline
                      className="ai-search-palette__view-all"
                      onClick={(event) => {
                        event.stopPropagation();
                        onNavigate({ route: '/all-services' });
                      }}
                    >
                      View all services
                    </Button>
                  </FlexItem>
                </Flex>
              </h3>
            }
          >
            {services.map((item) => (
              <MenuItem
                key={item.id}
                itemId={item.id}
                icon={<Icon>{serviceIcon(item.icon)}</Icon>}
                className={selectedItemId === item.id ? 'is-selected' : undefined}
                onClick={() => onSelectService(item.id)}
              >
                {item.name}
              </MenuItem>
            ))}
          </MenuGroup>
        </MenuList>
      </MenuContent>
    </Menu>
  );
};

export { SearchServicesPanel, SearchServiceDetail, DEFAULT_SERVICE_ID };
