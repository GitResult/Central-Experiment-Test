/**
 * SettingsPanel Component
 * Right panel for editing element settings
 */

import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';
import { memo, useState, useEffect } from 'react';

// Container Width Selector - Visual bar component
function ContainerWidthSelector({ value, onChange }) {
  const options = [
    { value: 'narrow', label: 'Narrow', width: 600, percentage: 25 },
    { value: 'standard', label: 'Standard', width: 900, percentage: 50 },
    { value: 'wide', label: 'Wide', width: 1200, percentage: 75 },
    { value: 'full', label: 'Full', width: '100%', percentage: 100 }
  ];

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: theme.spacing[2],
          fontSize: '12px',
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.secondary,
          fontFamily: theme.typography.fontFamily.sans
        }}
      >
        Container Width
      </label>

      {/* Well + Floating bar design */}
      <div
        style={{
          position: 'relative',
          height: '56px',
          marginBottom: theme.spacing[3],
          borderRadius: theme.borderRadius.lg,
          background: theme.colors.background.tertiary,
          padding: theme.spacing[1],
          border: `1px solid ${theme.colors.border.default}`
        }}
      >
        {/* Floating fill indicator bar */}
        <div
          style={{
            position: 'absolute',
            left: theme.spacing[1],
            top: theme.spacing[1],
            bottom: theme.spacing[1],
            width: `calc(${options.find(opt => opt.value === value)?.percentage || 50}% - ${theme.spacing[1]})`,
            background: `linear-gradient(90deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
            borderRadius: theme.borderRadius.md,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: theme.shadows.sm,
            zIndex: 1
          }}
        />

        {/* Options */}
        <div style={{ position: 'relative', display: 'flex', height: '100%', zIndex: 2 }}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing[0.5],
                transition: 'all 0.2s ease',
                fontFamily: theme.typography.fontFamily.sans,
                borderRadius: theme.borderRadius.md
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: value === option.value ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                  color: value === option.value ? '#FFFFFF' : theme.colors.text.tertiary,
                  transition: 'color 0.2s ease'
                }}
              >
                {option.label}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: value === option.value ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.tertiary,
                  transition: 'color 0.2s ease'
                }}
              >
                {typeof option.width === 'number' ? `${option.width}px` : option.width}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Column Width Slider - Single slider with markers
function ColumnWidthSlider({ columns, columnWidths, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [tempWidths, setTempWidths] = useState(columnWidths);
  const [sliderRef, setSliderRef] = useState(null);
  const setColumnDragState = useEditorStore((state) => state.setColumnDragState);

  // Calculate marker positions (cumulative percentages)
  const markerPositions = [];
  let cumulative = 0;
  const displayWidths = isDragging ? tempWidths : columnWidths;
  for (let i = 0; i < columns - 1; i++) {
    cumulative += displayWidths[i];
    markerPositions.push(cumulative);
  }

  const handleMouseMove = (e) => {
    if (!isDragging || dragIndex === null || !sliderRef) return;

    const rect = sliderRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Calculate new widths
    const newWidths = [...columnWidths];
    const leftSum = dragIndex > 0 ? markerPositions.slice(0, dragIndex).reduce((sum, val, i) => {
      return sum + newWidths[i];
    }, 0) : 0;
    const rightBound = dragIndex < markerPositions.length - 1 ? markerPositions[dragIndex + 1] : 100;

    // Constrain the marker position
    const newMarkerPos = Math.max(leftSum + 5, Math.min(rightBound - 5, percentage));

    // Update the two columns affected by this marker
    newWidths[dragIndex] = newMarkerPos - leftSum;
    const remainingRight = (dragIndex < markerPositions.length - 1 ? markerPositions[dragIndex + 1] : 100) - newMarkerPos;
    newWidths[dragIndex + 1] = remainingRight;

    setTempWidths(newWidths);
    // Broadcast to store for page overlay
    setColumnDragState(true, newWidths);
  };

  const handleMouseUp = () => {
    if (isDragging && tempWidths) {
      // Normalize and apply
      const total = tempWidths.reduce((sum, w) => sum + w, 0);
      const normalized = tempWidths.map(w => (w / total) * 100);
      onChange(normalized);
    }
    setIsDragging(false);
    setDragIndex(null);
    // Clear drag state from store
    setColumnDragState(false, null);
  };

  // Set up global mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragIndex, tempWidths]);

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: theme.spacing[2],
          fontSize: '12px',
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.secondary,
          fontFamily: theme.typography.fontFamily.sans
        }}
      >
        Column Distribution
      </label>

      {/* Slider bar */}
      <div
        ref={setSliderRef}
        style={{
          position: 'relative',
          height: '48px',
          marginBottom: theme.spacing[4],
          borderRadius: theme.borderRadius.md,
          background: theme.colors.background.tertiary,
          border: `1px solid ${theme.colors.border.default}`,
          cursor: isDragging ? 'ew-resize' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Column segments */}
        <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
          {displayWidths.map((width, idx) => (
            <div
              key={idx}
              style={{
                width: `${width}%`,
                height: '100%',
                background: idx % 2 === 0 ? theme.colors.primary[100] : theme.colors.primary[50],
                borderRight: idx < displayWidths.length - 1 ? `1px solid ${theme.colors.border.medium}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.tertiary,
                fontFamily: theme.typography.fontFamily.sans,
                position: 'relative'
              }}
            >
              {/* Show percentage when not dragging, show floating label when dragging */}
              {isDragging ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    borderRadius: theme.borderRadius.md,
                    boxShadow: theme.shadows.elevated,
                    fontSize: '13px',
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.primary[600],
                    border: `1px solid ${theme.colors.primary[200]}`,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                >
                  {Math.round(width)}%
                </div>
              ) : (
                <span>{Math.round(width)}%</span>
              )}
            </div>
          ))}
        </div>

        {/* Markers for gaps */}
        {markerPositions.map((position, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${position}%`,
              top: '-4px',
              width: '2px',
              height: 'calc(100% + 8px)',
              background: theme.colors.primary[500],
              cursor: 'ew-resize',
              transform: 'translateX(-1px)',
              zIndex: 2
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
              setDragIndex(idx);
              setTempWidths(columnWidths);
              // Set initial drag state in store
              setColumnDragState(true, columnWidths);
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '14px',
                height: '24px',
                background: theme.colors.primary[500],
                borderRadius: theme.borderRadius.sm,
                boxShadow: theme.shadows.sm,
                border: `2px solid ${theme.colors.background.primary}`,
                transition: isDragging && dragIndex === idx ? 'none' : 'all 0.2s ease'
              }}
            />
          </div>
        ))}
      </div>

      {/* Exact value inputs - Max 4 per row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(columns, 4)}, 1fr)`,
          gap: theme.spacing[2]
        }}
      >
        {columnWidths.map((width, idx) => (
          <div key={idx}>
            <label
              style={{
                display: 'block',
                marginBottom: theme.spacing[1],
                fontSize: '11px',
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.tertiary,
                fontFamily: theme.typography.fontFamily.sans
              }}
            >
              Col {idx + 1}
            </label>
            <input
              type="number"
              value={Math.round(width)}
              onChange={(e) => {
                const newWidths = [...columnWidths];
                const newValue = Math.max(5, Math.min(95, parseInt(e.target.value) || width));
                newWidths[idx] = newValue;

                // Normalize
                const total = newWidths.reduce((sum, w) => sum + w, 0);
                const normalized = newWidths.map(w => (w / total) * 100);
                onChange(normalized);
              }}
              min={5}
              max={95}
              step={1}
              style={{
                width: '100%',
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                fontSize: '12px',
                fontFamily: theme.typography.fontFamily.sans,
                color: theme.colors.text.primary,
                background: theme.colors.background.primary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none'
              }}
            />
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: '11px',
          color: theme.colors.text.tertiary,
          marginTop: theme.spacing[2],
          fontFamily: theme.typography.fontFamily.sans
        }}
      >
        Drag markers or enter exact values. Total is normalized to 100%.
      </p>
    </div>
  );
}

