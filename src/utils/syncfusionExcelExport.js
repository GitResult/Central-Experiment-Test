/**
 * Syncfusion Excel Export Utility
 *
 * Uses Syncfusion's ej2-excel-export for native Excel chart generation.
 * This provides more reliable chart rendering than custom XML.
 */

import { Workbook } from '@syncfusion/ej2-excel-export';

/**
 * Export data to Excel with native charts using Syncfusion
 *
 * @param {Object} options - Export options
 * @param {string} options.chartType - 'bar', 'line', or 'pie'
 * @param {string} options.title - Chart title
 * @param {Array} options.categories - Category labels
 * @param {Array} options.series - Data series [{name, values}]
 * @param {string} options.filename - Output filename
 * @param {boolean} options.includeImage - Include chart image sheet
 * @param {string} options.imageData - Base64 image data (optional)
 */
export const exportWithSyncfusion = async (options) => {
  const {
    chartType,
    title,
    categories,
    series,
    filename = 'chart-export',
    includeImage = false,
    imageData = null
  } = options;

  // Create workbook
  const workbook = new Workbook({
    worksheets: []
  }, 'xlsx');

  // Sheet 1: Chart Image (if enabled)
  if (includeImage && imageData) {
    workbook.worksheets.push({
      name: 'Chart Image',
      rows: [
        {
          index: 1,
          cells: [{ index: 1, value: title || 'Chart', style: { bold: true, fontSize: 14 } }]
        }
      ],
      images: [{
        image: imageData.split(',')[1], // Remove data:image/png;base64, prefix
        row: 2,
        column: 1,
        width: 600,
        height: 400
      }]
    });
  }

  // Sheet 2: Chart Data with Native Chart
  const chartDataRows = [];

  // Title row
  chartDataRows.push({
    index: 1,
    cells: [{
      index: 1,
      value: title || (chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : 'Pie Chart'),
      style: { bold: true, fontSize: 14 }
    }]
  });

  // Header row
  if (chartType === 'pie') {
    chartDataRows.push({
      index: 3,
      cells: [
        { index: 1, value: 'Category', style: { bold: true, backColor: '#E8E8E8' } },
        { index: 2, value: 'Value', style: { bold: true, backColor: '#E8E8E8' } }
      ]
    });

    // Data rows
    categories.forEach((cat, idx) => {
      chartDataRows.push({
        index: 4 + idx,
        cells: [
          { index: 1, value: cat },
          { index: 2, value: series[0].values[idx] }
        ]
      });
    });
  } else {
    // Bar/Line chart headers
    const headerCells = [
      { index: 1, value: 'Category', style: { bold: true, backColor: '#E8E8E8' } }
    ];
    series.forEach((s, idx) => {
      headerCells.push({
        index: 2 + idx,
        value: s.name,
        style: { bold: true, backColor: '#E8E8E8' }
      });
    });
    chartDataRows.push({ index: 3, cells: headerCells });

    // Data rows
    categories.forEach((cat, idx) => {
      const rowCells = [{ index: 1, value: cat }];
      series.forEach((s, sIdx) => {
        rowCells.push({ index: 2 + sIdx, value: s.values[idx] });
      });
      chartDataRows.push({ index: 4 + idx, cells: rowCells });
    });
  }

  // Build chart configuration
  const dataRange = chartType === 'pie'
    ? `A3:B${3 + categories.length}`
    : `A3:${String.fromCharCode(65 + series.length)}${3 + categories.length}`;

  // Map chart type to Syncfusion chart type
  const syncfusionChartType = chartType === 'bar' ? 'Column' :
                              chartType === 'line' ? 'Line' : 'Pie';

  const chartSheet = {
    name: 'Chart Data',
    rows: chartDataRows,
    columns: [
      { index: 1, width: 120 },
      { index: 2, width: 80 },
      { index: 3, width: 80 }
    ],
    charts: [{
      name: 'Chart1',
      chartType: syncfusionChartType,
      range: dataRange,
      title: title || (chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : 'Pie Chart'),
      primaryXAxis: {
        title: 'Category'
      },
      primaryYAxis: {
        title: 'Value'
      },
      // Position chart to the right of data
      top: 20,
      left: 250,
      width: 500,
      height: 300,
      legend: {
        position: 'Bottom'
      }
    }]
  };

  workbook.worksheets.push(chartSheet);

  // Sheet 3: Raw Data
  const rawDataRows = [];

  if (chartType === 'pie') {
    // Headers
    rawDataRows.push({
      index: 1,
      cells: [
        { index: 1, value: 'Category', style: { bold: true, backColor: '#E8E8E8' } },
        { index: 2, value: 'Value', style: { bold: true, backColor: '#E8E8E8' } },
        { index: 3, value: 'Percentage', style: { bold: true, backColor: '#E8E8E8' } }
      ]
    });

    const total = series[0].values.reduce((sum, v) => sum + v, 0);
    categories.forEach((cat, idx) => {
      const value = series[0].values[idx];
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
      rawDataRows.push({
        index: 2 + idx,
        cells: [
          { index: 1, value: cat },
          { index: 2, value: value },
          { index: 3, value: `${pct}%` }
        ]
      });
    });

    // Total row
    rawDataRows.push({
      index: 2 + categories.length,
      cells: [
        { index: 1, value: 'TOTAL', style: { bold: true } },
        { index: 2, value: total, style: { bold: true } },
        { index: 3, value: '100%', style: { bold: true } }
      ]
    });
  } else {
    // Headers for bar/line
    const headerCells = [
      { index: 1, value: 'Category', style: { bold: true, backColor: '#E8E8E8' } }
    ];
    series.forEach((s, idx) => {
      headerCells.push({
        index: 2 + idx,
        value: s.name,
        style: { bold: true, backColor: '#E8E8E8' }
      });
    });
    if (series.length === 2) {
      headerCells.push({ index: 4, value: 'Change', style: { bold: true, backColor: '#E8E8E8' } });
      headerCells.push({ index: 5, value: 'Change %', style: { bold: true, backColor: '#E8E8E8' } });
    }
    rawDataRows.push({ index: 1, cells: headerCells });

    // Data rows
    let totals = series.map(() => 0);
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
          : '0';
        rowCells.push({ index: 4, value: change });
        rowCells.push({ index: 5, value: `${changePct}%` });
      }
      rawDataRows.push({ index: 2 + idx, cells: rowCells });
    });

    // Total row
    const totalCells = [{ index: 1, value: 'TOTAL', style: { bold: true } }];
    totals.forEach((t, idx) => {
      totalCells.push({ index: 2 + idx, value: t, style: { bold: true } });
    });
    if (series.length === 2) {
      const totalChange = totals[1] - totals[0];
      const totalChangePct = totals[0] > 0 ? ((totalChange / totals[0]) * 100).toFixed(1) : '0';
      totalCells.push({ index: 4, value: totalChange, style: { bold: true } });
      totalCells.push({ index: 5, value: `${totalChangePct}%`, style: { bold: true } });
    }
    rawDataRows.push({ index: 2 + categories.length, cells: totalCells });
  }

  workbook.worksheets.push({
    name: 'Raw Data',
    rows: rawDataRows,
    columns: [
      { index: 1, width: 100 },
      { index: 2, width: 80 },
      { index: 3, width: 80 },
      { index: 4, width: 80 },
      { index: 5, width: 80 }
    ]
  });

  // Save the workbook
  workbook.save(`${filename}.xlsx`);
};

const syncfusionExcelExport = { exportWithSyncfusion };
export default syncfusionExcelExport;
