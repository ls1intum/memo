import { LearningResourceRepository } from '@/domain_core/repositories/dc_interface';
import { learningResourceRepository } from '@/domain_core/repositories/dc_repo';
import {
  CreateLearningResourceInput,
  UpdateLearningResourceInput,
} from '@/domain_core/model/domain_model';

export class LearningResourceService {
  constructor(private readonly repository: LearningResourceRepository) {}

  async createLearningResource(data: CreateLearningResourceInput) {
    const existing = await this.repository.findByUrl(data.url);
    if (existing) {
      throw new Error('Learning resource with this URL already exists');
    }
    return this.repository.create(data);
  }

  async getLearningResourceById(id: string) {
    const resource = await this.repository.findById(id);
    if (!resource) {
      throw new Error('Learning resource not found');
    }
    return resource;
  }

  async getLearningResourceByUrl(url: string) {
    return this.repository.findByUrl(url);
  }

  async getAllLearningResources() {
    return this.repository.findAll();
  }

  async updateLearningResource(id: string, data: UpdateLearningResourceInput) {
    await this.getLearningResourceById(id);
    return this.repository.update(id, data);
  }

  async deleteLearningResource(id: string) {
    await this.getLearningResourceById(id);
    await this.repository.delete(id);
  }
}

export const learningResourceService = new LearningResourceService(
  learningResourceRepository
);