const SettingGroup = memo(function SettingGroup({ title, children }) {
  return (
    <div className="mb-6">
      <h3
        className="font-medium mb-3"
        style={{
          fontSize: '14px', // Minimum 14px for section headings
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.sans
        }}
      >
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
});

const SettingField = memo(function SettingField({ label, value, onChange, type = 'text', options = [], min, max, step = 1, showSlider = false, placeholder }) {
  const inputStyle = {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    fontSize: '12px', // Minimum 12px for text
    fontFamily: theme.typography.fontFamily.sans,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: theme.spacing.xs,
    fontSize: '12px', // Minimum 12px for text
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  };

  const sliderStyle = {
    width: '100%',
    marginTop: theme.spacing.xs,
    accentColor: theme.colors.primary[500]
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginTop: theme.spacing.xs }}
        />
      ) : type === 'number' && showSlider ? (
        <>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            style={inputStyle}
            placeholder={placeholder}
          />
          <input
            type="range"
            value={value || min || 0}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            style={sliderStyle}
          />
        </>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={placeholder}
        />
      )}
    </div>
  );
});

function MarkupSettings({ element, onUpdate }) {
  const markupType = element.settings?.markup?.markupType || 'paragraph';
  const content = element.data?.content || '';

  return (
    <>
      <SettingGroup title="Data">
        <SettingField
          label="Content"
          value={content}
          onChange={(value) => onUpdate({ data: { content: value } })}
        />
      </SettingGroup>

      <SettingGroup title="Markup">
        <SettingField
          label="Type"
          type="select"
          value={markupType}
          onChange={(value) =>
            onUpdate({ settings: { markup: { ...element.settings?.markup, markupType: value } } })
          }
          options={[
            { value: 'title', label: 'Title' },
            { value: 'heading', label: 'Heading' },
            { value: 'paragraph', label: 'Paragraph' },
            { value: 'button', label: 'Button' },
            { value: 'nav-item', label: 'Nav Item' }
          ]}
        />
      </SettingGroup>

      <SettingGroup title="Typography">
        <SettingField
          label="Font Size"
          value={element.settings?.typography?.fontSize || ''}
          onChange={(value) =>
            onUpdate({
              settings: { typography: { ...element.settings?.typography, fontSize: value } }
            })
          }
          placeholder="{{theme.typography.fontSize.base}}"
        />
        <SettingField
          label="Font Weight"
          value={element.settings?.typography?.fontWeight || ''}
          onChange={(value) =>
            onUpdate({
              settings: { typography: { ...element.settings?.typography, fontWeight: value } }
            })
          }
          placeholder="{{theme.typography.fontWeight.normal}}"
        />
      </SettingGroup>

      <SettingGroup title="Appearance">
        <SettingField
          label="Color"
          value={element.settings?.appearance?.color || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, color: value } }
            })
          }
          placeholder="{{theme.colors.text.primary}}"
        />
      </SettingGroup>
    </>
  );
}

