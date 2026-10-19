import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { DashboardDataProvider } from '@app/DashboardHub/DashboardDataContext';
import { PinnedDashboardsProvider } from '@app/DashboardHub/PinnedDashboardsContext';
import { FavoritedServicesProvider } from '@app/favoriteServices/FavoritedServicesContext';
import { AppRoutes } from '@app/routes';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import '@app/app.css';

const App: React.FunctionComponent = () => {
  useDocumentTitle('AI Search Prototype');

  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/HCC-AI-Search' : ''}>
      <DashboardDataProvider>
        <PinnedDashboardsProvider>
          <FavoritedServicesProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </FavoritedServicesProvider>
        </PinnedDashboardsProvider>
      </DashboardDataProvider>
    </Router>
  );
};

export default App;
