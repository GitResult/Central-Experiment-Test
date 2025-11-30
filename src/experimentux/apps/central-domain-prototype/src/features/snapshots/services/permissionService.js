/**
 * Permission Service (Simplified for Prototype)
 * In production, this would integrate with Central's full RBAC engine
 */

// Mock current user (in production, get from auth context)
const getCurrentUser = () => ({
  id: 'user_1',
  name: 'Current User',
  role: 'admin', // admin | user | viewer
  email: 'user@example.com',
});

/**
 * Check if user can view snapshot
 * @param {Object} snapshot - Snapshot object
 * @param {Object} user - User object (optional, defaults to current user)
 * @returns {boolean} - True if user has view permission
 */
export function canViewSnapshot(snapshot, user = null) {
  const currentUser = user || getCurrentUser();

  // In prototype: all authenticated users can view their own snapshots
  // In production: check snapshot.permissions.canView array
  if (snapshot.createdBy === currentUser.id) {
    return true;
  }

  // Admins can view all snapshots
  if (currentUser.role === 'admin') {
    return true;
  }

  // Check explicit permissions (if implemented)
  if (snapshot.permissions?.canView) {
    return (
      snapshot.permissions.canView.includes(currentUser.id) ||
      snapshot.permissions.canView.includes(`role_${currentUser.role}`)
    );
  }

  // Default: allow view (prototype behavior)
  return true;
}

/**
 * Check if user can edit snapshot (add markup, edit metadata)
 * @param {Object} snapshot - Snapshot object
 * @param {Object} user - User object (optional)
 * @returns {boolean} - True if user has edit permission
 */
export function canEditSnapshot(snapshot, user = null) {
  const currentUser = user || getCurrentUser();

  // Creator can edit
  if (snapshot.createdBy === currentUser.id) {
    return true;
  }

  // Admins can edit
  if (currentUser.role === 'admin') {
    return true;
  }

  // Check explicit permissions
  if (snapshot.permissions?.canEdit) {
    return (
      snapshot.permissions.canEdit.includes(currentUser.id) ||
      snapshot.permissions.canEdit.includes(`role_${currentUser.role}`)
    );
  }

  return false;
}

/**
 * Check if user can delete snapshot
 * @param {Object} snapshot - Snapshot object
 * @param {Object} user - User object (optional)
 * @returns {boolean} - True if user has delete permission
 */
export function canDeleteSnapshot(snapshot, user = null) {
  const currentUser = user || getCurrentUser();

  // Only creator and admins can delete
  if (snapshot.createdBy === currentUser.id || currentUser.role === 'admin') {
    return true;
  }

  return false;
}

/**
 * Inherit permissions from source record
 * @param {Object} sourceRecord - Source record (page, contact, task, etc.)
 * @returns {Object} - Permission object for snapshot
 */
export function inheritPermissions(sourceRecord) {
  const currentUser = getCurrentUser();

  // In prototype: simple inheritance
  // In production: query source record's full permission tree
  return {
    canView: [
      currentUser.id,
      'role_admin',
      'role_user',
      ...(sourceRecord?.permissions?.canView || []),
    ],
    canEdit: [
      currentUser.id,
      'role_admin',
      ...(sourceRecord?.permissions?.canEdit || []),
    ],
    canDelete: [
      currentUser.id,
      'role_admin',
    ],
  };
}

/**
 * Check permissions for source context
 * @param {Object} sourceContext - Source context from snapshot
 * @returns {Object} - Permission check result
 */
export function checkSourcePermissions(sourceContext) {
  // In prototype: always return true (assume user has access)
  // In production: query backend for source record permissions
  return {
    canViewSource: true,
    canEditSource: false,
    sourceExists: true,
  };
}

/**
 * Get permission display info for UI
 * @param {Object} snapshot - Snapshot object
 * @returns {Object} - Display info for permission badges/labels
 */
export function getPermissionInfo(snapshot) {
  const currentUser = getCurrentUser();

  return {
    isOwner: snapshot.createdBy === currentUser.id,
    canView: canViewSnapshot(snapshot),
    canEdit: canEditSnapshot(snapshot),
    canDelete: canDeleteSnapshot(snapshot),
    permissionLevel: snapshot.createdBy === currentUser.id
      ? 'Owner'
      : currentUser.role === 'admin'
      ? 'Admin'
      : 'Viewer',
  };
}
