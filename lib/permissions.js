// Role-based permissions configuration
export const PERMISSIONS = {
  super_admin: ['view', 'edit', 'delete', 'upload', 'export', 'manage_users', 'view_logs'],
  admin: ['view', 'edit', 'delete', 'upload', 'export'],
  viewer: ['view']
};

export const hasPermission = (userRole, action) => {
  if (!userRole || !action) return false;
  return PERMISSIONS[userRole]?.includes(action) || false;
};

export const canManageUsers = (role) => hasPermission(role, 'manage_users');
export const canEdit = (role) => hasPermission(role, 'edit');
export const canDelete = (role) => hasPermission(role, 'delete');
export const canUpload = (role) => hasPermission(role, 'upload');
export const canExport = (role) => hasPermission(role, 'export');

// Role display configuration
export const ROLE_CONFIG = {
  super_admin: {
    label: 'Super Admin',
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-gradient-to-r from-red-500 to-orange-600',
    textColor: 'text-white'
  },
  admin: {
    label: 'Admin',
    color: 'from-[#003c7a] to-[#0056a8]',
    bgColor: 'bg-gradient-to-r from-[#003c7a] to-[#0056a8]',
    textColor: 'text-white'
  },
  viewer: {
    label: 'Viewer',
    color: 'from-gray-400 to-slate-500',
    bgColor: 'bg-gradient-to-r from-gray-400 to-slate-500',
    textColor: 'text-white'
  }
};

export const getRoleConfig = (role) => ROLE_CONFIG[role] || ROLE_CONFIG.viewer;

// Check if user can perform action on specific resource
export const canPerformAction = (userRole, action, resourceOwnerId = null, userId = null) => {
  // Super admin can do anything
  if (userRole === 'super_admin') return true;
  
  // Check basic permission
  if (!hasPermission(userRole, action)) return false;
  
  // Additional resource-level checks can be added here
  return true;
};
