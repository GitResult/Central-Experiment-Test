/**
 * RecordElement Component
 * Base component for all record type elements
 * Type: record (data domain - persisted to database)
 * Reference: GENERIC_ELEMENT_TYPES.md § 2. Record Element
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';
import { RecordImage } from './RecordImage';
import { RecordGrid } from './RecordGrid';
import { RecordAssociationList } from './RecordAssociationList';
import { RecordDataGrid } from './RecordDataGrid';

export const RecordElement = ({ data, settings }) => {
  const { resolveAllTokens, theme } = useTheme();
  const resolvedSettings = resolveAllTokens(settings);

  const recordType = settings?.record?.recordType || 'image';

  // Render based on recordType
  switch (recordType) {
    case 'image':
      return <RecordImage data={data} settings={settings} />;

    case 'grid':
      return <RecordGrid data={data} settings={settings} />;

    case 'association-list':
    case 'associationList':
      return <RecordAssociationList data={data} settings={settings} />;

    case 'data-grid':
    case 'dataGrid':
    case 'table':
      return <RecordDataGrid data={data} settings={settings} />;

    default:
      return (
        <div
          style={{
            padding: theme.spacing[4],
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            color: theme.colors.text.secondary
          }}
        >
          <div style={{ fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing[2] }}>
            Record Element: {recordType}
          </div>
          <pre
            style={{
              fontSize: theme.typography.fontSize.xs,
              marginTop: theme.spacing[2],
              color: theme.colors.text.tertiary,
              overflow: 'auto'
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
};

RecordElement.propTypes = {
  data: PropTypes.object,
  settings: PropTypes.shape({
    record: PropTypes.shape({
      recordType: PropTypes.string.isRequired
    })
  })
};

export default RecordElement;
