/**
 * Template System Demo
 *
 * Demonstrates the complete template-based record system workflow:
 * 1. Template selection via gallery
 * 2. Record creation from template
 * 3. Template-based rendering with UniversalPage
 * 4. Drag-and-drop customization
 *
 * This is a standalone demo that can be imported into the main app.
 */

import React, { useState } from 'react';
import TemplateGallery from './components/TemplateGallery';
import TemplateBasedRecordDetail from './components/TemplateBasedRecordDetail';
import { createSampleRecord, getAllTemplates } from './templates/index';

const TemplateDemo = () => {
  const [view, setView] = useState('list'); // 'list' | 'gallery' | 'detail'
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  // Handle template selection from gallery
  const handleTemplateSelect = (template) => {
    if (!template) {
      // Blank template - create minimal record
      const blankRecord = {
        id: `BLANK-${Date.now()}`,
        templateId: 'blank',
        title: 'Untitled',
        customData: {},
        pageConfig: {
          layoutPresetId: 'blank',
          zones: [
            {
              id: 'body',
              type: 'zone',
              visible: true,
              padding: { x: 8, y: 8 },
              elements: []
            }
          ],
          features: {
            insertMethod: 'both',
            showSlashHint: true,
            allowZoneToggle: true,
            enableDragReorder: true
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'demo-user'
        }
      };

      setRecords([...records, blankRecord]);
      setSelectedRecord(blankRecord);
      setShowGallery(false);
      setView('detail');
    } else {
      // Create record from template with sample data
      const newRecord = createSampleRecord(template.templateId, `Sample ${template.name}`);
      setRecords([...records, newRecord]);
      setSelectedRecord(newRecord);
      setShowGallery(false);
      setView('detail');
    }
  };

  // Handle record update
  const handleRecordUpdate = (updatedRecord) => {
    setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setSelectedRecord(updatedRecord);
  };

  // Handle record deletion
  const handleDeleteRecord = (recordId) => {
    setRecords(records.filter(r => r.id !== recordId));
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(null);
      setView('list');
    }
  };

  // View: Record List
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Template System Demo
            </h1>
            <p className="text-neutral-600">
              Explore enterprise-grade page templates with drag-and-drop customization
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Create Button */}
          <button
            onClick={() => setShowGallery(true)}
            className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create from Template
          </button>

          {/* Records Grid */}
          {records.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                No records yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Get started by creating your first record from a template
              </p>
              <button
                onClick={() => setShowGallery(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => {
                const template = getAllTemplates().find(t => t.templateId === record.templateId);
                return (
                  <div
                    key={record.id}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-neutral-100">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{template?.icon || '📄'}</span>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          aria-label="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                        {record.title}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {template?.name || 'Custom'}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="space-y-2 text-sm text-neutral-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{template?.category || 'Uncategorized'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Updated {new Date(record.metadata.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setView('detail');
                        }}
                        className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors font-medium"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Template Gallery Info */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Available Templates
            </h3>
            <p className="text-blue-700 mb-4">
              {getAllTemplates().length} professional templates ready to use
            </p>
            <div className="flex flex-wrap gap-2">
              {getAllTemplates().map(template => (
                <div
                  key={template.templateId}
                  className="px-3 py-1 bg-white rounded-full text-sm flex items-center gap-1"
                >
                  <span>{template.icon}</span>
                  <span className="text-neutral-700">{template.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Gallery Modal */}
        {showGallery && (
          <TemplateGallery
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowGallery(false)}
            showBlankOption={true}
          />
        )}
      </div>
    );
  }

  // View: Record Detail
  if (view === 'detail' && selectedRecord) {
    return (
      <TemplateBasedRecordDetail
        record={selectedRecord}
        onUpdate={handleRecordUpdate}
        onClose={() => setView('list')}
      />
    );
  }

  return null;
};

export default TemplateDemo;
