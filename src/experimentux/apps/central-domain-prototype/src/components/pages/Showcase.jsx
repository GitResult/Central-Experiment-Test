/**
 * Showcase Component
 * Gallery of 8 example pages with filtering
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { useEditorStore } from '../../store/editorStore';
import { DynamicColumnLayout } from '../layout/DynamicColumnLayout';
import { theme } from '../../config/theme';

const PAGE_KEY = 'showcase';

// Import example data
import hubspotCrmContact from '../../data/examples/hubspot-crm-contact.json';
import eventLandingPage from '../../data/examples/event-landing-page.json';
import applicationSubmission from '../../data/examples/application-submission.json';
import enterpriseDashboard from '../../data/examples/enterprise-dashboard.json';
import notionPage from '../../data/examples/notion-page.json';
import figmaCanvas from '../../data/examples/figma-canvas.json';
import magazineArticle from '../../data/examples/magazine-article.json';
import renewalEmail from '../../data/examples/renewal-email.json';

const EXAMPLES = [
  hubspotCrmContact,
  enterpriseDashboard,
  eventLandingPage,
  applicationSubmission,
  notionPage,
  figmaCanvas,
  magazineArticle,
  renewalEmail
];

const TYPES = ['All', 'CRM', 'Analytics', 'Marketing', 'HR', 'CMS', 'Design', 'Editorial', 'Email'];

export function Showcase() {
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const addElement = useEditorStore((state) => state.addElement);
  const showcasePage = useEditorStore((state) => state.pages[PAGE_KEY]);

  const [filterType, setFilterType] = useState('All');

  // Ensure page exists
  useEffect(() => {
    ensurePage(PAGE_KEY, 'Showcase');
  }, [ensurePage]);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === 'palette-element') {
      const elementType = active.data.current.elementType;
      const elementSubtype = active.data.current.elementSubtype;
      const dropData = over.data.current;

      if (dropData) {
        const newElement = {
          type: elementType,
          subtype: elementSubtype,
          data: active.data.current.defaultData || {},
          settings: active.data.current.defaultSettings || {}
        };

        if (elementType === 'structure') {
          newElement.elements = active.data.current.elements || [];
        }

        addElement(dropData.zoneId, dropData.rowIndex, dropData.columnIndex, newElement, PAGE_KEY);
      }
    }
  };

  const filteredExamples = filterType === 'All'
    ? EXAMPLES
    : EXAMPLES.filter(example => example.type === filterType);

  // Get page settings
  const mainZone = showcasePage?.zones?.[0] || {};
  const firstRow = mainZone.rows?.[0] || {};
  const columnGap = firstRow.columnGap || 24;
  const elementsVerticalGap = firstRow.elementsVerticalGap || 16;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* User-added elements */}
        <DynamicColumnLayout
          zoneId="main-content"
          rowIndex={0}
          pageKey={PAGE_KEY}
          columnGap={columnGap}
          elementsVerticalGap={elementsVerticalGap}
        />
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-bold mb-2"
          style={{
            fontSize: theme.typography.fontSize['3xl'],
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.bold
          }}
        >
          Showcase
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary
          }}
        >
          Explore {filteredExamples.length} example pages demonstrating Central's capabilities
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: filterType === type ? theme.colors.primary[500] : theme.colors.background.secondary,
              color: filterType === type ? theme.colors.text.inverse : theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: filterType === type ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
              border: `1px solid ${filterType === type ? theme.colors.primary[500] : theme.colors.border.default}`,
              cursor: 'pointer'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Examples grid */}
      {filteredExamples.length === 0 ? (
        <div
          className="text-center py-12"
          style={{
            color: theme.colors.text.tertiary
          }}
        >
          <p>No examples found for this type</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamples.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
      )}
      </div>
    </DndContext>
  );
}

// ExampleCard subcomponent
function ExampleCard({ example }) {
  const typeColors = {
    'CRM': theme.colors.primary[500],
    'Analytics': theme.colors.charts.accent2,
    'Marketing': theme.colors.charts.accent1,
    'HR': theme.colors.warning[500],
    'CMS': theme.colors.charts.accent2,
    'Design': theme.colors.charts.accent1,
    'Editorial': theme.colors.neutral[600],
    'Email': theme.colors.charts.accent3
  };

  return (
    <Link to={`/showcase/${example.id}`}>
      <div
        className="rounded-lg border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        style={{
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.default,
          borderRadius: theme.borderRadius.lg,
          transition: `all ${theme.transitions.base}`
        }}
      >
        {/* Thumbnail placeholder */}
        <div
          className="w-full h-48 flex items-center justify-center"
          style={{
            backgroundColor: theme.colors.background.secondary,
            borderBottom: `1px solid ${theme.colors.border.default}`
          }}
        >
          <span
            style={{
              fontSize: theme.typography.fontSize['4xl'],
              opacity: 0.3
            }}
          >
            📄
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="font-semibold"
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.semibold
              }}
            >
              {example.name}
            </h3>
            <span
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: `${typeColors[example.type]}20`,
                color: typeColors[example.type],
                fontSize: theme.typography.fontSize.xs
              }}
            >
              {example.type}
            </span>
          </div>

          <p
            className="mb-3"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}
          >
            {example.description}
          </p>

          <div
            className="text-sm"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.primary[500],
              fontWeight: theme.typography.fontWeight.medium
            }}
          >
            View Example →
          </div>
        </div>
      </div>
    </Link>
  );
}
