/**
 * Syncfusion Excel Export Utility
 *
 * Uses Syncfusion's ej2-excel-export for Excel file generation.
 *
 * NOTE: @syncfusion/ej2-excel-export does NOT support native Excel chart creation.
 * Native charts require Syncfusion's XlsIO library (.NET).
 * This implementation exports formatted data tables only.
 * For native Excel charts, use the custom XML approach (excelChartUtils.js).
 */

import { Workbook } from '@syncfusion/ej2-excel-export';
import { saveAs } from 'file-saver';

/**
 * Export data to Excel using Syncfusion ej2-excel-export
 */
export const exportWithSyncfusion = async (options) => {
  const {
    chartType,
    title,
    categories,
    series,
    filename = 'chart-export'
  } = options;

  // Build rows for single worksheet with all data
  const rows = [];
  let rowIndex = 1;

  // Title row
  rows.push({
    index: rowIndex++,
    cells: [{
      index: 1,
      value: title || getDefaultTitle(chartType),
      style: { bold: true, fontSize: 14, fontColor: '#1D4ED8' }
    }]
  });

  // Empty row
  rowIndex++;

  // Build data based on chart type
  if (chartType === 'pie') {
    // Header row
    rows.push({
      index: rowIndex++,
      cells: [
        { index: 1, value: 'Category', style: { bold: true, backColor: '#E5E7EB' } },
        { index: 2, value: 'Value', style: { bold: true, backColor: '#E5E7EB' } },
        { index: 3, value: 'Percentage', style: { bold: true, backColor: '#E5E7EB' } }
      ]
    });

    // Calculate total for percentages
    const total = series[0].values.reduce((sum, v) => sum + v, 0);

    // Data rows
    categories.forEach((cat, idx) => {
      const value = series[0].values[idx];
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
      rows.push({
        index: rowIndex++,
        cells: [
          { index: 1, value: cat },
          { index: 2, value: value },
          { index: 3, value: `${pct}%` }
        ]
      });
    });

    // Total row
    rows.push({
      index: rowIndex++,
      cells: [
        { index: 1, value: 'TOTAL', style: { bold: true } },
        { index: 2, value: total, style: { bold: true } },
        { index: 3, value: '100%', style: { bold: true } }
      ]
    });
  } else {
    // Bar/Line chart
    // Header row
    const headerCells = [
      { index: 1, value: 'Category', style: { bold: true, backColor: '#E5E7EB' } }
    ];
    series.forEach((s, idx) => {
      headerCells.push({
        index: 2 + idx,
        value: s.name,
        style: { bold: true, backColor: '#E5E7EB' }
      });
    });
    // Add change columns if 2 series
    if (series.length === 2) {
      headerCells.push({ index: 4, value: 'Change', style: { bold: true, backColor: '#E5E7EB' } });
      headerCells.push({ index: 5, value: 'Change %', style: { bold: true, backColor: '#E5E7EB' } });
    }
    rows.push({ index: rowIndex++, cells: headerCells });

    // Data rows
    const totals = series.map(() => 0);
    categories.forEach((cat, idx) => {
      const rowCells = [{ index: 1, value: cat }];
      series.forEach((s, sIdx) => {
        rowCells.push({ index: 2 + sIdx, value: s.values[idx] });
        totals[sIdx] += s.values[idx];
      });
      if (series.length === 2) {
        const change = series[1].values[idx] - series[0].values[idx];
        const changePct = series[0].values[idx] > 0
          ? ((change / series[0].values[idx]) * 100).toFixed(1)
          : '0.0';
        rowCells.push({ index: 4, value: change });
        rowCells.push({ index: 5, value: `${changePct}%` });
      }
      rows.push({ index: rowIndex++, cells: rowCells });
    });

    // Total row
    const totalCells = [{ index: 1, value: 'TOTAL', style: { bold: true } }];
    totals.forEach((t, idx) => {
      totalCells.push({ index: 2 + idx, value: t, style: { bold: true } });
    });
    if (series.length === 2) {
      const totalChange = totals[1] - totals[0];
      const totalChangePct = totals[0] > 0 ? ((totalChange / totals[0]) * 100).toFixed(1) : '0.0';
      totalCells.push({ index: 4, value: totalChange, style: { bold: true } });
      totalCells.push({ index: 5, value: `${totalChangePct}%`, style: { bold: true } });
    }
    rows.push({ index: rowIndex++, cells: totalCells });
  }

  // Add note about creating charts
  rowIndex += 2;
  rows.push({
    index: rowIndex,
    cells: [{
      index: 1,
      value: 'Tip: Select data and use Insert > Chart in Excel to create a chart',
      style: { italic: true, fontColor: '#6B7280' }
    }]
  });

  // Create workbook with single worksheet
  const workbook = new Workbook({
    worksheets: [{
      name: 'Data',
      rows: rows
    }]
  }, 'xlsx');

  // Save the file
  const blob = await workbook.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  saveAs(blob, `${filename}.xlsx`);
};

/**
 * Get default title based on chart type
 */
function getDefaultTitle(chartType) {
  switch (chartType) {
    case 'bar': return 'Bar Chart Data';
    case 'line': return 'Line Chart Data';
    case 'pie': return 'Pie Chart Data';
    default: return 'Chart Data';
  }
}

const syncfusionExcelExport = { exportWithSyncfusion };
export default syncfusionExcelExport;
