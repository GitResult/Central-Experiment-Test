/**
 * InteractiveGuideMode
 * Main container for interactive Help5 walkthroughs
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import InputCollector from './InputCollector';
import AutomationEngine from './AutomationEngine';

export function InteractiveGuideMode({
  isOpen,
  onClose,
  automationRecord,
  onComplete
}) {
  const [showInputCollector, setShowInputCollector] = useState(true);
  const [userInputs, setUserInputs] = useState({});
  const [isAutomationActive, setIsAutomationActive] = useState(false);

  if (!isOpen) return null;

  const handleStartAutomation = (inputs) => {
    setUserInputs(inputs);
    setShowInputCollector(false);
    setIsAutomationActive(true);
  };

  const handleAutomationComplete = () => {
    setIsAutomationActive(false);
    onComplete?.();
    // Keep guide open for user to review
  };

  const handleClose = () => {
    setShowInputCollector(true);
    setIsAutomationActive(false);
    setUserInputs({});
    onClose?.();
  };

  const inputsRequired = automationRecord?.content?.inputs_required || {};

  return (
    <>
      {/* Input Collection Phase */}
      {showInputCollector && (
        <InputCollector
          isOpen={showInputCollector}
          onClose={handleClose}
          inputsRequired={inputsRequired}
          onStart={handleStartAutomation}
        />
      )}

      {/* Automation Execution Phase */}
      {isAutomationActive && (
        <AutomationEngine
          automationRecord={automationRecord}
          userInputs={userInputs}
          isActive={isAutomationActive}
          onComplete={handleAutomationComplete}
          onClose={handleClose}
        />
      )}
    </>
  );
}

InteractiveGuideMode.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  automationRecord: PropTypes.shape({
    record_id: PropTypes.string,
    record_type: PropTypes.string,
    parent_id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.shape({
      steps: PropTypes.array,
      sections: PropTypes.array,
      inputs_required: PropTypes.object
    })
  }),
  onComplete: PropTypes.func
};

InteractiveGuideMode.defaultProps = {
  automationRecord: null,
  onComplete: () => {}
};

export default InteractiveGuideMode;
