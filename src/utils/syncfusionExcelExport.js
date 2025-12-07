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

import { Workbook, Worksheet, Column, Row, Cell, CellStyle } from '@syncfusion/ej2-excel-export';
import { saveAs } from 'file-saver';

/**
 * Export data to Excel using Syncfusion ej2-excel-export
 *
 * @param {Object} options - Export options
 * @param {string} options.chartType - 'bar', 'line', or 'pie'
 * @param {string} options.title - Chart title
 * @param {Array} options.categories - Category labels
 * @param {Array} options.series - Data series [{name, values}]
 * @param {string} options.filename - Output filename
 * @param {boolean} options.includeImage - Include chart image sheet (not supported)
 * @param {string} options.imageData - Base64 image data (not supported in ej2-excel-export)
 */
export const exportWithSyncfusion = async (options) => {
  const {
    chartType,
    title,
    categories,
    series,
    filename = 'chart-export'
  } = options;

  // Create worksheets array
  const worksheets = [];

  // --- Sheet 1: Chart Data ---
  const chartDataSheet = createChartDataSheet(chartType, title, categories, series);
  worksheets.push(chartDataSheet);

  // --- Sheet 2: Raw Data with Analysis ---
  const rawDataSheet = createRawDataSheet(chartType, categories, series);
  worksheets.push(rawDataSheet);

  // Create and save workbook
  const workbook = new Workbook({ worksheets }, 'xlsx');

  try {
    // Use saveAsBlob for better browser compatibility
    const blob = await workbook.saveAsBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    // Fallback to direct save
    console.warn('Blob save failed, trying direct save:', error);
    workbook.save(`${filename}.xlsx`);
  }
};

/**
 * Create chart data worksheet
 */
function createChartDataSheet(chartType, title, categories, series) {
  const rows = [];

  // Row 1: Title
  rows.push({
    index: 1,
    cells: [{
      index: 1,
      value: title || getDefaultTitle(chartType),
      style: { bold: true, fontSize: 16, fontColor: '#1D4ED8' }
    }]
  });

  // Row 2: Empty row for spacing
  rows.push({ index: 2, cells: [] });

  if (chartType === 'pie') {
    // Pie chart: Category | Value
    rows.push({
      index: 3,
      cells: [
        { index: 1, value: 'Category', style: { bold: true, backColor: '#DBEAFE', fontColor: '#1E40AF' } },
        { index: 2, value: 'Value', style: { bold: true, backColor: '#DBEAFE', fontColor: '#1E40AF' } }
      ]
    });

    categories.forEach((cat, idx) => {
      rows.push({
        index: 4 + idx,
        cells: [
          { index: 1, value: cat },
          { index: 2, value: series[0].values[idx] }
        ]
      });
    });
  } else {
    // Bar/Line: Category | Series1 | Series2 | ...
    const headerCells = [
      { index: 1, value: 'Category', style: { bold: true, backColor: '#DBEAFE', fontColor: '#1E40AF' } }
    ];
    series.forEach((s, idx) => {
      headerCells.push({
        index: 2 + idx,
        value: s.name,
        style: { bold: true, backColor: '#DBEAFE', fontColor: '#1E40AF' }
      });
    });
    rows.push({ index: 3, cells: headerCells });

    categories.forEach((cat, idx) => {
      const rowCells = [{ index: 1, value: cat }];
      series.forEach((s, sIdx) => {
        rowCells.push({ index: 2 + sIdx, value: s.values[idx] });
      });
      rows.push({ index: 4 + idx, cells: rowCells });
    });
  }

  // Note about charts
  const noteRowIndex = 4 + categories.length + 2;
  rows.push({
    index: noteRowIndex,
    cells: [{
      index: 1,
      value: 'Note: Select data above and use Insert > Chart in Excel to create a chart',
      style: { italic: true, fontColor: '#6B7280', fontSize: 10 }
    }]
  });

  return {
    name: 'Chart Data',
    rows,
    columns: [
      { index: 1, width: 150 },
      { index: 2, width: 100 },
      { index: 3, width: 100 },
      { index: 4, width: 100 }
    ]
  };
}

/**
 * Create raw data worksheet with analysis
 */
function createRawDataSheet(chartType, categories, series) {
  const rows = [];

  if (chartType === 'pie') {
    // Headers: Category | Value | Percentage
    rows.push({
      index: 1,
      cells: [
        { index: 1, value: 'Category', style: { bold: true, backColor: '#F3F4F6' } },
        { index: 2, value: 'Value', style: { bold: true, backColor: '#F3F4F6' } },
        { index: 3, value: 'Percentage', style: { bold: true, backColor: '#F3F4F6' } }
      ]
    });

    const total = series[0].values.reduce((sum, v) => sum + v, 0);
    categories.forEach((cat, idx) => {
      const value = series[0].values[idx];
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
      rows.push({
        index: 2 + idx,
        cells: [
          { index: 1, value: cat },
          { index: 2, value: value },
          { index: 3, value: `${pct}%` }
        ]
      });
    });

    // Total row
    rows.push({
      index: 2 + categories.length,
      cells: [
        { index: 1, value: 'TOTAL', style: { bold: true, backColor: '#E5E7EB' } },
        { index: 2, value: total, style: { bold: true, backColor: '#E5E7EB' } },
        { index: 3, value: '100.0%', style: { bold: true, backColor: '#E5E7EB' } }
      ]
    });
  } else {
    // Bar/Line: Category | Series values | Change | Change %
    const headerCells = [
      { index: 1, value: 'Category', style: { bold: true, backColor: '#F3F4F6' } }
    ];
    series.forEach((s, idx) => {
      headerCells.push({
        index: 2 + idx,
        value: s.name,
        style: { bold: true, backColor: '#F3F4F6' }
      });
    });
    if (series.length === 2) {
      headerCells.push({ index: 4, value: 'Change', style: { bold: true, backColor: '#F3F4F6' } });
      headerCells.push({ index: 5, value: 'Change %', style: { bold: true, backColor: '#F3F4F6' } });
    }
    rows.push({ index: 1, cells: headerCells });

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
      rows.push({ index: 2 + idx, cells: rowCells });
    });

    // Total row
    const totalCells = [
      { index: 1, value: 'TOTAL', style: { bold: true, backColor: '#E5E7EB' } }
    ];
    totals.forEach((t, idx) => {
      totalCells.push({ index: 2 + idx, value: t, style: { bold: true, backColor: '#E5E7EB' } });
    });
    if (series.length === 2) {
      const totalChange = totals[1] - totals[0];
      const totalChangePct = totals[0] > 0 ? ((totalChange / totals[0]) * 100).toFixed(1) : '0.0';
      totalCells.push({ index: 4, value: totalChange, style: { bold: true, backColor: '#E5E7EB' } });
      totalCells.push({ index: 5, value: `${totalChangePct}%`, style: { bold: true, backColor: '#E5E7EB' } });
    }
    rows.push({ index: 2 + categories.length, cells: totalCells });
  }

  return {
    name: 'Raw Data',
    rows,
    columns: [
      { index: 1, width: 120 },
      { index: 2, width: 100 },
      { index: 3, width: 100 },
      { index: 4, width: 100 },
      { index: 5, width: 100 }
    ]
  };
}

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