function FieldSettings({ element, onUpdate }) {
  const fieldType = element.settings?.field?.fieldType || 'text';
  const label = element.settings?.field?.label || '';
  const placeholder = element.settings?.field?.placeholder || '';
  const required = element.settings?.field?.required || false;

  return (
    <>
      <SettingGroup title="Field">
        <SettingField
          label="Field Type"
          type="select"
          value={fieldType}
          onChange={(value) =>
            onUpdate({ settings: { field: { ...element.settings?.field, fieldType: value } } })
          }
          options={[
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'textarea', label: 'Textarea' },
            { value: 'select', label: 'Select' }
          ]}
        />
        <SettingField
          label="Label"
          value={label}
          onChange={(value) =>
            onUpdate({ settings: { field: { ...element.settings?.field, label: value } } })
          }
        />
        <SettingField
          label="Placeholder"
          value={placeholder}
          onChange={(value) =>
            onUpdate({ settings: { field: { ...element.settings?.field, placeholder: value } } })
          }
        />
        <SettingField
          label="Required"
          type="checkbox"
          value={required}
          onChange={(value) =>
            onUpdate({ settings: { field: { ...element.settings?.field, required: value } } })
          }
        />
      </SettingGroup>
    </>
  );
}

function StructureSettings({ element, onUpdate }) {
  const structureType = element.settings?.structure?.structureType || 'card';
  const content = element.data?.content || '';

  return (
    <>
      <SettingGroup title="Data">
        <SettingField
          label="Content"
          value={content}
          onChange={(value) => onUpdate({ data: { content: value } })}
        />
      </SettingGroup>

      <SettingGroup title="Structure">
        <SettingField
          label="Structure Type"
          type="select"
          value={structureType}
          onChange={(value) =>
            onUpdate({
              settings: { structure: { ...element.settings?.structure, structureType: value } }
            })
          }
          options={[
            { value: 'card', label: 'Card' },
            { value: 'hero', label: 'Hero' },
            { value: 'canvas', label: 'Canvas' },
            { value: 'flex', label: 'Flex' },
            { value: 'nav', label: 'Nav' },
            { value: 'header', label: 'Header' }
          ]}
        />
      </SettingGroup>

      <SettingGroup title="Layout">
        <SettingField
          label="Padding"
          value={element.settings?.layout?.padding || ''}
          onChange={(value) =>
            onUpdate({ settings: { layout: { ...element.settings?.layout, padding: value } } })
          }
          placeholder="{{theme.spacing.lg}}"
        />
        <SettingField
          label="Min Height"
          value={element.settings?.layout?.minHeight || ''}
          onChange={(value) =>
            onUpdate({ settings: { layout: { ...element.settings?.layout, minHeight: value } } })
          }
          placeholder="auto"
        />
      </SettingGroup>

      <SettingGroup title="Appearance">
        <SettingField
          label="Background"
          value={element.settings?.appearance?.background || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, background: value } }
            })
          }
          placeholder="{{theme.colors.background}}"
        />
        <SettingField
          label="Border Color"
          value={element.settings?.appearance?.borderColor || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, borderColor: value } }
            })
          }
          placeholder="{{theme.colors.border.default}}"
        />
      </SettingGroup>
    </>
  );
}

