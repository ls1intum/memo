import { UserRole, RelationshipType } from '@prisma/client';

// Re-export Prisma enums for use in other layers
export { UserRole, RelationshipType };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface Competency {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateCompetencyInput {
  title: string;
  description?: string;
}

export interface UpdateCompetencyInput {
  title?: string;
  description?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
}

export interface CreateLearningResourceInput {
  title: string;
  url: string;
}

export interface UpdateLearningResourceInput {
  title?: string;
  url?: string;
}

export interface CompetencyRelationship {
  id: string;
  relationshipType: RelationshipType;
  originId: string;
  destinationId: string;
  userId: string;
  createdAt: Date;
}

export interface CreateCompetencyRelationshipInput {
  relationshipType: RelationshipType;
  originId: string;
  destinationId: string;
  userId: string;
}

export interface CompetencyResourceLink {
  id: string;
  competencyId: string;
  resourceId: string;
  userId: string;
  createdAt: Date;
}

export interface CreateCompetencyResourceLinkInput {
  competencyId: string;
  resourceId: string;
  userId: string;
}
