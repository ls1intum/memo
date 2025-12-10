import {
  User,
  CreateUserInput,
  UpdateUserInput,
  Competency,
  CreateCompetencyInput,
  UpdateCompetencyInput,
  LearningResource,
  CreateLearningResourceInput,
  UpdateLearningResourceInput,
  CompetencyRelationship,
  CreateCompetencyRelationshipInput,
  CompetencyResourceLink,
  CreateCompetencyResourceLinkInput,
} from '@/lib/domain/domain_core';

export interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface CompetencyRepository {
  create(data: CreateCompetencyInput): Promise<Competency>;
  findById(id: string): Promise<Competency | null>;
  findAll(): Promise<Competency[]>;
  update(id: string, data: UpdateCompetencyInput): Promise<Competency>;
  delete(id: string): Promise<void>;
}

export interface LearningResourceRepository {
  create(data: CreateLearningResourceInput): Promise<LearningResource>;
  findById(id: string): Promise<LearningResource | null>;
  findByUrl(url: string): Promise<LearningResource | null>;
  findAll(): Promise<LearningResource[]>;
  update(
    id: string,
    data: UpdateLearningResourceInput
  ): Promise<LearningResource>;
  delete(id: string): Promise<void>;
}

export interface CompetencyRelationshipRepository {
  create(
    data: CreateCompetencyRelationshipInput
  ): Promise<CompetencyRelationship>;
  findById(id: string): Promise<CompetencyRelationship | null>;
  findByOriginId(originId: string): Promise<CompetencyRelationship[]>;
  findByDestinationId(destinationId: string): Promise<CompetencyRelationship[]>;
  findAll(): Promise<CompetencyRelationship[]>;
  delete(id: string): Promise<void>;
}

export interface CompetencyResourceLinkRepository {
  create(
    data: CreateCompetencyResourceLinkInput
  ): Promise<CompetencyResourceLink>;
  findById(id: string): Promise<CompetencyResourceLink | null>;
  findByCompetencyId(competencyId: string): Promise<CompetencyResourceLink[]>;
  findByResourceId(resourceId: string): Promise<CompetencyResourceLink[]>;
  findAll(): Promise<CompetencyResourceLink[]>;
  delete(id: string): Promise<void>;
}
