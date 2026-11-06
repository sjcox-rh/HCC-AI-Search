import * as React from 'react';
import { SearchPalette, SearchPaletteProps } from '@app/SearchPalette/SearchPalette';
import { DemoFlowControllers, useDemoFlow } from './DemoFlowContext';

export const DemoFlowWiring: React.FunctionComponent<{ controllers: DemoFlowControllers }> = ({
  controllers,
}) => {
  const { registerControllers } = useDemoFlow();

  React.useEffect(() => {
    registerControllers(controllers);
  }, [controllers, registerControllers]);

  return null;
};

type SearchPaletteDemoProps = Omit<SearchPaletteProps, 'onViewInHelpPanel' | 'onAskLightspeed'>;

export const SearchPaletteWithDemo: React.FunctionComponent<SearchPaletteDemoProps> = (props) => {
  const { openMigrationDoc, askLightspeedFromSearch, setStep } = useDemoFlow();

  return (
    <SearchPalette
      {...props}
      onViewInHelpPanel={() => {
        setStep(2);
        openMigrationDoc();
      }}
      onAskLightspeed={(item) => {
        askLightspeedFromSearch(item.title);
      }}
    />
  );
};
