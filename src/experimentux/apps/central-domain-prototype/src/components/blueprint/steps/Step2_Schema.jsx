/**
 * Step 2: Schema Review
 * Review and edit detected schema
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function Step2_Schema({ schema, entityName, onSchemaChange, onEntityNameChange }) {
  if (!schema || !schema.fields) {
    return <div>No schema available</div>;
  }

  const handleFieldChange = (index, field, value) => {
    const newFields = [...schema.fields];
    newFields[index] = { ...newFields[index], [field]: value };
    onSchemaChange({ ...schema, fields: newFields });
  };

  return (
    <div style={{ padding: theme.spacing[6] }}>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        marginBottom: theme.spacing[2],
        color: theme.colors.text.primary
      }}>
        Review Schema
      </h2>
      <p style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing[6]
      }}>
        Review the detected schema and make any necessary adjustments
      </p>

      <div style={{ marginBottom: theme.spacing[6] }}>
        <label style={{
          display: 'block',
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          marginBottom: theme.spacing[2],
          color: theme.colors.text.primary
        }}>
          Entity Name (Singular)
        </label>
        <input
          type="text"
          value={entityName}
          onChange={(e) => onEntityNameChange(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            height: theme.components.input.height.md,
            padding: theme.components.input.padding.md,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary
          }}
        />
      </div>

      <div style={{
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: theme.colors.background.tertiary }}>
              <th style={headerCellStyle}>Field Name</th>
              <th style={headerCellStyle}>Type</th>
              <th style={headerCellStyle}>Required</th>
              <th style={headerCellStyle}>Unique</th>
            </tr>
          </thead>
          <tbody>
            {schema.fields.map((field, index) => (
              <tr key={index} style={{
                borderBottom: `1px solid ${theme.colors.border.subtle}`
              }}>
                <td style={cellStyle}>{field.name}</td>
                <td style={cellStyle}>
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="integer">Integer</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="url">URL</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                  </select>
                </td>
                <td style={cellStyle}>
                  <input
                    type="checkbox"
                    checked={!field.nullable}
                    onChange={(e) => handleFieldChange(index, 'nullable', !e.target.checked)}
                    style={{ accentColor: theme.colors.primary[500] }}
                  />
                </td>
                <td style={cellStyle}>
                  <input
                    type="checkbox"
                    checked={field.unique || false}
                    onChange={(e) => handleFieldChange(index, 'unique', e.target.checked)}
                    style={{ accentColor: theme.colors.primary[500] }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: theme.spacing[4],
        padding: theme.spacing[3],
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary
      }}>
        <strong>Detected:</strong> {schema.fields.length} fields from {schema.rowCount} rows
      </div>
    </div>
  );
}

const headerCellStyle = {
  padding: theme.spacing[3],
  textAlign: 'left',
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.text.primary
};

const cellStyle = {
  padding: theme.spacing[3],
  fontSize: theme.typography.fontSize.sm,
  color: theme.colors.text.primary
};

const selectStyle = {
  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sm,
  fontSize: theme.typography.fontSize.sm,
  backgroundColor: theme.colors.background.primary,
  color: theme.colors.text.primary
};

Step2_Schema.propTypes = {
  schema: PropTypes.object.isRequired,
  entityName: PropTypes.string.isRequired,
  onSchemaChange: PropTypes.func.isRequired,
  onEntityNameChange: PropTypes.func.isRequired
};

export default Step2_Schema;
