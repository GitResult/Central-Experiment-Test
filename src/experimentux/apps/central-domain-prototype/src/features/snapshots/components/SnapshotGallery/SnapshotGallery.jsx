/**
 * SnapshotGallery
 * Grid view of all snapshots
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Camera, Image as ImageIcon, Grid3x3, List, Square } from 'lucide-react';
import { useSnapshotStore } from '../../../../store/snapshotStore';
import { listSnapshots } from '../../services/snapshotAPI';
import { theme } from '../../../../config/theme';
import { SnapshotPolaroidView } from './SnapshotPolaroidView';

export function SnapshotGallery() {
  const { snapshots, setSnapshots, selectSnapshot, galleryView, setGalleryView, galleryFilters, setGalleryFilters } = useSnapshotStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Load initial snapshots on mount
    async function loadSnapshots() {
      setIsLoading(true);
      try {
        const { snapshots: loadedSnapshots, hasMore: more } = await listSnapshots({
          limit: ITEMS_PER_PAGE,
          offset: 0,
        });
        setSnapshots(loadedSnapshots);
        setHasMore(more || loadedSnapshots.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Failed to load snapshots:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSnapshots();
  }, [setSnapshots]);

  // Load more snapshots
  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { snapshots: newSnapshots, hasMore: more } = await listSnapshots({
        limit: ITEMS_PER_PAGE,
        offset: page * ITEMS_PER_PAGE,
      });

      if (newSnapshots.length > 0) {
        setSnapshots([...snapshots, ...newSnapshots]);
        setPage(page + 1);
        setHasMore(more || newSnapshots.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more snapshots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnapshotClick = (snapshot) => {
    selectSnapshot(snapshot);
    // Navigate to snapshot detail (or open modal)
    window.location.href = `/snapshots/${snapshot.id}`;
  };

  if (snapshots.length === 0) {
    return (
      <div style={{
        padding: theme.spacing[8],
        textAlign: 'center',
        color: theme.colors.text.tertiary,
      }}>
        <Camera size={48} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
        <p style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing[2] }}>
          No snapshots yet
        </p>
        <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
          Press <kbd>Cmd/Ctrl + Shift + S</kbd> to create your first snapshot
        </p>
      </div>
    );
  }

  // Filter snapshots based on filters and search
  const filteredSnapshots = snapshots.filter((snapshot) => {
    // Filter by module
    if (galleryFilters.module && snapshot.sourceContext.module !== galleryFilters.module) {
      return false;
    }

    // Filter by creator
    if (galleryFilters.creator && snapshot.createdBy !== galleryFilters.creator) {
      return false;
    }

    // Filter by search query (searches discussion content)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const hasMatchingDiscussion = snapshot.discussions?.some((discussion) =>
        discussion.content.toLowerCase().includes(query)
      );
      const matchesMetadata =
        snapshot.sourceContext.module?.toLowerCase().includes(query) ||
        new Date(snapshot.createdAt).toLocaleString().toLowerCase().includes(query);

      if (!hasMatchingDiscussion && !matchesMetadata) {
        return false;
      }
    }

    return true;
  });

  return (
    <div style={{ padding: theme.spacing[6] }}>
      {/* Header */}
      <div style={{
        marginBottom: theme.spacing[6],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          margin: 0,
        }}>
          Snapshots
        </h1>
        <span style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
        }}>
          {filteredSnapshots.length} of {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search and Filters */}
      <div style={{
        marginBottom: theme.spacing[4],
        display: 'flex',
        gap: theme.spacing[3],
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search discussions and metadata..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1 1 300px',
            padding: '10px 16px',
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border.default}`,
            fontSize: theme.typography.fontSize.sm,
            backgroundColor: theme.colors.background.primary,
          }}
        />

        {/* Module Filter */}
        <select
          value={galleryFilters.module || ''}
          onChange={(e) => setGalleryFilters({ ...galleryFilters, module: e.target.value || null })}
          style={{
            padding: '10px 16px',
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border.default}`,
            fontSize: theme.typography.fontSize.sm,
            backgroundColor: theme.colors.background.primary,
          }}
        >
          <option value="">All Modules</option>
          <option value="general">General</option>
          <option value="contacts">Contacts</option>
          <option value="tasks">Tasks</option>
          <option value="help5">Help5</option>
        </select>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginLeft: 'auto',
        }}>
          <ViewToggleButton
            icon={Grid3x3}
            label="Grid"
            isActive={galleryView === 'grid'}
            onClick={() => setGalleryView('grid')}
          />
          <ViewToggleButton
            icon={List}
            label="List"
            isActive={galleryView === 'list'}
            onClick={() => setGalleryView('list')}
          />
          <ViewToggleButton
            icon={Square}
            label="Polaroid"
            isActive={galleryView === 'polaroid'}
            onClick={() => setGalleryView('polaroid')}
          />
        </div>
      </div>

      {/* Snapshot Views */}
      {galleryView === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: theme.spacing[4],
        }}>
          {filteredSnapshots.map((snapshot) => (
            <SnapshotCard
              key={snapshot.id}
              snapshot={snapshot}
              onClick={() => handleSnapshotClick(snapshot)}
            />
          ))}
        </div>
      )}

      {galleryView === 'list' && (
        <SnapshotListView
          snapshots={filteredSnapshots}
          onSnapshotClick={handleSnapshotClick}
        />
      )}

      {galleryView === 'polaroid' && (
        <SnapshotPolaroidView
          snapshots={filteredSnapshots}
          onSnapshotClick={handleSnapshotClick}
        />
      )}

      {filteredSnapshots.length === 0 && snapshots.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: theme.spacing[8],
          color: theme.colors.text.tertiary,
        }}>
          <p>No snapshots match your filters</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && filteredSnapshots.length > 0 && (
        <div style={{
          marginTop: theme.spacing[6],
          textAlign: 'center',
        }}>
          <button
            onClick={loadMore}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.default}`,
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: `all ${theme.transitions.fast}`,
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background.primary;
            }}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

function SnapshotCard({ snapshot, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.primary,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`,
        ':hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '100%',
        height: '160px',
        backgroundColor: theme.colors.background.secondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
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

      {/* Info */}
      <div style={{ padding: theme.spacing[4] }}>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing[1],
        }}>
          {new Date(snapshot.createdAt).toLocaleString()}
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary,
        }}>
          {snapshot.sourceContext.module || 'General'} • {Math.round(snapshot.metadata.fileSize / 1024)}KB
        </div>
      </div>
    </div>
  );
}

