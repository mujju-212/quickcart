// QuickCart Admin — Permissions helper

/**
 * Check if user is admin (hardcoded for now — admin user_id = 1)
 */
export const isAdminUser = (userId?: number | string): boolean => {
  return userId?.toString() === '1';
};

/**
 * Permission checks for various admin actions
 */
export const permissions = {
  canManageOrders: true,
  canManageProducts: true,
  canManageCategories: true,
  canManageOffers: true,
  canManageBanners: true,
  canManageUsers: true,
  canModerateReviews: true,
  canViewReports: true,
  canExportData: true,
  canDeleteProducts: true,
  canCancelOrders: true,
} as const;

export type PermissionKey = keyof typeof permissions;

export const hasPermission = (permission: PermissionKey): boolean => {
  return permissions[permission] ?? false;
};
