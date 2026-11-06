import * as React from 'react';
import {
  DEMO_SEARCH_QUERY,
  DemoStep,
  LIGHTSPEED_CONTEXT_PILL,
  RHEL10_MIGRATION_DOC_TITLE,
} from './demoFlowData';

export type LightspeedPhase = 'idle' | 'analyzing' | 'ready' | 'playbook';

export interface DemoFlowContextValue {
  step: DemoStep;
  helpDocOpen: boolean;
  lightspeedActive: boolean;
  lightspeedPhase: LightspeedPhase;
  contextPill: string | null;
  selectedChip: string | null;
  setStep: (step: DemoStep) => void;
  nextStep: () => void;
  reset: () => void;
  openMigrationDoc: () => void;
  analyzeFleetInLightspeed: () => void;
  askLightspeedFromSearch: (sourceTitle?: string) => void;
  selectActionChip: (chipId: string) => void;
  registerControllers: (controllers: DemoFlowControllers) => void;
}

export interface DemoFlowControllers {
  openHelpPanelWithTab: (title: string) => void;
  openLightspeedTab: () => void;
  openSearchWithQuery: (query: string) => void;
  closeSearchPalette: () => void;
}

const DemoFlowContext = React.createContext<DemoFlowContextValue | undefined>(undefined);

export const DemoFlowProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStepState] = React.useState<DemoStep>(1);
  const [helpDocOpen, setHelpDocOpen] = React.useState(false);
  const [lightspeedActive, setLightspeedActive] = React.useState(false);
  const [lightspeedPhase, setLightspeedPhase] = React.useState<LightspeedPhase>('idle');
  const [contextPill, setContextPill] = React.useState<string | null>(null);
  const [selectedChip, setSelectedChip] = React.useState<string | null>(null);
  const controllersRef = React.useRef<DemoFlowControllers | null>(null);

  const registerControllers = React.useCallback((controllers: DemoFlowControllers) => {
    controllersRef.current = controllers;
  }, []);

  const setStep = React.useCallback((next: DemoStep) => {
    setStepState(next);
  }, []);

  const openMigrationDoc = React.useCallback(() => {
    controllersRef.current?.closeSearchPalette();
    controllersRef.current?.openHelpPanelWithTab(RHEL10_MIGRATION_DOC_TITLE);
    setHelpDocOpen(true);
    setStepState(2);
  }, []);

  const analyzeFleetInLightspeed = React.useCallback(() => {
    setHelpDocOpen(true);
    setLightspeedActive(true);
    setContextPill(LIGHTSPEED_CONTEXT_PILL);
    setLightspeedPhase('analyzing');
    setSelectedChip(null);
    setStepState(3);
    controllersRef.current?.openLightspeedTab();
    window.setTimeout(() => {
      setLightspeedPhase('ready');
    }, 900);
  }, []);

  const askLightspeedFromSearch = React.useCallback((sourceTitle?: string) => {
    controllersRef.current?.closeSearchPalette();
    setHelpDocOpen(true);
    setLightspeedActive(true);
    setContextPill(
      sourceTitle
        ? `Context: ${sourceTitle} + 42 Registered RHEL 9 Hosts`
        : LIGHTSPEED_CONTEXT_PILL,
    );
    setLightspeedPhase('analyzing');
    setSelectedChip(null);
    setStepState(3);
    controllersRef.current?.openLightspeedTab();
    window.setTimeout(() => {
      setLightspeedPhase('ready');
    }, 900);
  }, []);

  const selectActionChip = React.useCallback((chipId: string) => {
    setSelectedChip(chipId);
    if (chipId === 'playbook') {
      setLightspeedPhase('playbook');
    }
  }, []);

  const reset = React.useCallback(() => {
    setStepState(1);
    setHelpDocOpen(false);
    setLightspeedActive(false);
    setLightspeedPhase('idle');
    setContextPill(null);
    setSelectedChip(null);
    controllersRef.current?.openSearchWithQuery(DEMO_SEARCH_QUERY);
  }, []);

  const nextStep = React.useCallback(() => {
    if (step === 1) {
      openMigrationDoc();
      return;
    }
    if (step === 2) {
      analyzeFleetInLightspeed();
    }
  }, [analyzeFleetInLightspeed, openMigrationDoc, step]);

  const value = React.useMemo<DemoFlowContextValue>(
    () => ({
      step,
      helpDocOpen,
      lightspeedActive,
      lightspeedPhase,
      contextPill,
      selectedChip,
      setStep,
      nextStep,
      reset,
      openMigrationDoc,
      analyzeFleetInLightspeed,
      askLightspeedFromSearch,
      selectActionChip,
      registerControllers,
    }),
    [
      step,
      helpDocOpen,
      lightspeedActive,
      lightspeedPhase,
      contextPill,
      selectedChip,
      setStep,
      nextStep,
      reset,
      openMigrationDoc,
      analyzeFleetInLightspeed,
      askLightspeedFromSearch,
      selectActionChip,
      registerControllers,
    ],
  );

  return <DemoFlowContext.Provider value={value}>{children}</DemoFlowContext.Provider>;
};

export const useDemoFlow = (): DemoFlowContextValue => {
  const ctx = React.useContext(DemoFlowContext);
  if (!ctx) {
    throw new Error('useDemoFlow must be used within DemoFlowProvider');
  }
  return ctx;
};

export const useDemoFlowOptional = (): DemoFlowContextValue | undefined =>
  React.useContext(DemoFlowContext);
