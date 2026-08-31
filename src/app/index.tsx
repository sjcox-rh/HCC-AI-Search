import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import '@app/app.css';

const App: React.FunctionComponent = () => {
  useDocumentTitle('AI Search Prototype');

  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/HCC-AI-Search' : ''}>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
};

export default App;
