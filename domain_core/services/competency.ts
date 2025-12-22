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
