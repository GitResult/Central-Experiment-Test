import { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@central-ux/ui-components';

function App() {
  const [selectedReport, setSelectedReport] = useState('sales');

  const reports = [
    { id: 'sales', name: 'Sales Report', description: 'Monthly sales performance' },
    { id: 'user', name: 'User Analytics', description: 'User engagement metrics' },
    { id: 'financial', name: 'Financial Summary', description: 'Revenue and expenses' },
    { id: 'inventory', name: 'Inventory Status', description: 'Stock levels and alerts' },
  ];

  const mockData = [
    { period: 'Jan 2024', value: 45000, growth: '+12%' },
    { period: 'Feb 2024', value: 52000, growth: '+15%' },
    { period: 'Mar 2024', value: 48000, growth: '-8%' },
    { period: 'Apr 2024', value: 61000, growth: '+27%' },
    { period: 'May 2024', value: 58000, growth: '-5%' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Reports Prototype</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Explore different report layouts, charts, and data visualizations
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900">Available Reports</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedReport === report.id
                          ? 'bg-primary-100 text-primary-900 border-l-4 border-primary-600'
                          : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">{report.description}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Custom Report
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {reports.find(r => r.id === selectedReport)?.name}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export PDF</Button>
                    <Button variant="outline" size="sm">Export CSV</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <h3 className="text-md font-semibold text-neutral-900">Report Data</h3>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-neutral-700">Period</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-neutral-700">Value</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-neutral-700">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.map((row, index) => (
                        <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-3 px-4 text-sm text-neutral-900">{row.period}</td>
                          <td className="py-3 px-4 text-sm text-neutral-900 text-right font-medium">
                            ${row.value.toLocaleString()}
                          </td>
                          <td className={`py-3 px-4 text-sm text-right font-medium ${
                            row.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {row.growth}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Chart Placeholder */}
                <div className="mt-8 p-8 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300">
                  <div className="text-center">
                    <div className="text-neutral-500 text-sm font-medium">Chart Visualization Area</div>
                    <div className="text-neutral-400 text-xs mt-2">
                      Add your preferred charting library (Chart.js, Recharts, etc.)
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
