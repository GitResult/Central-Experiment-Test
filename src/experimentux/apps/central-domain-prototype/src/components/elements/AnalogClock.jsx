/**
 * AnalogClock - Elegant Apple-inspired minimalist analog clock with date and timezone support
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { theme } from '../../config/theme';
import 'leaflet/dist/leaflet.css';

// Canadian time zones with geographic coordinates
const CANADIAN_TIMEZONES = [
  { value: 'America/St_Johns', label: 'Newfoundland', abbreviation: 'NST', coords: [47.5615, -52.7126], position: { left: '88%', top: '20%' } },
  { value: 'America/Halifax', label: 'Atlantic', abbreviation: 'AST', coords: [44.6488, -63.5752], position: { left: '78%', top: '40%' } },
  { value: 'America/Toronto', label: 'Eastern', abbreviation: 'EST', coords: [43.6532, -79.3832], position: { left: '60%', top: '30%' } },
  { value: 'America/Winnipeg', label: 'Central', abbreviation: 'CST', coords: [49.8951, -97.1384], position: { left: '40%', top: '25%' } },
  { value: 'America/Edmonton', label: 'Mountain', abbreviation: 'MST', coords: [53.5461, -113.4938], position: { left: '22%', top: '30%' } },
  { value: 'America/Vancouver', label: 'Pacific', abbreviation: 'PST', coords: [49.2827, -123.1207], position: { left: '5%', top: '35%' } }
];

// Single clock component
function SingleClock({ time, timeZone, showDate, showSeconds, size, appearance, label }) {
  const center = size / 2;
  const radius = (size / 2) - 20;

  // Get time in specified timezone
  const getTimeInZone = () => {
    if (timeZone === 'local' || !timeZone) {
      return time;
    }

    // Create a date string in the target timezone
    const options = {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    };

    const timeString = time.toLocaleString('en-US', options);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const zonedTime = new Date(time);
    zonedTime.setHours(hours, minutes, seconds);

    return zonedTime;
  };

  const zonedTime = getTimeInZone();
  const seconds = zonedTime.getSeconds();
  const minutes = zonedTime.getMinutes();
  const hours = zonedTime.getHours() % 12;

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.85;

  const getHandPosition = (angle, length) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x2: center + length * Math.cos(radian),
      y2: center + length * Math.sin(radian)
    };
  };

  const hourHand = getHandPosition(hourAngle, hourHandLength);
  const minuteHand = getHandPosition(minuteAngle, minuteHandLength);
  const secondHand = getHandPosition(secondAngle, secondHandLength);

  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const markerRadius = radius - 10;
    const x = center + markerRadius * Math.cos(angle);
    const y = center + markerRadius * Math.sin(angle);
    return { x, y, hour: i === 0 ? 12 : i };
  });

  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * Math.PI / 180;
    const markerRadius = radius - 5;
    const x = center + markerRadius * Math.cos(angle);
    const y = center + markerRadius * Math.sin(angle);
    return { x, y, index: i };
  });

  const formatDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timeZone !== 'local' ? timeZone : undefined
    };
    return time.toLocaleDateString('en-US', options);
  };

  const formatTime = () => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      timeZone: timeZone !== 'local' ? timeZone : undefined
    };
    return time.toLocaleTimeString('en-US', options);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing[3]
      }}
    >
      {/* Timezone Label */}
      {label && (
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            textAlign: 'center'
          }}
        >
          {label}
        </div>
      )}

      {/* Clock Face */}
      <div style={{ position: 'relative' }}>
        <svg
          width={size}
          height={size}
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.06))'
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={theme.colors.background.secondary}
            stroke={theme.colors.border.medium}
            strokeWidth="2"
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 8}
            fill="none"
            stroke={theme.colors.border.subtle}
            strokeWidth="1"
            opacity="0.5"
          />

          {minuteMarkers.map((marker, i) => {
            if (i % 5 === 0) return null;
            return (
              <circle
                key={`minute-${i}`}
                cx={marker.x}
                cy={marker.y}
                r="1.5"
                fill={theme.colors.border.medium}
              />
            );
          })}

          {hourMarkers.map((marker, i) => (
            <g key={`hour-${i}`}>
              <text
                x={marker.x}
                y={marker.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: size > 150 ? '14px' : '10px',
                  fontWeight: theme.typography.fontWeight.medium,
                  fill: theme.colors.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                {marker.hour}
              </text>
            </g>
          ))}

          <motion.line
            x1={center}
            y1={center}
            x2={hourHand.x2}
            y2={hourHand.y2}
            stroke={theme.colors.text.primary}
            strokeWidth={size > 150 ? '6' : '4'}
            strokeLinecap="round"
          />

          <motion.line
            x1={center}
            y1={center}
            x2={minuteHand.x2}
            y2={minuteHand.y2}
            stroke={theme.colors.text.primary}
            strokeWidth={size > 150 ? '4' : '3'}
            strokeLinecap="round"
          />

          {showSeconds && (
            <motion.line
              x1={center}
              y1={center}
              x2={secondHand.x2}
              y2={secondHand.y2}
              stroke={theme.colors.error[500]}
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          <circle cx={center} cy={center} r={size > 150 ? '8' : '6'} fill={theme.colors.text.primary} />
          <circle cx={center} cy={center} r={size > 150 ? '5' : '4'} fill={theme.colors.background.primary} />
          {showSeconds && (
            <circle cx={center} cy={center} r={size > 150 ? '3' : '2'} fill={theme.colors.error[500]} />
          )}
        </svg>
      </div>

      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            textAlign: 'center',
            letterSpacing: '0.01em',
            padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
            background: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border.subtle}`
          }}
        >
          {formatDate()}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.normal,
          color: theme.colors.text.tertiary,
          fontFamily: theme.typography.fontFamily.mono,
          letterSpacing: '0.05em'
        }}
      >
        {formatTime()}
      </motion.div>
    </div>
  );
}

SingleClock.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  timeZone: PropTypes.string,
  showDate: PropTypes.bool,
  showSeconds: PropTypes.bool,
  size: PropTypes.number.isRequired,
  appearance: PropTypes.object,
  label: PropTypes.string
};

// Main AnalogClock component
export function AnalogClock({ data = {}, settings = {} }) {
  const [time, setTime] = useState(new Date());

  const {
    showDate = true,
    showSeconds = true,
    timeZone = 'local',
    showAllCanadianZones = false
  } = data;

  const {
    appearance = {},
    layout = {}
  } = settings;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const size = parseInt(layout.size) || 240;
  const containerWidth = layout.width || '100%';
  const containerHeight = layout.height || 'auto';

  // Multi-timezone display for all Canadian zones
  if (showAllCanadianZones) {
    const clockSize = parseInt(layout.clockSize) || 120; // Configurable clock size for multi-zone display
    const mapHeight = containerHeight !== 'auto' ? containerHeight : '600px';
    // Force 100% width for multi-timezone display (fit-content doesn't work with absolute positioning)
    const multiTimezoneWidth = (containerWidth === 'fit-content' || !containerWidth) ? '100%' : containerWidth;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: multiTimezoneWidth,
          height: mapHeight,
          minHeight: '600px', // Ensure minimum height
          background: appearance.background || theme.colors.background.primary,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.lg,
          border: `1px solid ${appearance.borderColor || theme.colors.border.subtle}`,
          overflow: 'hidden'
        }}
      >
        {/* Leaflet Map Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
        >
          <MapContainer
            center={[56.1304, -106.3468]} // Center of Canada
            zoom={3}
            style={{ height: mapHeight, width: '100%' }} // Use explicit height
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              opacity={0.3}
            />
          </MapContainer>
        </div>

        {/* Title */}
        <div
          style={{
            position: 'absolute',
            top: theme.spacing[4],
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            textAlign: 'center',
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: `${theme.spacing[2]} ${theme.spacing[6]}`,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md
          }}
        >
          Canadian Time Zones
        </div>

        {/* Clocks positioned geographically */}
        {CANADIAN_TIMEZONES.map((tz) => (
          <div
            key={tz.value}
            style={{
              position: 'absolute',
              ...tz.position,
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
          >
            <SingleClock
              time={time}
              timeZone={tz.value}
              showDate={false}
              showSeconds={showSeconds}
              size={clockSize}
              appearance={appearance}
              label={tz.label}
            />
          </div>
        ))}

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: theme.spacing[4],
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            textAlign: 'center',
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.sm
          }}
        >
          Clocks positioned geographically across Canadian time zones
        </div>
      </motion.div>
    );
  }

  // Single clock display
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing[4],
        padding: theme.spacing[6],
        background: appearance.background || theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${appearance.borderColor || theme.colors.border.subtle}`,
        width: containerWidth,
        height: containerHeight,
        justifyContent: 'center'
      }}
    >
      <SingleClock
        time={time}
        timeZone={timeZone}
        showDate={showDate}
        showSeconds={showSeconds}
        size={size}
        appearance={appearance}
      />
    </motion.div>
  );
}

AnalogClock.propTypes = {
  data: PropTypes.shape({
    showDate: PropTypes.bool,
    showSeconds: PropTypes.bool,
    timeZone: PropTypes.string,
    showAllCanadianZones: PropTypes.bool
  }),
  settings: PropTypes.shape({
    appearance: PropTypes.object,
    layout: PropTypes.object
  })
};

export { CANADIAN_TIMEZONES };
