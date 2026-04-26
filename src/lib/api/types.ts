// Confidence types
export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ConfidenceRating {
  competencyId: string;
  competencyTitle: string;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  totalVotes: number;
  voteSignal: number;
  consensusSignal: number;
  resourceSignal: number;
  metadataSignal: number;
  computedAt: string | null;
}

// API Response Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Competency {
  id: string;
  title: string;
  description: string | null;
  degree: number;
  createdAt: string;
  confidenceScore?: number;
  confidenceTier?: ConfidenceTier;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface CompetencyRelationship {
  id: string;
  relationshipType: 'ASSUMES' | 'EXTENDS' | 'MATCHES';
  originId: string;
  destinationId: string;
  userId: string;
  createdAt: string;
}

export interface CompetencyResourceLink {
  id: string;
  competencyId: string;
  resourceId: string;
  userId: string;
  matchType: 'UNRELATED' | 'WEAK' | 'GOOD_FIT' | 'PERFECT_MATCH';
  createdAt: string;
}

// Request Types
export interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
}

export interface CreateCompetencyRequest {
  title: string;
  description?: string;
}

export interface UpdateCompetencyRequest {
  title?: string;
  description?: string;
}

export interface CreateLearningResourceRequest {
  title: string;
  url: string;
}

export interface UpdateLearningResourceRequest {
  title?: string;
  url?: string;
}

export interface CreateCompetencyRelationshipRequest {
  relationshipType: 'ASSUMES' | 'EXTENDS' | 'MATCHES';
  originId: string;
  destinationId: string;
  userId: string;
}

export interface CreateCompetencyResourceLinkRequest {
  competencyId: string;
  resourceId: string;
  userId: string;
  matchType: 'UNRELATED' | 'WEAK' | 'GOOD_FIT' | 'PERFECT_MATCH';
}
