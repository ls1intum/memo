import { CompetencyRepository } from '@/domain_core/repositories/dc_interface';
import { competencyRepository } from '@/domain_core/repositories/dc_repo';
import {
  CreateCompetencyInput,
  UpdateCompetencyInput,
} from '@/domain_core/model/domain_model';

export class CompetencyService {
  constructor(private readonly repository: CompetencyRepository) {}

  async createCompetency(data: CreateCompetencyInput) {
    return this.repository.create(data);
  }

  async getCompetencyById(id: string) {
    const competency = await this.repository.findById(id);
    if (!competency) {
      throw new Error('Competency not found');
    }
    return competency;
  }

  async getAllCompetencies() {
    return this.repository.findAll();
  }

  /**
   * Returns a random subset of competencies, used for mapping sessions.
   * Business logic lives in the service layer (see DOMAIN_CORE.md).
   */
  async getRandomCompetencies(count: number) {
    const all = await this.repository.findAll();
    if (all.length === 0 || count <= 0) {
      return [];
    }

    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async updateCompetency(id: string, data: UpdateCompetencyInput) {
    await this.getCompetencyById(id);
    return this.repository.update(id, data);
  }

  async deleteCompetency(id: string) {
    await this.getCompetencyById(id);
    await this.repository.delete(id);
  }
}

export const competencyService = new CompetencyService(competencyRepository);
