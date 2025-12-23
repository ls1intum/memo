'use server';

import { userService } from '@/domain_core/services/user';
import { UserRole } from '@prisma/client';

export async function createUserAction(formData: FormData) {
  try {
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;

    if (!name || !email) {
      return {
        success: false,
        error: 'Name and email are required',
      };
    }

    const user = await userService.createUser({ name, email });

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

export async function getUserAction(id: string) {
  try {
    const user = await userService.getUserById(id);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'User not found',
    };
  }
}

export async function updateUserAction(
  id: string,
  name: string,
  role: UserRole
) {
  try {
    const user = await userService.updateUser(id, { name, role });
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await userService.deleteUser(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}
