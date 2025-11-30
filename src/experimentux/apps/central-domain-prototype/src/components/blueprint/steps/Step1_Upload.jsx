/**
 * Step 1: CSV Upload
 * Drag-and-drop file upload for CSV
 */

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { theme } from '../../../config/theme';

export function Step1_Upload({ onUpload, isProcessing, error }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(f => f.name.endsWith('.csv'));

    if (csvFile) {
      onUpload(csvFile);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  }, [onUpload]);

  return (
    <div style={{ padding: theme.spacing[6] }}>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        marginBottom: theme.spacing[2],
        color: theme.colors.text.primary
      }}>
        Upload CSV File
      </h2>
      <p style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing[6]
      }}>
        Upload a CSV file to automatically generate your application pages
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? theme.colors.primary[500] : theme.colors.border.default}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[12],
          textAlign: 'center',
          backgroundColor: isDragging ? theme.colors.primary[50] : theme.colors.background.secondary,
          cursor: 'pointer',
          transition: `all ${theme.transitions.base}`
        }}
        onClick={() => document.getElementById('csv-file-input').click()}
      >
        <Upload
          size={48}
          color={isDragging ? theme.colors.primary[500] : theme.colors.text.tertiary}
          style={{ marginBottom: theme.spacing[4] }}
        />
        <p style={{
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing[2]
        }}>
          {isProcessing ? 'Processing...' : 'Drag and drop your CSV file here'}
        </p>
        <p style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.tertiary
        }}>
          or click to browse
        </p>
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div style={{
          marginTop: theme.spacing[4],
          padding: theme.spacing[3],
          backgroundColor: theme.colors.error[50],
          borderRadius: theme.borderRadius.md,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2]
        }}>
          <AlertCircle size={20} color={theme.colors.error[600]} />
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.error[700]
          }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

Step1_Upload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
  error: PropTypes.string
};

export default Step1_Upload;