function RecordSettings({ element, onUpdate }) {
  const recordType = element.settings?.record?.recordType || 'display';

  return (
    <>
      <SettingGroup title="Record">
        <SettingField
          label="Record Type"
          type="select"
          value={recordType}
          onChange={(value) =>
            onUpdate({ settings: { record: { ...element.settings?.record, recordType: value } } })
          }
          options={[
            { value: 'display', label: 'Display' },
            { value: 'card', label: 'Card' }
          ]}
        />
      </SettingGroup>

      <SettingGroup title="Data">
        <SettingField
          label="Content"
          value={element.data?.content || ''}
          onChange={(value) => onUpdate({ data: { content: value } })}
        />
      </SettingGroup>
    </>
  );
}

function SpotifyPlayerSettings({ element, onUpdate }) {
  const spotifyUrl = element.data?.spotifyUrl || '';
  const type = element.data?.type || 'track';
  const height = element.data?.height || 352;

  return (
    <>
      <SettingGroup title="Spotify Content">
        <SettingField
          label="Spotify URL"
          value={spotifyUrl}
          onChange={(value) => onUpdate({ data: { ...element.data, spotifyUrl: value } })}
          placeholder="https://open.spotify.com/track/..."
        />
        <SettingField
          label="Content Type"
          type="select"
          value={type}
          onChange={(value) => onUpdate({ data: { ...element.data, type: value } })}
          options={[
            { value: 'track', label: 'Track' },
            { value: 'album', label: 'Album' },
            { value: 'playlist', label: 'Playlist' },
            { value: 'artist', label: 'Artist' },
            { value: 'episode', label: 'Podcast Episode' },
            { value: 'show', label: 'Podcast Show' }
          ]}
        />
        <SettingField
          label="Player Height (px)"
          type="number"
          value={height}
          onChange={(value) => onUpdate({ data: { ...element.data, height: parseInt(value) || 352 } })}
          showSlider={true}
          min={152}
          max={600}
          step={1}
        />
      </SettingGroup>

      <SettingGroup title="Appearance">
        <SettingField
          label="Background Color"
          value={element.settings?.appearance?.background || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, background: value } }
            })
          }
          placeholder="{{theme.colors.background.primary}}"
        />
        <SettingField
          label="Border Color"
          value={element.settings?.appearance?.borderColor || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, borderColor: value } }
            })
          }
          placeholder="{{theme.colors.border.subtle}}"
        />
      </SettingGroup>

      <SettingGroup title="Layout">
        <SettingField
          label="Width"
          value={element.settings?.layout?.width || ''}
          onChange={(value) =>
            onUpdate({ settings: { layout: { ...element.settings?.layout, width: value } } })
          }
          placeholder="100%"
        />
      </SettingGroup>
    </>
  );
}

