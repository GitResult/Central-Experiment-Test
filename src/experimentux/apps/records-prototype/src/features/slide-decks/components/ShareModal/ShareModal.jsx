import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * ShareModal Component
 *
 * Modal for sharing decks with view/edit permissions.
 * Inherits Central's permission model.
 * Permissions: Owner, Editor, Viewer
 *
 * Props:
 * - isOpen: boolean - Whether modal is visible
 * - deckId: string - ID of deck being shared
 * - currentPermissions: array - Current permission entries
 * - onClose: function - Callback when modal closes
 * - onSave: function - Callback when permissions are saved
 */
export function ShareModal({ isOpen, deckId, currentPermissions = [], onClose, onSave }) {
  const [permissions, setPermissions] = useState(currentPermissions);
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');

  const ROLES = [
    { value: 'owner', label: 'Owner', description: 'Full control, can delete' },
    { value: 'editor', label: 'Editor', description: 'Can edit content' },
    { value: 'viewer', label: 'Viewer', description: 'Can only view' }
  ];

  const handleAddUser = () => {
    const email = emailInput.trim();
    if (!email) return;

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check if user already has permission
    if (permissions.some(p => p.email === email)) {
      alert('User already has access');
      return;
    }

    const newPermission = {
      id: `perm_${Date.now()}`,
      email,
      role: selectedRole,
      addedAt: new Date().toISOString()
    };

    setPermissions([...permissions, newPermission]);
    setEmailInput('');

    trackEvent(SLIDE_DECK_EVENTS.USER_ADDED, {
      deckId,
      role: selectedRole
    });
  };

  const handleRemoveUser = (permissionId) => {
    setPermissions(permissions.filter(p => p.id !== permissionId));
    trackEvent(SLIDE_DECK_EVENTS.USER_REMOVED, { deckId, permissionId });
  };

  const handleChangeRole = (permissionId, newRole) => {
    setPermissions(
      permissions.map(p =>
        p.id === permissionId ? { ...p, role: newRole } : p
      )
    );
    trackEvent(SLIDE_DECK_EVENTS.PERMISSION_CHANGED, {
      deckId,
      permissionId,
      newRole
    });
  };

  const handleSave = () => {
    onSave(permissions);
    trackEvent(SLIDE_DECK_EVENTS.DECK_SHARED, {
      deckId,
      userCount: permissions.length
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Share Deck</h2>
            <p className="text-sm text-gray-500 mt-1">Manage who can access this deck</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Add User Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add people
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Current Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              People with access
            </label>
            <div className="space-y-2">
              {permissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="text-sm">No one has access yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add people using the form above</p>
                </div>
              ) : (
                permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {permission.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{permission.email}</div>
                        <div className="text-xs text-gray-500">
                          {ROLES.find(r => r.value === permission.role)?.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={permission.role}
                        onChange={(e) => handleChangeRole(permission.id, e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveUser(permission.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        aria-label="Remove user"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

ShareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  deckId: PropTypes.string.isRequired,
  currentPermissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.oneOf(['owner', 'editor', 'viewer']).isRequired,
      addedAt: PropTypes.string
    })
  ),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};
