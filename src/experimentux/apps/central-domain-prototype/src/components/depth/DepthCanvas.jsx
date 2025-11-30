/**
 * DEPTH Canvas
 * Interactive enterprise canvas with zoomable containers
 */

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Target, Settings, Users, Palette, Scale, Building } from 'lucide-react';
import { theme } from '../../config/theme';
import Help5GovernanceDashboard from './Help5GovernanceDashboard';
import Help5LensOverlay from './Help5LensOverlay';
import { useHelp5Analytics } from './hooks/useHelp5Analytics';

const CONTAINERS = [
  { id: 'strategy', title: 'Strategy', icon: Target, color: theme.colors.primary[500] },
  { id: 'processes', title: 'Processes', icon: Settings, color: theme.colors.charts.accent2 },
  { id: 'experience', title: 'Experience', icon: Palette, color: theme.colors.charts.accent1 },
  { id: 'governance', title: 'Governance & Compliance', icon: Scale, color: theme.colors.warning[500] },
  { id: 'operations', title: 'Operations', icon: Building, color: theme.colors.success[500] }
];

export function DepthCanvas({ data = {}, help5Records = [], allElements = [], lensMode = null, onContainerClick, onHelp5ViewDetails }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Calculate Help5 analytics
  const help5Analytics = useHelp5Analytics(help5Records, allElements);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: theme.colors.background.secondary,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        top: theme.spacing[4],
        right: theme.spacing[4],
        display: 'flex',
        gap: theme.spacing[2],
        zIndex: 10
      }}>
        <button
          onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
          style={toolbarButtonStyle}
        >
          Zoom In
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
          style={toolbarButtonStyle}
        >
          Zoom Out
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          style={toolbarButtonStyle}
        >
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease',
          padding: theme.spacing[8],
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[6],
          minHeight: '100%'
        }}
      >
        {CONTAINERS.map((container) => (
          <DepthContainer
            key={container.id}
            {...container}
            data={data[container.id] || []}
            onClick={() => onContainerClick?.(container.id)}
            help5Stats={help5Analytics.byContainer[container.id]}
            lensMode={lensMode}
            showHelp5Dashboard={container.id === 'governance'}
            help5Records={help5Records}
            allElements={allElements}
            onHelp5ViewDetails={onHelp5ViewDetails}
          />
        ))}
      </div>
    </div>
  );
}

function DepthContainer({ id, title, icon: Icon, color, data, onClick, help5Stats, lensMode, showHelp5Dashboard, help5Records, allElements, onHelp5ViewDetails }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.background.elevated,
        border: `2px solid ${color}`,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        cursor: 'pointer',
        transition: `all ${theme.transitions.base}`,
        minHeight: '200px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Help5 Lens Overlay */}
      {lensMode && help5Stats && (
        <Help5LensOverlay containerStats={help5Stats} lensMode={lensMode} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3], marginBottom: theme.spacing[4] }}>
        <Icon size={24} color={color} />
        <h2 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          margin: 0
        }}>
          {title}
        </h2>
        <span style={{
          marginLeft: 'auto',
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.tertiary,
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
          borderRadius: theme.borderRadius.full
        }}>
          {data.length} items
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: theme.spacing[3]
      }}>
        {data.slice(0, 6).map((item, index) => (
          <div
            key={index}
            style={{
              padding: theme.spacing[3],
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
          >
            {item.name || item.title || `Item ${index + 1}`}
          </div>
        ))}
      </div>

      {/* Help5 Governance Dashboard (only for governance container) */}
      {showHelp5Dashboard && (
        <Help5GovernanceDashboard
          help5Records={help5Records}
          allElements={allElements}
          onViewDetails={onHelp5ViewDetails}
        />
      )}
    </div>
  );
}

const toolbarButtonStyle = {
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  backgroundColor: theme.colors.background.elevated,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.md,
  fontSize: theme.typography.fontSize.sm,
  color: theme.colors.text.primary,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`
};

DepthCanvas.propTypes = {
  data: PropTypes.object,
  help5Records: PropTypes.array,
  allElements: PropTypes.array,
  lensMode: PropTypes.oneOf(['insight', 'department', 'dependency', null]),
  onContainerClick: PropTypes.func,
  onHelp5ViewDetails: PropTypes.func
};

DepthContainer.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  help5Stats: PropTypes.object,
  lensMode: PropTypes.string,
  showHelp5Dashboard: PropTypes.bool,
  help5Records: PropTypes.array,
  allElements: PropTypes.array,
  onHelp5ViewDetails: PropTypes.func
};

export default DepthCanvas;
