/**
 * Blueprint Wizard
 * Main wizard component for Blueprint Generator
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { theme } from '../../config/theme';
import { useBlueprintWizard } from './hooks/useBlueprintWizard';
import Step1_Upload from './steps/Step1_Upload';
import Step2_Schema from './steps/Step2_Schema';
import Step3_Options from './steps/Step3_Options';
import Step4_Preview from './steps/Step4_Preview';
import Step5_Help5 from './steps/Step5_Help5';

const STEPS = [
  { id: 0, title: 'Upload CSV', description: 'Upload your data file' },
  { id: 1, title: 'Review Schema', description: 'Verify field types' },
  { id: 2, title: 'Select Pages', description: 'Choose pages to generate' },
  { id: 3, title: 'Preview', description: 'Review generated pages' },
  { id: 4, title: 'Help5 Context', description: 'Document the pages' }
];

export function BlueprintWizard({ isOpen, onClose, onComplete }) {
  const {
    currentStep,
    csvData,
    schema,
    entityName,
    selectedPages,
    generatedPages,
    isProcessing,
    error,
    help5Records,
    automationRecords,
    currentHelp5Index,
    help5Stats,
    uploadCSV,
    updateSchema,
    setEntityName,
    updateSelectedPages,
    generatePreview,
    updateHelp5,
    nextHelp5Page,
    prevHelp5Page,
    nextStep,
    prevStep,
    reset
  } = useBlueprintWizard();

  // Reset wizard when closed
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleNext = () => {
    // Generate preview when moving from step 2 to step 3
    if (currentStep === 2) {
      const success = generatePreview();
      if (success) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handleFinalize = () => {
    if (onComplete && generatedPages.length > 0) {
      // Pass pages, help5 records, and automation records
      onComplete({
        pages: generatedPages,
        help5: help5Records,
        automations: automationRecords
      });
      onClose();
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return csvData !== null && schema !== null;
      case 1:
        return schema !== null && schema.fields && schema.fields.length > 0;
      case 2:
        return Object.values(selectedPages).some(Boolean);
      case 3:
        return generatedPages.length > 0;
      case 4:
        // Can always skip Help5 step
        return true;
      default:
        return true;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing[4]
    }}>
      <div style={{
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows['2xl'],
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: theme.spacing[6],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[1]
            }}>
              Blueprint Generator
            </h1>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              margin: 0
            }}>
              Generate CRUD pages from CSV data
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.md,
              color: theme.colors.text.secondary
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div style={{
          padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
          borderBottom: `1px solid ${theme.colors.border.default}`,
          backgroundColor: theme.colors.background.secondary
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {STEPS.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= step.id ? theme.colors.primary[500] : theme.colors.background.tertiary,
                    color: currentStep >= step.id ? theme.colors.text.inverse : theme.colors.text.tertiary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold
                  }}>
                    {currentStep > step.id ? <Check size={16} /> : index + 1}
                  </div>
                  <span style={{
                    marginTop: theme.spacing[2],
                    fontSize: theme.typography.fontSize.xs,
                    color: currentStep >= step.id ? theme.colors.text.primary : theme.colors.text.tertiary,
                    fontWeight: currentStep === step.id ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
                    textAlign: 'center'
                  }}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: currentStep > step.id ? theme.colors.primary[500] : theme.colors.border.default,
                    marginLeft: theme.spacing[2],
                    marginRight: theme.spacing[2],
                    marginBottom: theme.spacing[6]
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentStep === 0 && (
            <Step1_Upload
              onUpload={uploadCSV}
              isProcessing={isProcessing}
              error={error}
            />
          )}
          {currentStep === 1 && schema && (
            <Step2_Schema
              schema={schema}
              entityName={entityName}
              onSchemaChange={updateSchema}
              onEntityNameChange={setEntityName}
            />
          )}
          {currentStep === 2 && (
            <Step3_Options
              selectedPages={selectedPages}
              onSelectionChange={updateSelectedPages}
            />
          )}
          {currentStep === 3 && (
            <Step4_Preview
              generatedPages={generatedPages}
              entityName={entityName}
            />
          )}
          {currentStep === 4 && (
            <Step5_Help5
              currentPage={help5Stats.currentPage}
              currentHelp5={help5Stats.currentHelp5}
              onUpdateHelp5={(field, value) => updateHelp5(currentHelp5Index, field, value)}
              overallCompletion={help5Stats.overallCompletion}
              completeCount={help5Stats.completeCount}
              totalPages={help5Stats.totalPages}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: theme.spacing[6],
          borderTop: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: theme.spacing[3]
        }}>
          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Help5 page navigation (only on Step 5) */}
            {currentStep === 4 && help5Stats.totalPages > 1 && (
              <>
                <button
                  onClick={prevHelp5Page}
                  disabled={currentHelp5Index === 0}
                  style={{
                    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary,
                    cursor: currentHelp5Index === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentHelp5Index === 0 ? 0.5 : 1
                  }}
                >
                  ◀ Prev Page
                </button>
                <span style={{
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary
                }}>
                  Page {currentHelp5Index + 1} of {help5Stats.totalPages}
                </span>
                <button
                  onClick={nextHelp5Page}
                  disabled={currentHelp5Index >= help5Stats.totalPages - 1}
                  style={{
                    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary,
                    cursor: currentHelp5Index >= help5Stats.totalPages - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentHelp5Index >= help5Stats.totalPages - 1 ? 0.5 : 1
                  }}
                >
                  Next Page ▶
                </button>
              </>
            )}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: canGoNext() ? theme.colors.primary[500] : theme.colors.background.tertiary,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: canGoNext() ? theme.colors.text.inverse : theme.colors.text.disabled,
                cursor: canGoNext() ? 'pointer' : 'not-allowed',
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: theme.colors.primary[500],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.inverse,
                cursor: 'pointer',
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              <Check size={16} />
              Finalize Blueprint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

BlueprintWizard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func
};

export default BlueprintWizard;
