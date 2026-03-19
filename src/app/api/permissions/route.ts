import { NextRequest, NextResponse } from 'next/server';
import {
  roleDefinitions,
  listUsersByOrganization,
  setUserRole,
  type Role,
  type UserRole,
} from '@/lib/permissions/rbac';

// GET - List roles or users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'roles';
    const organizationId = searchParams.get('organizationId');
    
    if (type === 'roles') {
      // Return role definitions
      const roles = Object.values(roleDefinitions).map(role => ({
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        permissionCount: role.permissions.reduce(
          (acc, p) => acc + p.actions.length,
          0
        ),
      }));
      
      return NextResponse.json({
        success: true,
        data: roles,
      });
    }
    
    if (type === 'users') {
      if (!organizationId) {
        return NextResponse.json(
          { success: false, error: 'organizationId is required' },
          { status: 400 }
        );
      }
      
      const users = listUsersByOrganization(organizationId);
      
      return NextResponse.json({
        success: true,
        data: users,
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in permissions API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update user role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name, role, organizationId, projectIds } = body;
    
    if (!userId || !email || !role || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!roleDefinitions[role as Role]) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    const userRole: UserRole = {
      userId,
      email,
      name: name || email.split('@')[0],
      role: role as Role,
      organizationId,
      projectIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUserRole(userRole);
    
    return NextResponse.json({
      success: true,
      data: userRole,
    });
  } catch (error) {
    console.error('Error creating user role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user role' },
      { status: 500 }
    );
  }
}
