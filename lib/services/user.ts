import { UserRepository } from '@/lib/repositories/dc_interface';
import { userRepository } from '@/lib/repositories/dc_repo';
import {
  CreateUserInput,
  UpdateUserInput,
  UserRole,
} from '@/lib/domain/domain_core';

// Service layer - business logic, uses repository interface
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(data: CreateUserInput) {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Apply default role if not provided (business logic)
    const userData = {
      ...data,
      role: data.role || UserRole.USER,
    };

    return this.repository.create(userData);
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async getAllUsers() {
    return this.repository.findAll();
  }

  async updateUser(id: string, data: UpdateUserInput) {
    await this.getUserById(id);
    return this.repository.update(id, data);
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    await this.repository.delete(id);
  }
}

export const userService = new UserService(userRepository);