function AnalogClockSettings({ element, onUpdate }) {
  const showDate = element.data?.showDate !== false;
  const showSeconds = element.data?.showSeconds !== false;
  const showAllCanadianZones = element.data?.showAllCanadianZones || false;
  const timeZone = element.data?.timeZone || 'local';
  const size = element.settings?.layout?.size || '240';

  // Canadian timezone options
  const timezoneOptions = [
    { value: 'local', label: 'Local Time' },
    { value: 'America/St_Johns', label: 'Newfoundland (NST)' },
    { value: 'America/Halifax', label: 'Atlantic (AST)' },
    { value: 'America/Toronto', label: 'Eastern (EST)' },
    { value: 'America/Winnipeg', label: 'Central (CST)' },
    { value: 'America/Edmonton', label: 'Mountain (MST)' },
    { value: 'America/Vancouver', label: 'Pacific (PST)' }
  ];

  return (
    <>
      <SettingGroup title="Clock Display">
        <SettingField
          label="Show All Canadian Time Zones"
          type="checkbox"
          value={showAllCanadianZones}
          onChange={(value) => onUpdate({ data: { ...element.data, showAllCanadianZones: value } })}
        />
        {!showAllCanadianZones && (
          <>
            <SettingField
              label="Time Zone"
              type="select"
              value={timeZone}
              onChange={(value) => onUpdate({ data: { ...element.data, timeZone: value } })}
              options={timezoneOptions}
            />
            <SettingField
              label="Show Date"
              type="checkbox"
              value={showDate}
              onChange={(value) => onUpdate({ data: { ...element.data, showDate: value } })}
            />
          </>
        )}
        <SettingField
          label="Show Seconds Hand"
          type="checkbox"
          value={showSeconds}
          onChange={(value) => onUpdate({ data: { ...element.data, showSeconds: value } })}
        />
        <SettingField
          label="Clock Size (px)"
          type="number"
          value={parseInt(size) || 240}
          onChange={(value) =>
            onUpdate({
              settings: { layout: { ...element.settings?.layout, size: String(value || 240) } }
            })
          }
          showSlider={true}
          min={120}
          max={400}
          step={10}
        />
      </SettingGroup>

      <SettingGroup title="Appearance">
        <SettingField
          label="Background Color"
          value={element.settings?.appearance?.background || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, background: value } }
            })
          }
          placeholder="{{theme.colors.background.primary}}"
        />
        <SettingField
          label="Border Color"
          value={element.settings?.appearance?.borderColor || ''}
          onChange={(value) =>
            onUpdate({
              settings: { appearance: { ...element.settings?.appearance, borderColor: value } }
            })
          }
          placeholder="{{theme.colors.border.subtle}}"
        />
      </SettingGroup>

      <SettingGroup title="Layout">
        <SettingField
          label="Width"
          value={element.settings?.layout?.width || ''}
          onChange={(value) =>
            onUpdate({ settings: { layout: { ...element.settings?.layout, width: value } } })
          }
          placeholder="100%"
        />
        {showAllCanadianZones && (
          <>
            <SettingField
              label="Container Height (px)"
              type="number"
              value={parseInt(element.settings?.layout?.height) || 600}
              onChange={(value) =>
                onUpdate({ settings: { layout: { ...element.settings?.layout, height: `${value || 600}px` } } })
              }
              placeholder="600"
              showSlider={true}
              min={400}
              max={1200}
              step={50}
            />
            <SettingField
              label="Clock Size (px)"
              type="number"
              value={parseInt(element.settings?.layout?.clockSize) || 120}
              onChange={(value) =>
                onUpdate({ settings: { layout: { ...element.settings?.layout, clockSize: String(value || 120) } } })
              }
              placeholder="120"
              showSlider={true}
              min={80}
              max={200}
              step={10}
            />
          </>
        )}
      </SettingGroup>
    </>
  );
}

