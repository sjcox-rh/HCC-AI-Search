import * as React from 'react';
import { Button, Label } from '@patternfly/react-core';
import { DEMO_STEPS, PROTOTYPE_VERSION_LABEL } from './demoFlowData';
import { useDemoFlow } from './DemoFlowContext';
import './DemoFlow.css';

export const DemoFlowStepper: React.FunctionComponent = () => {
  const { step, setStep, nextStep, reset, openMigrationDoc, analyzeFleetInLightspeed } = useDemoFlow();

  const handleStepClick = (target: 1 | 2 | 3) => {
    setStep(target);
    if (target === 1) {
      reset();
      return;
    }
    if (target === 2) {
      openMigrationDoc();
      return;
    }
    analyzeFleetInLightspeed();
  };

  return (
    <div className="demo-flow-stepper" role="region" aria-label="Demo flow controls">
      <span className="demo-flow-stepper__version">{PROTOTYPE_VERSION_LABEL}</span>
      <span className="demo-flow-stepper__label">Demo Flow:</span>
      <div className="demo-flow-stepper__steps">
        {DEMO_STEPS.map((item, index) => (
          <React.Fragment key={item.step}>
            {index > 0 && <span className="demo-flow-stepper__arrow" aria-hidden>→</span>}
            <button
              type="button"
              className={`demo-flow-stepper__step${step === item.step ? ' is-active' : ''}`}
              onClick={() => handleStepClick(item.step)}
              aria-current={step === item.step ? 'step' : undefined}
            >
              <Label color={step === item.step ? 'teal' : 'grey'} isCompact>
                {item.label}
              </Label>
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="demo-flow-stepper__actions">
        <Button variant="secondary" size="sm" onClick={nextStep} isDisabled={step === 3}>
          Next step
        </Button>
        <Button variant="link" isInline size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
};
