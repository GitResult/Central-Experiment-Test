/**
 * ShowcaseDetail Component
 * Renders a single example page from JSON
 */

import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { PageRenderer } from '../PageRenderer';
import { useEditorStore } from '../../store/editorStore';
import { useEditablePage } from '../../utils/makePageEditable';
import { theme } from '../../config/theme';

// Import example data
import hubspotCrmContact from '../../data/examples/hubspot-crm-contact.json';
import eventLandingPage from '../../data/examples/event-landing-page.json';
import applicationSubmission from '../../data/examples/application-submission.json';
import enterpriseDashboard from '../../data/examples/enterprise-dashboard.json';
import notionPage from '../../data/examples/notion-page.json';
import figmaCanvas from '../../data/examples/figma-canvas.json';
import magazineArticle from '../../data/examples/magazine-article.json';
import renewalEmail from '../../data/examples/renewal-email.json';

const EXAMPLES = {
  'hubspot-crm-contact': hubspotCrmContact,
  'event-landing-page': eventLandingPage,
  'application-submission': applicationSubmission,
  'enterprise-dashboard': enterpriseDashboard,
  'notion-page': notionPage,
  'figma-canvas': figmaCanvas,
  'magazine-article': magazineArticle,
  'renewal-email': renewalEmail
};

export function ShowcaseDetail() {
  const { id } = useParams();
  const example = EXAMPLES[id];
  const mode = useEditorStore((state) => state.mode);
  const isEditMode = mode === 'edit';
  const setCurrentPageKey = useEditorStore((state) => state.setCurrentPageKey);
  const pages = useEditorStore((state) => state.pages);
  const setPage = useEditorStore((state) => state.setPage);

  const { renderDropZone, renderUserElements, wrapWithDndContext } = useEditablePage(
    `showcase-detail-${id}`,
    example?.name || 'Showcase Example'
  );

  // Register the showcase page in the editor store when component mounts or id changes
  useEffect(() => {
    if (example && id) {
      const pageKey = `showcase-detail-${id}`;

      // Only set the page if it doesn't exist or needs updating
      if (!pages[pageKey]) {
        setPage(pageKey, example);
      }

      // Set as current page for settings panel
      setCurrentPageKey(pageKey);
    }

    // Cleanup: clear current page key when component unmounts
    return () => {
      setCurrentPageKey(null);
    };
  }, [id, example, pages, setPage, setCurrentPageKey]);

  // Get the page from store (will have updates from settings panel)
  const pageKey = `showcase-detail-${id}`;
  const pageData = pages[pageKey] || example;

  if (!example) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p style={{ color: theme.colors.text.secondary }}>Example not found</p>
        <Link to="/showcase" style={{ color: theme.colors.primary[500] }}>
          Back to Showcase
        </Link>
      </div>
    );
  }

  return wrapWithDndContext(
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.secondary }}>
      {renderUserElements(`showcase-detail-${id}-main`)}
      {renderDropZone(`showcase-detail-${id}-main`)}
      {/* Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.border.default
        }}
      >
        <div className="max-w-7xl mx-auto p-6">
          <Link
            to="/showcase"
            className="inline-flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}
          >
            <span>←</span> Back to Showcase
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-bold mb-2"
                style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.bold
                }}
              >
                {example.name}
              </h1>
              <p
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary
                }}
              >
                {example.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: theme.colors.border.default,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  backgroundColor: theme.colors.background.primary,
                  cursor: 'pointer',
                  transition: `all ${theme.transitions.base}`
                }}
              >
                View JSON
              </button>
              <button
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  color: theme.colors.text.inverse,
                  fontSize: theme.typography.fontSize.sm,
                  cursor: 'pointer',
                  border: 'none',
                  transition: `all ${theme.transitions.base}`
                }}
              >
                Duplicate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <PageRenderer pageData={pageData} isEditMode={isEditMode} />
    </div>
  );
}