function GenericSettings({ element, onUpdate }) {
  // Generic settings for elements without specific settings panels
  const hasData = element.data && Object.keys(element.data).length > 0;
  const hasSettings = element.settings && Object.keys(element.settings).length > 0;

  return (
    <>
      {hasData && (
        <SettingGroup title="Data">
          {Object.entries(element.data).map(([key, value]) => (
            <SettingField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              value={typeof value === 'boolean' ? value : value?.toString() || ''}
              onChange={(newValue) => {
                const parsedValue = typeof value === 'boolean'
                  ? newValue
                  : typeof value === 'number'
                    ? parseFloat(newValue) || 0
                    : newValue;
                onUpdate({ data: { ...element.data, [key]: parsedValue } });
              }}
              type={typeof value === 'boolean' ? 'checkbox' : typeof value === 'number' ? 'number' : 'text'}
            />
          ))}
        </SettingGroup>
      )}

      {hasSettings && (
        <>
          {element.settings.layout && (
            <SettingGroup title="Layout">
              <SettingField
                label="Width"
                value={element.settings.layout.width || ''}
                onChange={(value) =>
                  onUpdate({ settings: { layout: { ...element.settings.layout, width: value } } })
                }
                placeholder="auto"
              />
              <SettingField
                label="Padding"
                value={element.settings.layout.padding || ''}
                onChange={(value) =>
                  onUpdate({ settings: { layout: { ...element.settings.layout, padding: value } } })
                }
                placeholder="{{theme.spacing.md}}"
              />
            </SettingGroup>
          )}

          {element.settings.appearance && (
            <SettingGroup title="Appearance">
              <SettingField
                label="Background"
                value={element.settings.appearance.background || ''}
                onChange={(value) =>
                  onUpdate({
                    settings: { appearance: { ...element.settings.appearance, background: value } }
                  })
                }
                placeholder="{{theme.colors.background}}"
              />
              <SettingField
                label="Border Color"
                value={element.settings.appearance.borderColor || ''}
                onChange={(value) =>
                  onUpdate({
                    settings: { appearance: { ...element.settings.appearance, borderColor: value } }
                  })
                }
                placeholder="{{theme.colors.border.default}}"
              />
            </SettingGroup>
          )}
        </>
      )}

      {!hasData && !hasSettings && (
        <div
          style={{
            padding: theme.spacing[4],
            textAlign: 'center',
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.sm
          }}
        >
          No settings available for this element type.
        </div>
      )}
    </>
  );
}

