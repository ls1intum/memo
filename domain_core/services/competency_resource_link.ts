import { CompetencyResourceLinkRepository } from '@/domain_core/repositories/dc_interface';
import { competencyResourceLinkRepository } from '@/domain_core/repositories/dc_repo';
import { CreateCompetencyResourceLinkInput } from '@/domain_core/model/domain_model';

export class CompetencyResourceLinkService {
  constructor(private readonly repository: CompetencyResourceLinkRepository) {}

  async createLink(data: CreateCompetencyResourceLinkInput) {
    return this.repository.create(data);
  }

  async getLinkById(id: string) {
    const link = await this.repository.findById(id);
    if (!link) {
      throw new Error('Competency resource link not found');
    }
    return link;
  }

  async getLinksByCompetencyId(competencyId: string) {
    return this.repository.findByCompetencyId(competencyId);
  }

  async getLinksByResourceId(resourceId: string) {
    return this.repository.findByResourceId(resourceId);
  }

  async getAllLinks() {
    return this.repository.findAll();
  }

  async deleteLink(id: string) {
    await this.getLinkById(id);
    await this.repository.delete(id);
  }
}

export const competencyResourceLinkService = new CompetencyResourceLinkService(
  competencyResourceLinkRepository
);
