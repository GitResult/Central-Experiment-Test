/**
 * RecordImage Component
 * Responsive image rendering with lazy loading, srcset, and aspect ratios
 * Type: record - image
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';

export const RecordImage = ({ data, settings }) => {
  const { resolveAllTokens, theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Safety check for theme
  if (!theme) {
    return <div>Loading...</div>;
  }

  const resolvedSettings = resolveAllTokens(settings);

  // Extract settings
  const imageSettings = resolvedSettings?.record || {};
  const {
    lazy = true,
    aspectRatio,
    fit = 'cover', // cover, contain, fill, none
    caption,
    rounded = false,
    shadow = false
  } = imageSettings;

  // Extract data
  const {
    src,
    srcset,
    sizes,
    alt = '',
    width,
    height
  } = data || {};

  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          height: aspectRatio ? 'auto' : '200px',
          aspectRatio: aspectRatio || 'auto',
          background: theme.colors.background.tertiary,
          borderRadius: rounded ? theme.borderRadius.lg : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm
        }}
      >
        No image
      </div>
    );
  }

  const imageStyle = {
    width: '100%',
    height: aspectRatio ? 'auto' : (height || 'auto'),
    aspectRatio: aspectRatio || 'auto',
    objectFit: fit,
    borderRadius: rounded ? theme.borderRadius.lg : 0,
    boxShadow: shadow ? theme.shadows.md : 'none',
    transition: theme.transitions.base,
    opacity: isLoaded ? 1 : 0
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: rounded ? theme.borderRadius.lg : 0
  };

  return (
    <motion.figure
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ margin: 0 }}
    >
      <div style={containerStyle}>
        {/* Loading placeholder */}
        {!isLoaded && !hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: theme.colors.background.tertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${theme.colors.border.default}`,
                borderTop: `3px solid ${theme.colors.primary[500]}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div
            style={{
              width: '100%',
              height: aspectRatio ? 'auto' : '200px',
              aspectRatio: aspectRatio || 'auto',
              background: theme.colors.background.tertiary,
              borderRadius: rounded ? theme.borderRadius.lg : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.error[500],
              fontSize: theme.typography.fontSize.sm
            }}
          >
            Failed to load image
          </div>
        )}

        {/* Actual image */}
        {!hasError && (
          <img
            src={src}
            srcSet={srcset}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            style={imageStyle}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(false);
            }}
          />
        )}
      </div>

      {/* Caption */}
      {caption && isLoaded && (
        <figcaption
          style={{
            marginTop: theme.spacing[2],
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            textAlign: 'center',
            lineHeight: theme.typography.lineHeight.relaxed
          }}
        >
          {caption}
        </figcaption>
      )}

      {/* Loading animation CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.figure>
  );
};

RecordImage.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    srcset: PropTypes.string,
    sizes: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  settings: PropTypes.shape({
    record: PropTypes.shape({
      lazy: PropTypes.bool,
      aspectRatio: PropTypes.string,
      fit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none']),
      caption: PropTypes.string,
      rounded: PropTypes.bool,
      shadow: PropTypes.bool
    })
  })
};

export default RecordImage;
