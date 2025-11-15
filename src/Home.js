import React, { useState } from 'react';
import { Users, BarChart3, FileText, Database, Contact, Activity, ArrowRight } from 'lucide-react';
import App from './App';
import ContactList from './ContactList';
import AppStaffDetails from './AppStaffDetails';
import AppReportPhrase from './AppReportPhrase';
import AppUSB from './AppUSB';
import AppUnifiedListingPerformance from './AppUnifiedListingPerformance';

const Home = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const applications = [
    {
      id: 'contact-list',
      title: 'Contact List',
      description: 'Comprehensive contact management with filtering and charting capabilities',
      icon: Contact,
      color: 'from-blue-500 to-blue-600',
      component: ContactList,
      new: true
    },
    {
      id: 'members',
      title: 'Members Dashboard',
      description: 'Interactive member management with compare mode and analytics',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      component: App
    },
    {
      id: 'staff',
      title: 'Staff Details',
      description: 'Staff information and management system',
      icon: Users,
      color: 'from-green-500 to-green-600',
      component: AppStaffDetails
    },
    {
      id: 'reports',
      title: 'Report Phrase',
      description: 'Report generation and phrase analysis',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      component: AppReportPhrase
    },
    {
      id: 'usb',
      title: 'USB Search',
      description: 'Unified search interface for enterprise data',
      icon: Database,
      color: 'from-red-500 to-red-600',
      component: AppUSB
    },
    {
      id: 'performance',
      title: 'Listing Performance',
      description: 'Performance tracking and analytics',
      icon: Activity,
      color: 'from-pink-500 to-pink-600',
      component: AppUnifiedListingPerformance
    }
  ];

  if (selectedApp) {
    const app = applications.find(a => a.id === selectedApp);
    const Component = app.component;
    return (
      <div>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => setSelectedApp(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="text-sm text-gray-600">{app.title}</div>
          </div>
        </div>
        <Component />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central Experiment Dashboard</h1>
              <p className="text-gray-600 mt-1">Select an application to get started</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 hover:border-blue-300"
              >
                <div className={`h-32 bg-gradient-to-br ${app.color} flex items-center justify-center relative`}>
                  <Icon className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  {app.new && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      NEW
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {app.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    Open Application
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{applications.length}</div>
              <div className="text-gray-600 font-medium">Applications</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {applications.filter(a => a.new).length}
              </div>
              <div className="text-gray-600 font-medium">New Features</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Operational</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
