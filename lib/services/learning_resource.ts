import { LearningResourceRepository } from '@/lib/repositories/dc_interface';
import { learningResourceRepository } from '@/lib/repositories/dc_repo';
import {
  CreateLearningResourceInput,
  UpdateLearningResourceInput,
} from '@/lib/domain/domain_core';

export class LearningResourceService {
  constructor(private readonly repository: LearningResourceRepository) {}

  async createLearningResource(data: CreateLearningResourceInput) {
    const existing = await this.repository.findByUrl(data.url);
    if (existing) {
      throw new Error('Learning resource with this URL already exists');
    }
    return await this.repository.create(data);
  }

  async getLearningResourceById(id: string) {
    const resource = await this.repository.findById(id);
    if (!resource) {
      throw new Error('Learning resource not found');
    }
    return resource;
  }

  async getLearningResourceByUrl(url: string) {
    return await this.repository.findByUrl(url);
  }

  async getAllLearningResources() {
    return await this.repository.findAll();
  }

  async updateLearningResource(id: string, data: UpdateLearningResourceInput) {
    await this.getLearningResourceById(id);
    return await this.repository.update(id, data);
  }

  async deleteLearningResource(id: string) {
    await this.getLearningResourceById(id);
    await this.repository.delete(id);
  }
}

export const learningResourceService = new LearningResourceService(learningResourceRepository);
