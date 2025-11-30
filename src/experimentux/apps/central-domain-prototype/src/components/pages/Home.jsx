/**
 * Home Page Component
 * Onboarding-focused home page for new users
 */

import { useEffect } from 'react';
import { DynamicColumnLayout } from '../layout/DynamicColumnLayout';
import { useEditorStore } from '../../store/editorStore';

const PAGE_KEY = 'home';

export function Home() {
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const homePage = useEditorStore((state) => state.pages[PAGE_KEY]);

  // Ensure page exists in store and set as current page
  useEffect(() => {
    ensurePage(PAGE_KEY, 'Home');
    useEditorStore.setState({ currentPageKey: PAGE_KEY });
  }, [ensurePage]);

  // Get page settings
  const mainZone = homePage?.zones?.[0] || {};
  const firstRow = mainZone.rows?.[0] || {};
  const containerWidth = mainZone.containerWidth || 'standard';
  const columnGap = firstRow.columnGap || 24;
  const contentPadding = firstRow.contentPadding || 12;
  const elementsVerticalGap = firstRow.elementsVerticalGap || 16;

  // Container width mapping (using inline styles for dynamic values)
  const containerMaxWidth = {
    narrow: '600px',
    standard: '900px',
    wide: '1200px',
    full: '100%'
  }[containerWidth] || '1200px';

  return (
    <div className="mx-auto" style={{ maxWidth: containerMaxWidth, padding: `${contentPadding * 2}px` }}>
      <DynamicColumnLayout
        zoneId="home-main"
        rowIndex={0}
        pageKey={PAGE_KEY}
        columnGap={columnGap}
        elementsVerticalGap={elementsVerticalGap}
      />
    </div>
  );
}
