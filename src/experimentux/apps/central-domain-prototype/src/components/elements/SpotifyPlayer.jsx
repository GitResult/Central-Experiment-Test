/**
 * SpotifyPlayer - Apple-inspired minimalist Spotify embed player
 */

import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { theme } from '../../config/theme';
import { useEditorStore } from '../../store/editorStore';

export function SpotifyPlayer({ data = {}, settings = {} }) {
  const mode = useEditorStore((state) => state.mode);

  const {
    spotifyUrl = '',
    type = 'track', // track, album, playlist, artist, episode, show
    height = 352
  } = data;

  const {
    appearance = {},
    layout = {}
  } = settings;

  // Extract Spotify ID from URL or use direct ID
  const getSpotifyId = (url) => {
    if (!url) return null;

    // Handle full Spotify URLs
    const urlMatch = url.match(/spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/);
    if (urlMatch) return urlMatch[2];

    // Handle Spotify URIs
    const uriMatch = url.match(/spotify:(track|album|playlist|artist|episode|show):([a-zA-Z0-9]+)/);
    if (uriMatch) return uriMatch[2];

    // Assume it's already an ID
    return url;
  };

  const spotifyId = getSpotifyId(spotifyUrl);
  const embedUrl = spotifyId
    ? `https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`
    : null;

  // Placeholder when no URL is set
  if (!embedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: layout.width || '100%',
          height: `${height}px`,
          background: `linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.neutral[100]} 100%)`,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.subtle}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[3],
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            background: theme.colors.background.secondary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows.md
          }}
        >
          <Music
            size={40}
            style={{
              color: theme.colors.text.tertiary,
              strokeWidth: 1.5
            }}
          />
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            textAlign: 'center'
          }}
        >
          Add a Spotify URL
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.tertiary,
            textAlign: 'center',
            maxWidth: '280px'
          }}
        >
          Paste a link to a track, album, playlist, or podcast
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: layout.width || '100%',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        boxShadow: theme.shadows.md,
        border: `1px solid ${appearance.borderColor || theme.colors.border.subtle}`,
        background: appearance.background || theme.colors.background.primary,
        position: 'relative'
      }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{
          display: 'block',
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden'
        }}
        title="Spotify Player"
        scrolling="no"
      />
      {/* Clickable overlay in edit mode - only when not hovering over controls */}
      {mode === 'edit' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: '80px', // Leave bottom 80px for Spotify controls
            cursor: 'pointer',
            zIndex: 1
          }}
          title="Click to edit settings"
        />
      )}
    </motion.div>
  );
}

SpotifyPlayer.propTypes = {
  data: PropTypes.shape({
    spotifyUrl: PropTypes.string,
    type: PropTypes.oneOf(['track', 'album', 'playlist', 'artist', 'episode', 'show']),
    height: PropTypes.number
  }),
  settings: PropTypes.shape({
    appearance: PropTypes.object,
    layout: PropTypes.object
  })
};
