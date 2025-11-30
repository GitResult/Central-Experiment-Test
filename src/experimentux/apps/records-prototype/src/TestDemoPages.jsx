/**
 * Test file to verify demo pages are correctly configured
 */

import React from 'react';
import UniversalPage from './components/UniversalPage/UniversalPage';
import { getAllDemoPages, getDemoPageById } from './components/layouts/demoPages';

const TestDemoPages = () => {
  const allDemos = getAllDemoPages();
  const simpleDemo = getDemoPageById('demo-simple');
  const eventDemo = getDemoPageById('demo-event-landing');
  const multiColDemo = getDemoPageById('demo-multi-column');

  console.log('=== DEMO PAGES DEBUG ===');
  console.log('All demos:', allDemos);
  console.log('Simple demo:', simpleDemo);
  console.log('Event demo:', eventDemo);
  console.log('Multi-col demo:', multiColDemo);

  if (!simpleDemo) {
    return (
      <div style={{ padding: '2rem', background: '#fee', border: '2px solid red' }}>
        <h1>ERROR: simpleDemo is undefined!</h1>
        <p>Available demos: {allDemos.length}</p>
        <pre>{JSON.stringify(allDemos.map(d => ({ id: d.id, name: d.name })), null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e0f2fe', border: '1px solid #0284c7', borderRadius: '8px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0369a1' }}>
          ✅ Demo Pages Loaded Successfully
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#075985' }}>
          Found {allDemos.length} demo pages
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Available Demos:</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {allDemos.map((demo) => (
            <div
              key={demo.id}
              style={{
                padding: '1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{demo.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>ID: {demo.id}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Zones: {demo.zones?.length || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Preset: {demo.layoutPresetId}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Rendering: Simple Demo</h2>

      <UniversalPage
        pageId="test-simple-demo"
        config={simpleDemo}
        containerContext="page"
        onUpdate={(newConfig) => {
          console.log('Demo updated:', newConfig);
        }}
      />
    </div>
  );
};

export default TestDemoPages;
