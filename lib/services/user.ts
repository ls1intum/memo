import { UserRepository } from '@/lib/repositories/dc_interface';
import { userRepository } from '@/lib/repositories/dc_repo';
import { CreateUserInput, UpdateUserInput } from '@/lib/domain/domain_core';

// Service layer - business logic, uses repository interface
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(data: CreateUserInput) {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    return await this.repository.create(data);
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async getAllUsers() {
    return await this.repository.findAll();
  }

  async updateUser(id: string, data: UpdateUserInput) {
    await this.getUserById(id);
    return await this.repository.update(id, data);
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    await this.repository.delete(id);
  }
}

export const userService = new UserService(userRepository);