function PageSettings() {
  const currentPageKey = useEditorStore((state) => state.currentPageKey);
  const currentPage = useEditorStore((state) =>
    currentPageKey ? state.pages[currentPageKey] : state.currentPage
  );
  const updatePageSettings = useEditorStore((state) => state.updatePageSettings);

  // Get current zone settings (using first zone, first row)
  const mainZone = currentPage?.zones?.[0] || {};
  const firstRow = mainZone.rows?.[0] || {};
  const columns = firstRow.columns?.length || 1;
  const columnGap = firstRow.columnGap || 24;
  const contentPadding = firstRow.contentPadding || 12;
  const elementsVerticalGap = firstRow.elementsVerticalGap || mainZone.sectionSpacing || 16;
  const containerWidth = mainZone.containerWidth || 'standard';

  const handleUpdate = (updates) => {
    updatePageSettings(updates, currentPageKey);
  };

  return (
    <>
      <div className="mb-6">
        <h2
          className="font-semibold mb-1"
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.sans
          }}
        >
          Page Settings
        </h2>
        <p
          style={{
            fontSize: '12px', // Minimum 12px
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.sans
          }}
        >
          Configure layout and spacing
        </p>
      </div>

      <SettingGroup title="Container">
        <ContainerWidthSelector
          value={containerWidth}
          onChange={(value) => handleUpdate({ containerWidth: value })}
        />
      </SettingGroup>

      <SettingGroup title="Layout">
        <SettingField
          label="Number of Columns"
          type="number"
          value={columns}
          onChange={(value) => handleUpdate({ columns: parseInt(value) || 1 })}
          showSlider={true}
          min={1}
          max={12}
          step={1}
        />
      </SettingGroup>

      {/* Column Widths - only show when multiple columns */}
      {columns > 1 && (
        <SettingGroup title="Column Widths">
          <ColumnWidthSlider
            columns={columns}
            columnWidths={firstRow.columns?.map(col => col.width || (100 / columns)) || []}
            onChange={(newWidths) => handleUpdate({ columnWidths: newWidths })}
          />
        </SettingGroup>
      )}

      <SettingGroup title="Spacing">
        <SettingField
          label="Column Gap (px)"
          type="number"
          value={columnGap}
          onChange={(value) => handleUpdate({ columnGap: parseInt(value) || 24 })}
          showSlider={true}
          min={0}
          max={100}
          step={4}
        />
        <SettingField
          label="Content Padding (px)"
          type="number"
          value={contentPadding}
          onChange={(value) => handleUpdate({ contentPadding: parseInt(value) || 12 })}
          showSlider={true}
          min={0}
          max={50}
          step={2}
        />
        <SettingField
          label="Elements Vertical Gap (px)"
          type="number"
          value={elementsVerticalGap}
          onChange={(value) => handleUpdate({ elementsVerticalGap: parseInt(value) || 16 })}
          showSlider={true}
          min={0}
          max={50}
          step={2}
        />
      </SettingGroup>

      <CanvasSettingsSection />
    </>
  );
}

// Canvas Settings Section - only shown when using CanvasViewport
function CanvasSettingsSection() {
  const canvasPanLimit = useEditorStore((state) => state.canvasPanLimit);
  const setCanvasPanLimit = useEditorStore((state) => state.setCanvasPanLimit);

  // Check if we're on a canvas-enabled route (editor pages)
  const isCanvasRoute = typeof window !== 'undefined' && (
    window.location.pathname.includes('/editor') ||
    window.location.pathname.includes('/canvas/') ||
    window.location.pathname.includes('/page/') ||
    (window.location.pathname.includes('/pages/') && window.location.pathname.includes('/edit'))
  );

  if (!isCanvasRoute) return null;

  return (
    <SettingGroup title="Canvas Viewport">
      <SettingField
        label="Pan Limit (% visible)"
        type="number"
        value={Math.round(canvasPanLimit * 100)}
        onChange={(value) => setCanvasPanLimit(parseInt(value) / 100)}
        showSlider={true}
        min={10}
        max={100}
        step={10}
      />
      <p
        style={{
          fontSize: '11px',
          color: theme.colors.text.tertiary,
          marginTop: theme.spacing[1],
          lineHeight: 1.4
        }}
      >
        Minimum percentage of the page frame that must remain visible when panning.
        Press <kbd style={{
          padding: '1px 4px',
          background: theme.colors.background.tertiary,
          borderRadius: '3px',
          fontSize: '10px'
        }}>Home</kbd> or <kbd style={{
          padding: '1px 4px',
          background: theme.colors.background.tertiary,
          borderRadius: '3px',
          fontSize: '10px'
        }}>0</kbd> to recenter.
      </p>
    </SettingGroup>
  );
}

