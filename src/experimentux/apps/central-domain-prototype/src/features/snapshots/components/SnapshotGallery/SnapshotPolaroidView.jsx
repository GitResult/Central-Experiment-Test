/**
 * SnapshotPolaroidView
 * Polaroid-style card view for snapshots with stacking and animations
 */

import { useState } from 'prop-types';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, FolderPlus, X } from 'lucide-react';
import { theme } from '../../../../config/theme';

export function SnapshotPolaroidView({ snapshots, onSnapshotClick }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albums, setAlbums] = useState([
    { id: 'all', name: 'All Snapshots', snapshotIds: snapshots.map(s => s.id) },
  ]);

  // Group snapshots into stacks of 4
  const stacks = [];
  for (let i = 0; i < snapshots.length; i += 4) {
    stacks.push(snapshots.slice(i, i + 4));
  }

  const filteredSnapshots = selectedAlbum
    ? snapshots.filter(s => albums.find(a => a.id === selectedAlbum)?.snapshotIds.includes(s.id))
    : snapshots;

  const handleCreateAlbum = () => {
    const name = prompt('Enter album name:');
    if (!name) return;

    const newAlbum = {
      id: `album_${Date.now()}`,
      name,
      snapshotIds: [],
    };

    setAlbums([...albums, newAlbum]);
  };

  return (
    <div>
      {/* Album Selector */}
      <div style={{
        marginBottom: theme.spacing[4],
        display: 'flex',
        gap: theme.spacing[2],
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbum(album.id === selectedAlbum ? null : album.id)}
            style={{
              padding: '8px 16px',
              borderRadius: theme.borderRadius.full,
              border: `1px solid ${selectedAlbum === album.id ? theme.colors.primary[500] : theme.colors.border.default}`,
              backgroundColor: selectedAlbum === album.id ? theme.colors.primary[50] : theme.colors.background.primary,
              color: selectedAlbum === album.id ? theme.colors.primary[500] : theme.colors.text.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`,
            }}
          >
            {album.name} ({album.snapshotIds.length})
          </button>
        ))}

        <button
          onClick={handleCreateAlbum}
          style={{
            padding: '8px 16px',
            borderRadius: theme.borderRadius.full,
            border: `1px dashed ${theme.colors.border.default}`,
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[1],
            transition: `all ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary[500];
            e.currentTarget.style.color = theme.colors.primary[500];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border.default;
            e.currentTarget.style.color = theme.colors.text.secondary;
          }}
        >
          <FolderPlus size={16} />
          New Album
        </button>
      </div>

      {/* Polaroid Grid with Stacks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing[8],
        padding: theme.spacing[4],
      }}>
        {stacks.map((stack, stackIndex) => (
          <PolaroidStack
            key={stackIndex}
            snapshots={stack}
            stackIndex={stackIndex}
            onSnapshotClick={onSnapshotClick}
          />
        ))}
      </div>
    </div>
  );
}

SnapshotPolaroidView.propTypes = {
  snapshots: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSnapshotClick: PropTypes.func.isRequired,
};

// Polaroid Stack Component
function PolaroidStack({ snapshots, stackIndex, onSnapshotClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedStack, setExpandedStack] = useState(false);

  const handleStackClick = () => {
    if (snapshots.length > 1) {
      setExpandedStack(!expandedStack);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '380px',
        perspective: '1000px',
      }}
      onMouseEnter={() => setHoveredIndex(0)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {snapshots.map((snapshot, index) => (
          <motion.div
            key={snapshot.id}
            initial={{
              opacity: 0,
              scale: 0.8,
              rotateY: -30,
            }}
            animate={{
              opacity: 1,
              scale: expandedStack ? 0.9 : 1,
              rotateY: 0,
              x: expandedStack ? index * 60 : 0,
              y: expandedStack ? index * 20 : index * 4,
              rotate: expandedStack ? index * 3 : index * 2,
              zIndex: hoveredIndex === index ? 100 : snapshots.length - index,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: stackIndex * 0.1 + index * 0.05,
            }}
            whileHover={!expandedStack ? {
              scale: 1.05,
              y: index * 4 - 10,
              rotate: index * 2 + 3,
              zIndex: 100,
            } : {}}
            style={{
              position: 'absolute',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (expandedStack) {
                onSnapshotClick(snapshot);
              } else {
                handleStackClick();
              }
            }}
          >
            <PolaroidCard snapshot={snapshot} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Stack count badge */}
      {snapshots.length > 1 && !expandedStack && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary[500],
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 200,
        }}>
          {snapshots.length}
        </div>
      )}

      {/* Expand/Collapse button */}
      {expandedStack && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedStack(false);
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: theme.colors.background.primary,
            border: `2px solid ${theme.colors.border.default}`,
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 200,
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

PolaroidStack.propTypes = {
  snapshots: PropTypes.arrayOf(PropTypes.object).isRequired,
  stackIndex: PropTypes.number.isRequired,
  onSnapshotClick: PropTypes.func.isRequired,
};

// Polaroid Card Component
function PolaroidCard({ snapshot }) {
  return (
    <div style={{
      width: '280px',
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.md,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      padding: '16px',
    }}>
      {/* Photo */}
      <div style={{
        width: '100%',
        height: '280px',
        backgroundColor: theme.colors.background.secondary,
        marginBottom: '12px',
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {snapshot.thumbnailUrl ? (
          <img
            src={snapshot.thumbnailUrl}
            alt="Snapshot"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <ImageIcon size={48} style={{ color: theme.colors.text.tertiary }} />
        )}
      </div>

      {/* Handwritten caption */}
      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: '18px',
        color: theme.colors.text.secondary,
        textAlign: 'center',
        minHeight: '30px',
      }}>
        {new Date(snapshot.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

PolaroidCard.propTypes = {
  snapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};
