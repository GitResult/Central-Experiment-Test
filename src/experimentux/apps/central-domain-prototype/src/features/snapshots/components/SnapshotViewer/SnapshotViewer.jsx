/**
 * SnapshotViewer
 * Full view of a snapshot with markup and actions
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Edit3, ExternalLink, Trash2, ArrowLeft, MessageSquare, FileDown, Share2, Copy, Check } from 'lucide-react';
import { theme } from '../../../../config/theme';
import { useSnapshotStore } from '../../../../store/snapshotStore';
import { getSnapshot, updateSnapshot, deleteSnapshot } from '../../services/snapshotAPI';
import { MarkupCanvas } from '../MarkupEditor/MarkupCanvas';
import { MarkupRenderer } from '../MarkupEditor/MarkupRenderer';
import { exportSnapshotToPDF } from '../../services/pdfExport';

export function SnapshotViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateSnapshot: updateStoreSnapshot, deleteSnapshot: deleteStoreSnapshot, openDiscussionPanel } = useSnapshotStore();

  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingMarkup, setIsEditingMarkup] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareableLinkCopied, setShareableLinkCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState(null);

  // Load snapshot
  useEffect(() => {
    async function loadSnapshot() {
      try {
        setLoading(true);
        const data = await getSnapshot(id);
        setSnapshot(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadSnapshot();
    }
  }, [id]);

  // Handle markup save
  const handleMarkupSave = async (saveData) => {
    try {
      const updated = await updateSnapshot(id, {
        renderedImageUrl: saveData.imageUrl, // Rendered image with markup burned in (for viewing)
        markup: saveData.markup, // Save markup data for future editing
        updatedAt: new Date().toISOString(),
      });

      setSnapshot(updated);
      updateStoreSnapshot(id, updated);
      setIsEditingMarkup(false);
    } catch (err) {
      console.error('Failed to save markup:', err);
      alert('Failed to save markup: ' + err.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this snapshot?')) return;

    try {
      await deleteSnapshot(id);
      deleteStoreSnapshot(id);
      navigate('/snapshots');
    } catch (err) {
      alert('Failed to delete snapshot: ' + err.message);
    }
  };

  // Handle view source
  const handleViewSource = () => {
    if (snapshot?.sourceContext?.url) {
      navigate(snapshot.sourceContext.url);
    }
  };

  // Handle open discussion
  const handleOpenDiscussion = () => {
    openDiscussionPanel(snapshot);
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      await exportSnapshotToPDF(snapshot);
    } catch (err) {
      alert('Failed to export PDF: ' + err.message);
    }
  };

  // Handle create shareable link
  const handleCreateShareableLink = () => {
    // Generate shareable link with expiration (7 days default)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const linkId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const link = `${window.location.origin}/share/${linkId}`;

    setShareableLink({
      id: linkId,
      url: link,
      expiresAt: expiresAt.toISOString(),
      snapshotId: snapshot.id,
    });

    setShowShareMenu(true);
  };

  // Handle copy shareable link
  const handleCopyLink = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink.url);
      setShareableLinkCopied(true);
      setTimeout(() => setShareableLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: theme.spacing[8],
        textAlign: 'center',
        color: theme.colors.text.secondary,
      }}>
        Loading snapshot...
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div style={{
        padding: theme.spacing[8],
        textAlign: 'center',
        color: theme.colors.error[600],
      }}>
        <p>{error || 'Snapshot not found'}</p>
        <button
          onClick={() => navigate('/snapshots')}
          style={{
            marginTop: theme.spacing[4],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: '#0066FF',
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
          }}
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{
        padding: theme.spacing[6],
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing[6],
        }}>
          <button
            onClick={() => navigate('/snapshots')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              border: 'none',
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </button>

          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <button
              onClick={() => setIsEditingMarkup(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <Edit3 size={16} />
              Edit Markup
            </button>

            <button
              onClick={handleOpenDiscussion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <MessageSquare size={16} />
              Discuss
            </button>

            <button
              onClick={handleExportPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <FileDown size={16} />
              Export PDF
            </button>

            <button
              onClick={handleCreateShareableLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <Share2 size={16} />
              Share
            </button>

            <button
              onClick={handleViewSource}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: '#0066FF',
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <ExternalLink size={16} />
              View Source
            </button>

            <button
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: 'transparent',
                color: theme.colors.error[600],
                border: `1px solid ${theme.colors.error[300]}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Snapshot Info */}
        <div style={{
          marginBottom: theme.spacing[4],
          padding: theme.spacing[4],
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
          }}>
            Captured on {new Date(snapshot.createdAt).toLocaleString()}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            marginTop: theme.spacing[1],
          }}>
            Source: {snapshot.sourceContext.module || 'General'} • {Math.round(snapshot.metadata.fileSize / 1024)}KB
          </div>
        </div>

        {/* Snapshot Image with Markup */}
        <div style={{
          position: 'relative',
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[4],
          border: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          justifyContent: 'center',
        }}>
          {/* Show image (with markup already burned in) when not editing */}
          {!isEditingMarkup && (
            <img
              src={snapshot.renderedImageUrl || snapshot.imageUrl}
              alt="Snapshot"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: theme.borderRadius.md,
              }}
            />
          )}

          {/* Markup Canvas Overlay (when editing) */}
          {isEditingMarkup && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'all',
            }}>
              {/* Placeholder for fabric canvas - will be positioned by MarkupCanvas */}
            </div>
          )}
        </div>
      </div>

      {/* Markup Editor Toolbar (floating at bottom) */}
      {isEditingMarkup && (
        <MarkupCanvas
          imageUrl={snapshot.imageUrl}
          initialMarkup={snapshot.markup || []}
          onSave={handleMarkupSave}
          onCancel={() => setIsEditingMarkup(false)}
        />
      )}

      {/* Share Menu Modal */}
      {showShareMenu && shareableLink && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowShareMenu(false)}
        >
          <div
            style={{
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[6],
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing[4],
            }}>
              <h3 style={{
                margin: 0,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}>
                Share Snapshot
              </h3>
              <button
                onClick={() => setShowShareMenu(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.text.secondary,
                  cursor: 'pointer',
                  padding: theme.spacing[1],
                }}
              >
                ✕
              </button>
            </div>

            <p style={{
              margin: `0 0 ${theme.spacing[4]}`,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
            }}>
              Anyone with this link can view the snapshot. Link expires on{' '}
              {new Date(shareableLink.expiresAt).toLocaleDateString()}.
            </p>

            {/* Shareable Link */}
            <div style={{
              display: 'flex',
              gap: theme.spacing[2],
              marginBottom: theme.spacing[4],
            }}>
              <input
                type="text"
                value={shareableLink.url}
                readOnly
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.default}`,
                  fontSize: theme.typography.fontSize.sm,
                  backgroundColor: theme.colors.background.secondary,
                }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '10px 16px',
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  backgroundColor: shareableLinkCopied ? theme.colors.success[500] : theme.colors.primary[500],
                  color: 'white',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[1],
                  transition: `all ${theme.transitions.fast}`,
                }}
              >
                {shareableLinkCopied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Embed Code */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing[2],
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
              }}>
                Embed Code (iframe)
              </label>
              <textarea
                value={`<iframe src="${shareableLink.url}/embed" width="800" height="600" frameborder="0" allowfullscreen></iframe>`}
                readOnly
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.default}`,
                  fontSize: theme.typography.fontSize.xs,
                  fontFamily: 'monospace',
                  backgroundColor: theme.colors.background.secondary,
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
