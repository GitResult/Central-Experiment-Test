/**
 * PageRenderer Component
 * Recursively renders page zones, rows, columns, and elements
 * Supports comprehensive element library
 */

import PropTypes from 'prop-types';
import { theme } from '../config/theme';
import { ElementWrapper } from './editor/ElementWrapper';

// Import all element components
import { MarkupElement } from './elements/markup/MarkupElement';
import { FieldElement } from './elements/field/FieldElement';
import { RecordElement } from './elements/record/RecordElement';
import { StructureElement } from './elements/structure/StructureElement';
import { Icon } from './elements/Icon';
import { Avatar } from './elements/Avatar';
import { Badge } from './elements/Badge';
import { Card } from './elements/Card';
import { KPICard } from './elements/KPICard';
import { Timeline } from './elements/Timeline';
import { Tabs } from './elements/Tabs';
import { Breadcrumb } from './elements/Breadcrumb';
import { Hero } from './elements/Hero';
import { DataTable } from './elements/DataTable';
import { Chart } from './elements/Chart';

export function PageRenderer({ pageData, isEditMode = false }) {
  const { zones } = pageData;

  const renderElement = (element, index, depth = 0) => {
    // Prevent infinite nesting
    if (depth > 5) {
      console.warn('Max nesting depth (5) exceeded');
      return null;
    }

    const key = element.id || `element-${index}`;
    const commonProps = {
      data: element.data || {},
      settings: element.settings || {}
    };

    // Elements that support nested rendering
    const nestableProps = element.elements
      ? {
          elements: element.elements,
          renderElement: (el, idx) => renderElement(el, idx, depth + 1)
        }
      : {};

    switch (element.type) {
      // Original elements
      case 'markup':
        return <MarkupElement key={key} {...commonProps} />;

      case 'field':
        return <FieldElement key={key} {...commonProps} />;

      case 'structure':
        return <StructureElement key={key} {...commonProps} {...nestableProps} />;

      // New comprehensive elements
      case 'icon':
        return <Icon key={key} {...commonProps} />;

      case 'avatar':
        return <Avatar key={key} {...commonProps} />;

      case 'badge':
        return <Badge key={key} {...commonProps} />;

      case 'card':
        return <Card key={key} {...commonProps} {...nestableProps} />;

      case 'kpi':
      case 'kpi-card':
        return <KPICard key={key} {...commonProps} />;

      case 'timeline':
        return <Timeline key={key} {...commonProps} />;

      case 'tabs':
        return <Tabs key={key} {...commonProps} {...nestableProps} />;

      case 'breadcrumb':
        return <Breadcrumb key={key} {...commonProps} />;

      case 'hero':
        return <Hero key={key} {...commonProps} {...nestableProps} />;

      case 'table':
      case 'data-table':
        return <DataTable key={key} {...commonProps} />;

      case 'chart':
        return <Chart key={key} {...commonProps} />;

      // Record element
      case 'record':
        return <RecordElement key={key} {...commonProps} />;

      default:
        console.warn(`Unknown element type: ${element.type}`);
        return (
          <div
            key={key}
            style={{
              padding: theme.spacing[4],
              background: theme.colors.error[50],
              border: `1px solid ${theme.colors.error[200]}`,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing[4],
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.error[700]
            }}
          >
            Unknown element type: {element.type}
          </div>
        );
    }
  };

  const renderColumn = (column, columnIndex, totalColumns, zoneId, rowIndex) => {
    const widthMap = {
      'full': '100%',
      '1/2': '50%',
      '1/3': '33.333%',
      '2/3': '66.666%',
      '1/4': '25%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%'
    };

    // Determine if column should be fluid or fixed width
    const isFluid = column.fluid === true || column.width === 'fluid';

    // Determine the width value
    let widthValue;
    if (isFluid) {
      widthValue = null; // Will use flex: 1
    } else if (typeof column.width === 'number') {
      // Numeric width (percentage)
      widthValue = `${column.width}%`;
    } else if (column.width && widthMap[column.width]) {
      // String width from map (like '1/5', 'full')
      widthValue = widthMap[column.width];
    } else {
      // Default: distribute evenly among columns
      widthValue = `${100 / totalColumns}%`;
    }

    const columnStyle = {
      // If fluid, use flex: 1 to fill remaining space
      // If fixed width specified, use flex: 0 0 <width>
      // Otherwise, distribute evenly
      flex: isFluid ? '1' : `0 0 ${widthValue}`,
      minWidth: isFluid ? '0' : undefined,
      ...(column.padding && {
        padding: theme.spacing[column.padding] || theme.spacing[4]
      })
    };

    return (
      <div
        key={column.id || `column-${columnIndex}`}
        style={columnStyle}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          {column.elements?.map((element, elementIndex) => {
            const elementContent = renderElement(element, elementIndex);

            // Wrap with ElementWrapper in edit mode
            if (isEditMode) {
              const elementPath = {
                zoneId,
                rowIndex,
                columnIndex,
                elementIndex
              };
              return (
                <ElementWrapper key={element.id || `element-${elementIndex}`} elementPath={elementPath}>
                  {elementContent}
                </ElementWrapper>
              );
            }

            return elementContent;
          })}
        </div>
      </div>
    );
  };

  const renderRow = (row, rowIndex, zoneId) => {
    const rowStyle = {
      display: 'flex',
      flexWrap: row.wrap !== false ? 'wrap' : 'nowrap',
      gap: theme.spacing[row.gap || 4],
      marginBottom: theme.spacing[row.marginBottom || 6],
      ...(row.align && {
        alignItems: row.align
      }),
      ...(row.justify && {
        justifyContent: row.justify
      })
    };

    return (
      <div
        key={row.id || `row-${rowIndex}`}
        style={rowStyle}
      >
        {row.columns?.map((column, columnIndex) =>
          renderColumn(column, columnIndex, row.columns.length, zoneId, rowIndex)
        )}
      </div>
    );
  };

  const renderZone = (zone, zoneIndex) => {
    const zoneStyle = {
      ...(zone.padding && {
        padding: theme.spacing[zone.padding] || theme.spacing[6]
      }),
      ...(zone.background && {
        backgroundColor: zone.background
      }),
      ...(zone.maxWidth && {
        maxWidth: theme.layout.maxWidth[zone.maxWidth] || zone.maxWidth,
        marginLeft: 'auto',
        marginRight: 'auto'
      })
    };

    return (
      <div
        key={zone.id || `zone-${zoneIndex}`}
        style={zoneStyle}
      >
        {zone.rows?.map((row, rowIndex) =>
          renderRow(row, rowIndex, zone.id)
        )}
      </div>
    );
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary
  };

  return (
    <div style={containerStyle}>
      {zones?.map((zone, zoneIndex) =>
        renderZone(zone, zoneIndex)
      )}
    </div>
  );
}

PageRenderer.propTypes = {
  pageData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    zones: PropTypes.array.isRequired
  }).isRequired,
  isEditMode: PropTypes.bool
};
