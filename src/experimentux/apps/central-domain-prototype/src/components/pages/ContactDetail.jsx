/**
 * ContactDetail Component
 * 3-column layout for contact detail view (HubSpot CRM-style)
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useEditorStore } from '../../store/editorStore';
import { ElementWrapper } from '../editor/ElementWrapper';
import { useEditablePage } from '../../utils/makePageEditable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { theme } from '../../config/theme';

export function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = useDataStore((state) => state.getContactById(id));
  const addRecentlyViewed = useDataStore((state) => state.addRecentlyViewed);
  const updateContact = useDataStore((state) => state.updateContact);
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const addElement = useEditorStore((state) => state.addElement);
  const { renderDropZone, renderUserElements } = useEditablePage(`contact-detail-${id}`, contact?.name || 'Contact');

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);

  // Sortable items for right column only (left and center are single items)
  const [rightColumnItems, setRightColumnItems] = useState([
    'contact-detail-0-2-0', // Quick Actions
    'contact-detail-0-2-1'  // Associated Records
  ]);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dropping a palette element
    if (active.data.current?.type === 'palette-element') {
      const elementType = active.data.current.elementType;
      const elementSubtype = active.data.current.elementSubtype;
      const dropData = over.data.current;

      if (dropData) {
        const newElement = {
          type: elementType,
          subtype: elementSubtype,
          data: active.data.current.defaultData || {},
          settings: active.data.current.defaultSettings || {}
        };

        if (elementType === 'structure') {
          newElement.elements = active.data.current.elements || [];
        }

        addElement(dropData.zoneId, dropData.rowIndex, dropData.columnIndex, newElement, `contact-detail-${id}`);
      }
      return;
    }

    // Handle reordering existing hardcoded elements
    if (active.id === over.id) {
      return;
    }

    const oldIndex = rightColumnItems.indexOf(active.id);
    const newIndex = rightColumnItems.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setRightColumnItems(arrayMove(rightColumnItems, oldIndex, newIndex));
    }
  };

  // Track as recently viewed
  useEffect(() => {
    if (contact) {
      addRecentlyViewed({
        type: 'contact',
        id: contact.id,
        name: contact.name,
        company: contact.company
      });
    }
  }, [contact, addRecentlyViewed]);

  if (!contact) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p style={{ color: theme.colors.text.secondary }}>Contact not found</p>
        <Link to="/contacts" style={{ color: theme.colors.primary }}>
          Back to Contacts
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    updateContact(id, editedContact);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  // Render right column component by ID
  const renderRightColumnComponent = (itemId) => {
    if (itemId === 'contact-detail-0-2-0') {
      // Quick Actions panel
      return (
        <div
          className="rounded-lg border p-4 mb-4"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            borderRadius: theme.borderRadius.lg
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.semibold
            }}
          >
            Quick Actions
          </h3>
          <div className="space-y-2">
            <ActionButton label="Send Email" icon="✉️" />
            <ActionButton label="Schedule Call" icon="📞" />
            <ActionButton label="Add Task" icon="✅" />
            <ActionButton label="Create Note" icon="📝" />
          </div>
        </div>
      );
    } else if (itemId === 'contact-detail-0-2-1') {
      // Associated Records panel
      return (
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            borderRadius: theme.borderRadius.lg
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.semibold
            }}
          >
            Associated Records
          </h3>
          <p
            className="text-sm"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary
            }}
          >
            No associated records
          </p>
        </div>
      );
    }
  };

  const getPathFromId = (id) => {
    const parts = id.split('-');
    return {
      zoneId: `${parts[0]}-${parts[1]}`,
      rowIndex: parseInt(parts[2]),
      columnIndex: parseInt(parts[3]),
      elementIndex: parseInt(parts[4])
    };
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-7xl mx-auto p-6">
      {/* Back button */}
      <Link
        to="/contacts"
        className="inline-flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
        style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary
        }}
      >
        <span>←</span> Back to Contacts
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.inverse,
              fontSize: theme.typography.fontSize['2xl']
            }}
          >
            {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h1
              className="font-bold"
              style={{
                fontSize: theme.typography.fontSize['3xl'],
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold
              }}
            >
              {contact.name}
            </h1>
            <p
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary
              }}
            >
              {contact.role} at {contact.company}
            </p>
          </div>
        </div>

        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.inverse,
            fontSize: theme.typography.fontSize.sm
          }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar (About) */}
        <div className="col-span-12 lg:col-span-3">
          {sidebarOpen ? (
            <ElementWrapper elementPath={{ zoneId: 'contact-detail', rowIndex: 0, columnIndex: 0, elementIndex: 0 }}>
              <div
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  borderRadius: theme.borderRadius.lg
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold
                  }}
                >
                  About
                </h3>

                <div className="space-y-3">
                  <InfoField
                    label="Email"
                    value={isEditing ? editedContact.email : contact.email}
                    isEditing={isEditing}
                    onChange={(value) => setEditedContact({ ...editedContact, email: value })}
                  />
                  <InfoField
                    label="Phone"
                    value={isEditing ? editedContact.phone : contact.phone}
                    isEditing={isEditing}
                    onChange={(value) => setEditedContact({ ...editedContact, phone: value })}
                  />
                  <InfoField
                    label="Company"
                    value={isEditing ? editedContact.company : contact.company}
                    isEditing={isEditing}
                    onChange={(value) => setEditedContact({ ...editedContact, company: value })}
                  />
                  <InfoField
                    label="Role"
                    value={isEditing ? editedContact.role : contact.role}
                    isEditing={isEditing}
                    onChange={(value) => setEditedContact({ ...editedContact, role: value })}
                  />

                  {/* Tags */}
                  <div>
                    <p
                      className="text-xs mb-2"
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary
                      }}
                    >
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: theme.colors.surface,
                            color: theme.colors.text.secondary,
                            fontSize: theme.typography.fontSize.xs
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="mt-4 w-full px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </ElementWrapper>
          ) : (
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                borderRadius: theme.borderRadius.lg
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.semibold
                }}
              >
                About
              </h3>

              <div className="space-y-3">
                <InfoField
                  label="Email"
                  value={isEditing ? editedContact.email : contact.email}
                  isEditing={isEditing}
                  onChange={(value) => setEditedContact({ ...editedContact, email: value })}
                />
                <InfoField
                  label="Phone"
                  value={isEditing ? editedContact.phone : contact.phone}
                  isEditing={isEditing}
                  onChange={(value) => setEditedContact({ ...editedContact, phone: value })}
                />
                <InfoField
                  label="Company"
                  value={isEditing ? editedContact.company : contact.company}
                  isEditing={isEditing}
                  onChange={(value) => setEditedContact({ ...editedContact, company: value })}
                />
                <InfoField
                  label="Role"
                  value={isEditing ? editedContact.role : contact.role}
                  isEditing={isEditing}
                  onChange={(value) => setEditedContact({ ...editedContact, role: value })}
                />

                {/* Tags */}
                <div>
                  <p
                    className="text-xs mb-2"
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary
                    }}
                  >
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text.secondary,
                          fontSize: theme.typography.fontSize.xs
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleCancel}
                  className="mt-4 w-full px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: theme.colors.border.default,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center Content (Tabs) */}
        <div className="col-span-12 lg:col-span-6">
          {sidebarOpen ? (
            <ElementWrapper elementPath={{ zoneId: 'contact-detail', rowIndex: 0, columnIndex: 1, elementIndex: 0 }}>
              <div>
                {/* Tabs */}
                <div className="flex gap-4 mb-4 border-b" style={{ borderColor: theme.colors.border.default }}>
                  <TabButton
                    label="Overview"
                    isActive={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                  />
                  <TabButton
                    label="Activity"
                    isActive={activeTab === 'activity'}
                    onClick={() => setActiveTab('activity')}
                  />
                  <TabButton
                    label="Emails"
                    isActive={activeTab === 'emails'}
                    onClick={() => setActiveTab('emails')}
                  />
                </div>

                {/* Tab Content */}
                <div
                  className="rounded-lg border p-6"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border.default,
                    borderRadius: theme.borderRadius.lg,
                    minHeight: '400px'
                  }}
                >
                  {activeTab === 'overview' && (
                    <div>
                      <h3
                        className="font-semibold mb-4"
                        style={{
                          fontSize: theme.typography.fontSize.lg,
                          color: theme.colors.text.primary,
                          fontWeight: theme.typography.fontWeight.semibold
                        }}
                      >
                        Contact Overview
                      </h3>
                      <p style={{ color: theme.colors.text.secondary }}>
                        Contact information and details will appear here.
                      </p>
                    </div>
                  )}
                  {activeTab === 'activity' && (
                    <div>
                      <h3
                        className="font-semibold mb-4"
                        style={{
                          fontSize: theme.typography.fontSize.lg,
                          color: theme.colors.text.primary,
                          fontWeight: theme.typography.fontWeight.semibold
                        }}
                      >
                        Activity Timeline
                      </h3>
                      <p style={{ color: theme.colors.text.secondary }}>
                        Contact activity history will appear here.
                      </p>
                    </div>
                  )}
                  {activeTab === 'emails' && (
                    <div>
                      <h3
                        className="font-semibold mb-4"
                        style={{
                          fontSize: theme.typography.fontSize.lg,
                          color: theme.colors.text.primary,
                          fontWeight: theme.typography.fontWeight.semibold
                        }}
                      >
                        Email History
                      </h3>
                      <p style={{ color: theme.colors.text.secondary }}>
                        Email conversations will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ElementWrapper>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex gap-4 mb-4 border-b" style={{ borderColor: theme.colors.border.default }}>
                <TabButton
                  label="Overview"
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
                <TabButton
                  label="Activity"
                  isActive={activeTab === 'activity'}
                  onClick={() => setActiveTab('activity')}
                />
                <TabButton
                  label="Emails"
                  isActive={activeTab === 'emails'}
                  onClick={() => setActiveTab('emails')}
                />
              </div>

              {/* Tab Content */}
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  borderRadius: theme.borderRadius.lg,
                  minHeight: '400px'
                }}
              >
                {activeTab === 'overview' && (
                  <div>
                    <h3
                      className="font-semibold mb-4"
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        color: theme.colors.text.primary,
                        fontWeight: theme.typography.fontWeight.semibold
                      }}
                    >
                      Contact Overview
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      Contact information and details will appear here.
                    </p>
                  </div>
                )}
                {activeTab === 'activity' && (
                  <div>
                    <h3
                      className="font-semibold mb-4"
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        color: theme.colors.text.primary,
                        fontWeight: theme.typography.fontWeight.semibold
                      }}
                    >
                      Activity Timeline
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      Contact activity history will appear here.
                    </p>
                  </div>
                )}
                {activeTab === 'emails' && (
                  <div>
                    <h3
                      className="font-semibold mb-4"
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        color: theme.colors.text.primary,
                        fontWeight: theme.typography.fontWeight.semibold
                      }}
                    >
                      Email History
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      Email conversations will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Quick Actions) */}
        <div className="col-span-12 lg:col-span-3">
          {sidebarOpen ? (
            <SortableContext items={rightColumnItems} strategy={verticalListSortingStrategy}>
              {rightColumnItems.map((itemId) => (
                <ElementWrapper key={itemId} elementPath={getPathFromId(itemId)}>
                  {renderRightColumnComponent(itemId)}
                </ElementWrapper>
              ))}
            </SortableContext>
          ) : (
            <>
              <div
                className="rounded-lg border p-4 mb-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  borderRadius: theme.borderRadius.lg
                }}
              >
                <h3
                  className="font-semibold mb-3"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold
                  }}
                >
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <ActionButton label="Send Email" icon="✉️" />
                  <ActionButton label="Schedule Call" icon="📞" />
                  <ActionButton label="Add Task" icon="✅" />
                  <ActionButton label="Create Note" icon="📝" />
                </div>
              </div>

              <div
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  borderRadius: theme.borderRadius.lg
                }}
              >
                <h3
                  className="font-semibold mb-3"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold
                  }}
                >
                  Associated Records
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary
                  }}
                >
                  No associated records
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </DndContext>
  );
}

// Subcomponents
function InfoField({ label, value, isEditing, onChange }) {
  return (
    <div>
      <p
        className="text-xs mb-1"
        style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary
        }}
      >
        {label}
      </p>
      {isEditing ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 rounded border"
          style={{
            fontSize: theme.typography.fontSize.sm,
            borderColor: theme.colors.border.default
          }}
        />
      ) : (
        <p
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary
          }}
        >
          {value || '-'}
        </p>
      )}
    </div>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="pb-3 px-1 transition-colors relative"
      style={{
        fontSize: theme.typography.fontSize.sm,
        color: isActive ? theme.colors.primary : theme.colors.text.secondary,
        fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
        borderBottom: isActive ? `2px solid ${theme.colors.primary}` : 'none'
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({ label, icon }) {
  return (
    <button
      className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
      style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
