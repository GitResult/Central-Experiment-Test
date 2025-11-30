/**
 * PresenterExport
 * Export dialog for PDF, HTML, and PowerPoint
 */

import PropTypes from 'prop-types';
import { X, FileDown, AlertCircle } from 'lucide-react';
import { theme } from '../../config/theme';

export function PresenterExport({ frontmatter, slides, onClose }) {
  const handleExportPDF = () => {
    // TODO: Implement PDF export using pdfkit
    alert('PDF export not yet implemented. This would generate a PDF with one slide per page.');
  };

  const handleExportHTML = () => {
    // Simple HTML export
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frontmatter.title || 'Presentation'}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .slide { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; page-break-after: always; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
  ${slides.map((slide, i) => `<div class="slide">${slide.html}</div>`).join('\n')}
</body>
</html>
    `.trim();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${frontmatter.title || 'presentation'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPPTX = () => {
    // PowerPoint export not available (html-to-pptx package doesn't exist)
    alert('PowerPoint export is not available in this version. Use PDF or HTML export instead.');
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
        maxWidth: '600px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            Export Presentation
          </h2>
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

        {/* Content */}
        <div style={{ padding: theme.spacing[6] }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[4]
          }}>
            {/* PDF Export */}
            <ExportOption
              title="PDF Export"
              description="Export slides as PDF (one slide per page)"
              onClick={handleExportPDF}
              available={false}
              icon={<FileDown size={20} />}
            />

            {/* HTML Export */}
            <ExportOption
              title="HTML Export"
              description="Export as self-contained HTML file"
              onClick={handleExportHTML}
              available={true}
              icon={<FileDown size={20} />}
            />

            {/* PowerPoint Export */}
            <ExportOption
              title="PowerPoint Export"
              description="Export as .pptx file"
              onClick={handleExportPPTX}
              available={false}
              icon={<FileDown size={20} />}
            />
          </div>

          {/* Info */}
          <div style={{
            marginTop: theme.spacing[6],
            padding: theme.spacing[4],
            backgroundColor: theme.colors.primary[50],
            borderRadius: theme.borderRadius.md,
            display: 'flex',
            gap: theme.spacing[3]
          }}>
            <AlertCircle size={20} color={theme.colors.primary[600]} style={{ flexShrink: 0 }} />
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.primary[700],
              lineHeight: '1.5'
            }}>
              <strong>Note:</strong> PDF and PowerPoint exports are coming soon. HTML export is currently available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportOption({ title, description, onClick, available, icon }) {
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[4],
        padding: theme.spacing[4],
        backgroundColor: available ? theme.colors.background.secondary : theme.colors.background.tertiary,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available ? 1 : 0.6,
        transition: `all ${theme.transitions.fast}`,
        textAlign: 'left',
        width: '100%'
      }}
      onMouseEnter={(e) => {
        if (available) {
          e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
          e.currentTarget.style.borderColor = theme.colors.primary[500];
        }
      }}
      onMouseLeave={(e) => {
        if (available) {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          e.currentTarget.style.borderColor = theme.colors.border.default;
        }
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: theme.borderRadius.md,
        backgroundColor: available ? theme.colors.primary[100] : theme.colors.background.tertiary,
        color: available ? theme.colors.primary[600] : theme.colors.text.disabled,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.semibold,
          color: available ? theme.colors.text.primary : theme.colors.text.disabled,
          marginBottom: theme.spacing[1]
        }}>
          {title}
          {!available && (
            <span style={{
              marginLeft: theme.spacing[2],
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.warning[600],
              fontWeight: theme.typography.fontWeight.normal
            }}>
              (Coming Soon)
            </span>
          )}
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          color: available ? theme.colors.text.secondary : theme.colors.text.disabled
        }}>
          {description}
        </div>
      </div>
    </button>
  );
}

PresenterExport.propTypes = {
  frontmatter: PropTypes.object.isRequired,
  slides: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

ExportOption.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  available: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired
};

export default PresenterExport;