SnapshotCard.propTypes = {
  snapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    sourceContext: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// View Toggle Button Component
function ViewToggleButton({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        padding: '8px 12px',
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${isActive ? theme.colors.primary[500] : theme.colors.border.default}`,
        backgroundColor: isActive ? theme.colors.primary[50] : theme.colors.background.primary,
        color: isActive ? theme.colors.primary[500] : theme.colors.text.secondary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[1],
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        transition: `all ${theme.transitions.fast}`,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = theme.colors.background.primary;
        }
      }}
    >
      <Icon size={16} />
    </button>
  );
}

ViewToggleButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

// List View Component
function SnapshotListView({ snapshots, onSnapshotClick }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
    }}>
      {snapshots.map((snapshot) => (
        <SnapshotListItem
          key={snapshot.id}
          snapshot={snapshot}
          onClick={() => onSnapshotClick(snapshot)}
        />
      ))}
    </div>
  );
}

SnapshotListView.propTypes = {
  snapshots: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSnapshotClick: PropTypes.func.isRequired,
};

// List Item Component
function SnapshotListItem({ snapshot, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[3],
        padding: theme.spacing[3],
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.primary,
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.background.primary;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '80px',
        height: '60px',
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.background.secondary,
        overflow: 'hidden',
        flexShrink: 0,
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
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImageIcon size={24} style={{ color: theme.colors.text.tertiary }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing[1],
        }}>
          {new Date(snapshot.createdAt).toLocaleString()}
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.secondary,
        }}>
          {snapshot.sourceContext.module || 'General'} • {Math.round(snapshot.metadata.fileSize / 1024)}KB
        </div>
      </div>

      {/* Discussion Count (if available) */}
      {snapshot.discussions && snapshot.discussions.length > 0 && (
        <div style={{
          padding: '4px 12px',
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary[50],
          color: theme.colors.primary[500],
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          {snapshot.discussions.length} discussion{snapshot.discussions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

SnapshotListItem.propTypes = {
  snapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    sourceContext: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    discussions: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
