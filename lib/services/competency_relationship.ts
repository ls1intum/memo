import { CompetencyRelationshipRepository } from '@/lib/repositories/dc_interface';
import { competencyRelationshipRepository } from '@/lib/repositories/dc_repo';
import { CreateCompetencyRelationshipInput } from '@/lib/domain/domain_core';

export class CompetencyRelationshipService {
  constructor(private readonly repository: CompetencyRelationshipRepository) {}

  async createRelationship(data: CreateCompetencyRelationshipInput) {
    if (data.originId === data.destinationId) {
      throw new Error('Cannot create relationship to itself');
    }
    return this.repository.create(data);
  }

  async getRelationshipById(id: string) {
    const relationship = await this.repository.findById(id);
    if (!relationship) {
      throw new Error('Relationship not found');
    }
    return relationship;
  }

  async getRelationshipsByOriginId(originId: string) {
    return this.repository.findByOriginId(originId);
  }

  async getRelationshipsByDestinationId(destinationId: string) {
    return this.repository.findByDestinationId(destinationId);
  }

  async getAllRelationships() {
    return this.repository.findAll();
  }

  async deleteRelationship(id: string) {
    await this.getRelationshipById(id);
    await this.repository.delete(id);
  }
}

export const competencyRelationshipService = new CompetencyRelationshipService(
  competencyRelationshipRepository
);
