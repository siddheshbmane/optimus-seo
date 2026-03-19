// Role-Based Access Control (RBAC) System

export type Role = 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer';

export type Resource = 
  | 'projects'
  | 'keywords'
  | 'backlinks'
  | 'reports'
  | 'agents'
  | 'settings'
  | 'billing'
  | 'team'
  | 'api_keys'
  | 'webhooks'
  | 'exports';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'execute';

export interface Permission {
  resource: Resource;
  actions: Action[];
}

export interface RoleDefinition {
  name: Role;
  displayName: string;
  description: string;
  permissions: Permission[];
  inherits?: Role;
}

// Role hierarchy and permissions
export const roleDefinitions: Record<Role, RoleDefinition> = {
  owner: {
    name: 'owner',
    displayName: 'Owner',
    description: 'Full access to all features and settings',
    permissions: [
      { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'keywords', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'backlinks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'agents', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'billing', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'exports', actions: ['create', 'read', 'update', 'delete'] },
    ],
  },
  
  admin: {
    name: 'admin',
    displayName: 'Admin',
    description: 'Full access except billing and ownership transfer',
    permissions: [
      { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'keywords', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'backlinks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'agents', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'billing', actions: ['read'] },
      { resource: 'team', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'exports', actions: ['create', 'read', 'update', 'delete'] },
    ],
  },
  
  manager: {
    name: 'manager',
    displayName: 'Manager',
    description: 'Manage projects and team members',
    permissions: [
      { resource: 'projects', actions: ['create', 'read', 'update'] },
      { resource: 'keywords', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'backlinks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'agents', actions: ['read', 'execute'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'team', actions: ['read'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update'] },
      { resource: 'exports', actions: ['create', 'read'] },
    ],
  },
  
  analyst: {
    name: 'analyst',
    displayName: 'Analyst',
    description: 'Analyze data and create reports',
    permissions: [
      { resource: 'projects', actions: ['read'] },
      { resource: 'keywords', actions: ['create', 'read', 'update'] },
      { resource: 'backlinks', actions: ['read'] },
      { resource: 'reports', actions: ['create', 'read', 'update'] },
      { resource: 'agents', actions: ['read', 'execute'] },
      { resource: 'exports', actions: ['create', 'read'] },
    ],
  },
  
  viewer: {
    name: 'viewer',
    displayName: 'Viewer',
    description: 'View-only access to data and reports',
    permissions: [
      { resource: 'projects', actions: ['read'] },
      { resource: 'keywords', actions: ['read'] },
      { resource: 'backlinks', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'exports', actions: ['read'] },
    ],
  },
};

// User with role
export interface UserRole {
  userId: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  projectIds?: string[]; // Optional: limit access to specific projects
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
const userRoles: Map<string, UserRole> = new Map();

// Check if user has permission
export function hasPermission(
  userRole: Role,
  resource: Resource,
  action: Action
): boolean {
  const roleDef = roleDefinitions[userRole];
  if (!roleDef) return false;
  
  const permission = roleDef.permissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  return permission.actions.includes(action);
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return roleDefinitions[role]?.permissions || [];
}

// Get user role
export function getUserRole(userId: string): UserRole | undefined {
  return userRoles.get(userId);
}

// Set user role
export function setUserRole(userRole: UserRole): void {
  userRoles.set(userRole.userId, userRole);
}

// List users by organization
export function listUsersByOrganization(organizationId: string): UserRole[] {
  return Array.from(userRoles.values()).filter(
    u => u.organizationId === organizationId
  );
}

// Update user role
export function updateUserRole(
  userId: string,
  updates: Partial<Pick<UserRole, 'role' | 'projectIds'>>
): UserRole | undefined {
  const user = userRoles.get(userId);
  if (!user) return undefined;
  
  Object.assign(user, updates, { updatedAt: new Date().toISOString() });
  return user;
}

// Remove user role
export function removeUserRole(userId: string): boolean {
  return userRoles.delete(userId);
}

// Check if user can access project
export function canAccessProject(
  userId: string,
  projectId: string
): boolean {
  const user = userRoles.get(userId);
  if (!user) return false;
  
  // If no project restrictions, user can access all projects
  if (!user.projectIds || user.projectIds.length === 0) return true;
  
  return user.projectIds.includes(projectId);
}

// Permission check middleware helper
export function createPermissionChecker(userRole: Role) {
  return {
    can: (action: Action, resource: Resource) => hasPermission(userRole, resource, action),
    canCreate: (resource: Resource) => hasPermission(userRole, resource, 'create'),
    canRead: (resource: Resource) => hasPermission(userRole, resource, 'read'),
    canUpdate: (resource: Resource) => hasPermission(userRole, resource, 'update'),
    canDelete: (resource: Resource) => hasPermission(userRole, resource, 'delete'),
    canExecute: (resource: Resource) => hasPermission(userRole, resource, 'execute'),
  };
}

// Initialize with demo data
export function initializeDemoRoles(): void {
  const demoUsers: UserRole[] = [
    {
      userId: 'user-1',
      email: 'owner@example.com',
      name: 'John Owner',
      role: 'owner',
      organizationId: 'org-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-2',
      email: 'admin@example.com',
      name: 'Jane Admin',
      role: 'admin',
      organizationId: 'org-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-3',
      email: 'analyst@example.com',
      name: 'Bob Analyst',
      role: 'analyst',
      organizationId: 'org-1',
      projectIds: ['project-1', 'project-2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  demoUsers.forEach(user => userRoles.set(user.userId, user));
}

// Initialize demo data
initializeDemoRoles();