export function SettingsPanel() {
  const selectedElements = useEditorStore((state) => state.selectedElements);
  const currentPageKey = useEditorStore((state) => state.currentPageKey);
  const getSelectedElement = useEditorStore((state) => state.getSelectedElement);
  const getSelectedElements = useEditorStore((state) => state.getSelectedElements);
  const updateElement = useEditorStore((state) => state.updateElement);
  const removeElement = useEditorStore((state) => state.removeElement);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const clearSelection = useEditorStore((state) => state.clearSelection);

  const element = getSelectedElement();
  const allSelected = getSelectedElements();
  const isMultiSelection = selectedElements.length > 1;

  const handleUpdate = (updates) => {
    if (selectedElements.length > 0) {
      updateElement(selectedElements[0], updates, currentPageKey);
    }
  };

  const handleDelete = () => {
    if (selectedElements.length === 1 && window.confirm('Delete this element?')) {
      removeElement(selectedElements[0]);
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedElements.length > 1 && window.confirm(`Delete ${selectedElements.length} selected elements?`)) {
      deleteSelected();
    }
  };

  const handleDuplicate = () => {
    duplicateSelected();
  };

  return (
    <div
      className="h-full border-l overflow-y-auto"
      style={{
        width: '320px',
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border.default
      }}
    >
      <div className="p-4">
        {selectedElements.length === 0 ? (
          <PageSettings />
        ) : isMultiSelection ? (
          <>
            {/* Multi-selection UI */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary
                  }}
                >
                  Multiple Elements Selected
                </h2>
                <button
                  onClick={clearSelection}
                  style={{
                    padding: theme.spacing.xs,
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                className="px-3 py-2 rounded"
                style={{
                  backgroundColor: theme.colors.background.tertiary,
                  border: `1px solid ${theme.colors.border.default}`,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary
                }}
              >
                {selectedElements.length} elements selected
              </div>
            </div>

            {/* Element list */}
            <div className="mb-6">
              <h3
                className="font-medium mb-3"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary
                }}
              >
                Selected Elements
              </h3>
              <div className="space-y-2">
                {allSelected.map(({ element, path }, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border.default}`,
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.secondary
                    }}
                  >
                    {element.type}
                    {element.data?.content && (
                      <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.text.tertiary }}>
                        - {element.data.content.substring(0, 20)}
                        {element.data.content.length > 20 ? '...' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk operations */}
            <div className="space-y-3">
              <h3
                className="font-medium mb-3"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary
                }}
              >
                Bulk Actions
              </h3>

              <button
                onClick={handleDuplicate}
                className="w-full py-2 px-4 rounded transition-colors"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  color: '#ffffff',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Duplicate Selected
              </button>

              <button
                onClick={handleDeleteMultiple}
                className="w-full py-2 px-4 rounded transition-colors"
                style={{
                  backgroundColor: theme.colors.error[500],
                  color: '#ffffff',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Delete Selected
              </button>
            </div>
          </>
        ) : element ? (
          <>
            {/* Single element UI */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary
                  }}
                >
                  {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Settings
                </h2>
                <button
                  onClick={clearSelection}
                  style={{
                    padding: theme.spacing.xs,
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                className="px-2 py-1 rounded inline-block"
                style={{
                  backgroundColor: theme.colors.surface,
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary
                }}
              >
                {element.type}
              </div>
            </div>

            {/* Settings based on element type */}
            {element.type === 'markup' && (
              <MarkupSettings element={element} onUpdate={handleUpdate} />
            )}
            {element.type === 'field' && (
              <FieldSettings element={element} onUpdate={handleUpdate} />
            )}
            {element.type === 'structure' && (
              <StructureSettings element={element} onUpdate={handleUpdate} />
            )}
            {element.type === 'record' && (
              <RecordSettings element={element} onUpdate={handleUpdate} />
            )}
            {element.type === 'spotify-player' && (
              <SpotifyPlayerSettings element={element} onUpdate={handleUpdate} />
            )}
            {element.type === 'analog-clock' && (
              <AnalogClockSettings element={element} onUpdate={handleUpdate} />
            )}
            {!['markup', 'field', 'structure', 'record', 'spotify-player', 'analog-clock'].includes(element.type) && (
              <GenericSettings element={element} onUpdate={handleUpdate} />
            )}

            {/* Delete button */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
              <button
                onClick={handleDelete}
                className="w-full py-2 px-4 rounded transition-colors"
                style={{
                  backgroundColor: theme.colors.error[500],
                  color: '#ffffff',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium
                }}
              >
                Delete Element
              </button>
            </div>
          </>
        ) : (
          <PageSettings />
        )}
      </div>
    </div>
  );
}
