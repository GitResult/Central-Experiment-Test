/**
 * PresenterAudienceView
 * Clean audience screen (for projector/second monitor)
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import DefaultLayout from './layouts/DefaultLayout';
import TitleLayout from './layouts/TitleLayout';
import TwoColsLayout from './layouts/TwoColsLayout';
import CodeLayout from './layouts/CodeLayout';
import QuoteLayout from './layouts/QuoteLayout';
import FullImageLayout from './layouts/FullImageLayout';
import SectionLayout from './layouts/SectionLayout';
import EndLayout from './layouts/EndLayout';

const LAYOUTS = {
  default: DefaultLayout,
  title: TitleLayout,
  'two-cols': TwoColsLayout,
  code: CodeLayout,
  quote: QuoteLayout,
  'full-image': FullImageLayout,
  section: SectionLayout,
  end: EndLayout
};

export function PresenterAudienceView({ slide, blackout = false }) {
  if (blackout) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} />
    );
  }

  if (!slide) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.colors.background.elevated,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize['2xl']
      }}>
        No slide to display
      </div>
    );
  }

  const LayoutComponent = LAYOUTS[slide.layout] || DefaultLayout;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <LayoutComponent html={slide.html} />
    </div>
  );
}

PresenterAudienceView.propTypes = {
  slide: PropTypes.shape({
    html: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired
  }),
  blackout: PropTypes.bool
};

export default PresenterAudienceView;
