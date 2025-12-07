/**
 * Chart Export Studio
 *
 * A prototype for exploring chart export to Excel functionality.
 * Allows users to create, customize, and export charts to Excel with:
 * - Native Excel charts
 * - Chart images embedded in Excel
 * - Raw data tables
 *
 * Features Apple-inspired UI design patterns.
 *
 * @component
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ArrowLeft, Download, FileSpreadsheet, Image, Table2,
  Plus, Minus, RotateCcw, Check, Loader2, Sun, Moon,
  BarChart3, PieChart as PieChartIcon, HelpCircle, Settings
} from 'lucide-react';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Sample data for charts
const initialBarData = [
  { category: 'Q1', value2024: 4200, value2025: 5100 },
  { category: 'Q2', value2024: 3800, value2025: 4600 },
  { category: 'Q3', value2024: 5100, value2025: 5800 },
  { category: 'Q4', value2024: 4700, value2025: 6200 },
];

const initialPieData = [
  { name: 'Product A', value: 35 },
  { name: 'Product B', value: 28 },
  { name: 'Product C', value: 22 },
  { name: 'Product D', value: 15 },
];

// Color palette
const CHART_COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6'];
const CHART_COLORS_DARK = ['#0A84FF', '#30D158', '#FF9F0A', '#FF453A', '#BF5AF2', '#5E5CE6'];

const ChartExportStudio = () => {
  // State
  const [chartType, setChartType] = useState('bar');
  const [barData, setBarData] = useState(initialBarData);
  const [pieData, setPieData] = useState(initialPieData);
  const [darkMode, setDarkMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');
  const [includeChartImage, setIncludeChartImage] = useState(true);
  const [includeNativeChart, setIncludeNativeChart] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(true);
  const [filename, setFilename] = useState('chart-export');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Refs
  const chartRef = useRef(null);

  // Get colors based on theme
  const colors = darkMode ? CHART_COLORS_DARK : CHART_COLORS;

  // Handle cell edit
  const handleCellEdit = useCallback((rowIndex, field, value) => {
    if (chartType === 'bar') {
      const newData = [...barData];
      if (field === 'category') {
        newData[rowIndex].category = value;
      } else {
        newData[rowIndex][field] = parseFloat(value) || 0;
      }
      setBarData(newData);
    } else {
      const newData = [...pieData];
      if (field === 'name') {
        newData[rowIndex].name = value;
      } else {
        newData[rowIndex].value = parseFloat(value) || 0;
      }
      setPieData(newData);
    }
  }, [chartType, barData, pieData]);

  // Add row
  const addRow = useCallback(() => {
    if (chartType === 'bar') {
      setBarData([...barData, { category: `Q${barData.length + 1}`, value2024: 0, value2025: 0 }]);
    } else {
      setPieData([...pieData, { name: `Item ${pieData.length + 1}`, value: 0 }]);
    }
  }, [chartType, barData, pieData]);

  // Remove row
  const removeRow = useCallback((index) => {
    if (chartType === 'bar' && barData.length > 1) {
      setBarData(barData.filter((_, i) => i !== index));
    } else if (chartType === 'pie' && pieData.length > 1) {
      setPieData(pieData.filter((_, i) => i !== index));
    }
  }, [chartType, barData, pieData]);

  // Reset data
  const resetData = useCallback(() => {
    setBarData(initialBarData);
    setPieData(initialPieData);
  }, []);

  // Capture chart as image
  const captureChartImage = async () => {
    if (!chartRef.current) return null;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: darkMode ? '#1c1c1e' : '#ffffff',
      scale: 2,
      logging: false,
    });

    return canvas.toDataURL('image/png');
  };

  // Export to Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Chart Export Studio';
      workbook.created = new Date();

      // Sheet 1: Chart Image
      if (includeChartImage) {
        const imageSheet = workbook.addWorksheet('Chart Image');
        const imageData = await captureChartImage();

        if (imageData) {
          const imageId = workbook.addImage({
            base64: imageData.split(',')[1],
            extension: 'png',
          });

          imageSheet.addImage(imageId, {
            tl: { col: 1, row: 1 },
            ext: { width: 600, height: 400 }
          });
        }

        // Add title
        imageSheet.getCell('B1').value = `${chartType === 'bar' ? 'Bar' : 'Pie'} Chart - Exported from Chart Export Studio`;
        imageSheet.getCell('B1').font = { bold: true, size: 14 };
      }

      // Sheet 2: Native Excel Chart
      if (includeNativeChart) {
        const chartSheet = workbook.addWorksheet('Native Chart');

        if (chartType === 'bar') {
          // Add headers
          chartSheet.getCell('A1').value = 'Category';
          chartSheet.getCell('B1').value = '2024';
          chartSheet.getCell('C1').value = '2025';
          chartSheet.getRow(1).font = { bold: true };

          // Add data
          barData.forEach((row, index) => {
            chartSheet.getCell(`A${index + 2}`).value = row.category;
            chartSheet.getCell(`B${index + 2}`).value = row.value2024;
            chartSheet.getCell(`C${index + 2}`).value = row.value2025;
          });

          // Add chart
          chartSheet.addImage(workbook.addImage({
            base64: await captureChartImage().then(d => d?.split(',')[1]),
            extension: 'png',
          }), {
            tl: { col: 5, row: 1 },
            ext: { width: 500, height: 300 }
          });

        } else {
          // Pie chart data
          chartSheet.getCell('A1').value = 'Category';
          chartSheet.getCell('B1').value = 'Value';
          chartSheet.getRow(1).font = { bold: true };

          pieData.forEach((row, index) => {
            chartSheet.getCell(`A${index + 2}`).value = row.name;
            chartSheet.getCell(`B${index + 2}`).value = row.value;
          });

          // Add chart image
          chartSheet.addImage(workbook.addImage({
            base64: await captureChartImage().then(d => d?.split(',')[1]),
            extension: 'png',
          }), {
            tl: { col: 4, row: 1 },
            ext: { width: 400, height: 400 }
          });
        }

        // Style columns
        chartSheet.columns.forEach(col => {
          col.width = 15;
        });
      }

      // Sheet 3: Raw Data
      if (includeRawData) {
        const dataSheet = workbook.addWorksheet('Raw Data');

        if (chartType === 'bar') {
          dataSheet.columns = [
            { header: 'Category', key: 'category', width: 15 },
            { header: '2024 Value', key: 'value2024', width: 15 },
            { header: '2025 Value', key: 'value2025', width: 15 },
            { header: 'Change', key: 'change', width: 15 },
            { header: 'Change %', key: 'changePct', width: 15 },
          ];

          barData.forEach(row => {
            const change = row.value2025 - row.value2024;
            const changePct = ((change / row.value2024) * 100).toFixed(1);
            dataSheet.addRow({
              category: row.category,
              value2024: row.value2024,
              value2025: row.value2025,
              change: change,
              changePct: `${changePct}%`
            });
          });

          // Add total row
          const total2024 = barData.reduce((sum, r) => sum + r.value2024, 0);
          const total2025 = barData.reduce((sum, r) => sum + r.value2025, 0);
          dataSheet.addRow({
            category: 'TOTAL',
            value2024: total2024,
            value2025: total2025,
            change: total2025 - total2024,
            changePct: `${(((total2025 - total2024) / total2024) * 100).toFixed(1)}%`
          });
          dataSheet.lastRow.font = { bold: true };

        } else {
          dataSheet.columns = [
            { header: 'Category', key: 'name', width: 20 },
            { header: 'Value', key: 'value', width: 15 },
            { header: 'Percentage', key: 'percentage', width: 15 },
          ];

          const total = pieData.reduce((sum, r) => sum + r.value, 0);
          pieData.forEach(row => {
            dataSheet.addRow({
              name: row.name,
              value: row.value,
              percentage: `${((row.value / total) * 100).toFixed(1)}%`
            });
          });

          // Add total row
          dataSheet.addRow({
            name: 'TOTAL',
            value: total,
            percentage: '100%'
          });
          dataSheet.lastRow.font = { bold: true };
        }

        // Style header row
        dataSheet.getRow(1).font = { bold: true };
        dataSheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8E8E8' }
        };
      }

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}.xlsx`);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as image only
  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const imageData = await captureChartImage();
      if (imageData) {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = imageData;
        link.click();
      }
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle export
  const handleExport = () => {
    if (exportFormat === 'excel') {
      exportToExcel();
    } else {
      exportAsImage();
    }
  };

  // Navigate back
  const handleBack = () => {
    window.location.reload();
  };

  // Styles
  const bgColor = darkMode ? 'bg-[#1c1c1e]' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-[#2c2c2e]' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-[#3a3a3c]' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-100'} transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 ${textColor}`} />
              </button>
              <div>
                <h1 className={`text-xl font-semibold ${textColor}`}>Chart Export Studio</h1>
                <p className={`text-sm ${textSecondary}`}>Create and export charts to Excel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-100'} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button className={`p-2 rounded-xl ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-100'} transition-colors`}>
                <HelpCircle className={`w-5 h-5 ${textSecondary}`} />
              </button>
              <button className={`p-2 rounded-xl ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-100'} transition-colors`}>
                <Settings className={`w-5 h-5 ${textSecondary}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart Preview & Data Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Type Selector */}
            <div className={`${cardBg} rounded-2xl p-1.5 shadow-sm border ${borderColor} inline-flex`}>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  chartType === 'bar'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : `${textSecondary} hover:${darkMode ? 'bg-[#3a3a3c]' : 'bg-gray-100'}`
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  chartType === 'pie'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : `${textSecondary} hover:${darkMode ? 'bg-[#3a3a3c]' : 'bg-gray-100'}`
                }`}
              >
                <PieChartIcon className="w-4 h-4" />
                Pie Chart
              </button>
            </div>

            {/* Chart Preview */}
            <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Chart Preview</h2>
              <div
                ref={chartRef}
                className={`${darkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4`}
                style={{ minHeight: 400 }}
              >
                <ResponsiveContainer width="100%" height={380}>
                  {chartType === 'bar' ? (
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3a3a3c' : '#e5e7eb'} />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: darkMode ? '#9ca3af' : '#374151', fontSize: 12 }}
                        axisLine={{ stroke: darkMode ? '#3a3a3c' : '#e5e7eb' }}
                      />
                      <YAxis
                        tick={{ fill: darkMode ? '#9ca3af' : '#374151', fontSize: 12 }}
                        axisLine={{ stroke: darkMode ? '#3a3a3c' : '#e5e7eb' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#2c2c2e' : '#fff',
                          border: `1px solid ${darkMode ? '#3a3a3c' : '#e5e7eb'}`,
                          borderRadius: 12,
                          color: darkMode ? '#fff' : '#1f2937'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value2024" name="2024" fill={colors[0]} radius={[6, 6, 0, 0]} />
                      <Bar dataKey="value2025" name="2025" fill={colors[1]} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        innerRadius={60}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: darkMode ? '#9ca3af' : '#374151' }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#2c2c2e' : '#fff',
                          border: `1px solid ${darkMode ? '#3a3a3c' : '#e5e7eb'}`,
                          borderRadius: 12,
                          color: darkMode ? '#fff' : '#1f2937'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Table */}
            <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${textColor}`}>Data Table</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addRow}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      darkMode ? 'bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                  <button
                    onClick={resetData}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      darkMode ? 'bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      {chartType === 'bar' ? (
                        <>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm`}>Category</th>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm`}>2024 Value</th>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm`}>2025 Value</th>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm w-16`}></th>
                        </>
                      ) : (
                        <>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm`}>Name</th>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm`}>Value</th>
                          <th className={`text-left py-3 px-4 font-medium ${textSecondary} text-sm w-16`}></th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {chartType === 'bar' ? (
                      barData.map((row, index) => (
                        <tr key={index} className={`border-b ${borderColor} last:border-b-0`}>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={row.category}
                              onChange={(e) => handleCellEdit(index, 'category', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={row.value2024}
                              onChange={(e) => handleCellEdit(index, 'value2024', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={row.value2025}
                              onChange={(e) => handleCellEdit(index, 'value2025', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => removeRow(index)}
                              disabled={barData.length <= 1}
                              className={`p-2 rounded-lg ${
                                barData.length <= 1
                                  ? 'opacity-30 cursor-not-allowed'
                                  : darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                              } transition-colors`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      pieData.map((row, index) => (
                        <tr key={index} className={`border-b ${borderColor} last:border-b-0`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              />
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => handleCellEdit(index, 'name', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={row.value}
                              onChange={(e) => handleCellEdit(index, 'value', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => removeRow(index)}
                              disabled={pieData.length <= 1}
                              className={`p-2 rounded-lg ${
                                pieData.length <= 1
                                  ? 'opacity-30 cursor-not-allowed'
                                  : darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                              } transition-colors`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Export Options */}
          <div className="space-y-6">
            {/* Export Format */}
            <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Export Format</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  exportFormat === 'excel'
                    ? 'border-blue-500 bg-blue-500/10'
                    : `${borderColor} ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-50'}`
                }`}>
                  <input
                    type="radio"
                    name="format"
                    value="excel"
                    checked={exportFormat === 'excel'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === 'excel' ? 'border-blue-500' : borderColor
                  }`}>
                    {exportFormat === 'excel' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <FileSpreadsheet className={`w-5 h-5 ${exportFormat === 'excel' ? 'text-blue-500' : textSecondary}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${textColor}`}>Excel (.xlsx)</div>
                    <div className={`text-sm ${textSecondary}`}>Multi-sheet workbook</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  exportFormat === 'image'
                    ? 'border-blue-500 bg-blue-500/10'
                    : `${borderColor} ${darkMode ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-50'}`
                }`}>
                  <input
                    type="radio"
                    name="format"
                    value="image"
                    checked={exportFormat === 'image'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === 'image' ? 'border-blue-500' : borderColor
                  }`}>
                    {exportFormat === 'image' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <Image className={`w-5 h-5 ${exportFormat === 'image' ? 'text-blue-500' : textSecondary}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${textColor}`}>Image (.png)</div>
                    <div className={`text-sm ${textSecondary}`}>High-resolution chart</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Include Options (Excel only) */}
            {exportFormat === 'excel' && (
              <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
                <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Include in Export</h2>
                <div className="space-y-4">
                  {/* Chart Image Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image className={`w-5 h-5 ${textSecondary}`} />
                      <div>
                        <div className={`font-medium ${textColor}`}>Chart Image</div>
                        <div className={`text-sm ${textSecondary}`}>Exact visual copy</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeChartImage(!includeChartImage)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        includeChartImage ? 'bg-blue-500' : darkMode ? 'bg-[#3a3a3c]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        includeChartImage ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Native Chart Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className={`w-5 h-5 ${textSecondary}`} />
                      <div>
                        <div className={`font-medium ${textColor}`}>Native Excel Chart</div>
                        <div className={`text-sm ${textSecondary}`}>Editable in Excel</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeNativeChart(!includeNativeChart)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        includeNativeChart ? 'bg-blue-500' : darkMode ? 'bg-[#3a3a3c]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        includeNativeChart ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Raw Data Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Table2 className={`w-5 h-5 ${textSecondary}`} />
                      <div>
                        <div className={`font-medium ${textColor}`}>Raw Data Table</div>
                        <div className={`text-sm ${textSecondary}`}>With calculations</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeRawData(!includeRawData)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        includeRawData ? 'bg-blue-500' : darkMode ? 'bg-[#3a3a3c]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        includeRawData ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filename */}
            <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Filename</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${cardBg} ${textColor} text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="Enter filename"
                />
                <span className={`${textSecondary} text-sm`}>.{exportFormat === 'excel' ? 'xlsx' : 'png'}</span>
              </div>
            </div>

            {/* Export Preview */}
            {exportFormat === 'excel' && (
              <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
                <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Export Preview</h2>
                <div className="flex gap-2 flex-wrap">
                  {includeChartImage && (
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                      Sheet 1: Chart Image
                    </div>
                  )}
                  {includeNativeChart && (
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      Sheet 2: Native Chart
                    </div>
                  )}
                  {includeRawData && (
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                      Sheet 3: Raw Data
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || (!includeChartImage && !includeNativeChart && !includeRawData && exportFormat === 'excel')}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all ${
                isExporting || (!includeChartImage && !includeNativeChart && !includeRawData && exportFormat === 'excel')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : exportSuccess
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download {exportFormat === 'excel' ? 'Excel' : 'Image'}
                </>
              )}
            </button>

            {/* Info Box */}
            <div className={`${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} rounded-2xl p-4 border`}>
              <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                <strong>Tip:</strong> Excel exports include multiple sheets. Native charts can be edited directly in Excel, while chart images preserve the exact UI appearance.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {exportSuccess && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
            darkMode ? 'bg-[#2c2c2e] text-white' : 'bg-white text-gray-900'
          } border ${borderColor}`}>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">Export Complete</div>
              <div className={`text-sm ${textSecondary}`}>File saved to downloads</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartExportStudio;
