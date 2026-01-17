import { prisma } from '@/domain_core/infrastructure/prisma';
import {
  UserRepository,
  CompetencyRepository,
  LearningResourceRepository,
  CompetencyRelationshipRepository,
  CompetencyResourceLinkRepository,
} from './dc_interface';
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
} from '@/domain_core/model/domain_model';

// Prisma implementation of repositories - ONLY these touch the database

export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role!,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export class PrismaCompetencyRepository implements CompetencyRepository {
  async create(data: CreateCompetencyInput): Promise<Competency> {
    return prisma.competency.create({
      data: {
        title: data.title,
        description: data.description || null,
      },
    });
  }

  async findById(id: string): Promise<Competency | null> {
    return prisma.competency.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Competency[]> {
    return prisma.competency.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateCompetencyInput): Promise<Competency> {
    return prisma.competency.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.competency.delete({
      where: { id },
    });
  }
}

export class PrismaLearningResourceRepository
  implements LearningResourceRepository
{
  async create(data: CreateLearningResourceInput): Promise<LearningResource> {
    return prisma.learningResource.create({
      data: {
        title: data.title,
        url: data.url,
      },
    });
  }

  async findById(id: string): Promise<LearningResource | null> {
    return prisma.learningResource.findUnique({
      where: { id },
    });
  }

  async findByUrl(url: string): Promise<LearningResource | null> {
    return prisma.learningResource.findFirst({
      where: { url },
    });
  }

  async findAll(): Promise<LearningResource[]> {
    return prisma.learningResource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    data: UpdateLearningResourceInput
  ): Promise<LearningResource> {
    return prisma.learningResource.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.learningResource.delete({
      where: { id },
    });
  }
}

export class PrismaCompetencyRelationshipRepository
  implements CompetencyRelationshipRepository
{
  async create(
    data: CreateCompetencyRelationshipInput
  ): Promise<CompetencyRelationship> {
    return prisma.competencyRelationship.create({
      data: {
        relationshipType: data.relationshipType,
        originId: data.originId,
        destinationId: data.destinationId,
        userId: data.userId,
      },
    });
  }

  async findById(id: string): Promise<CompetencyRelationship | null> {
    return prisma.competencyRelationship.findUnique({
      where: { id },
    });
  }

  async findByOriginId(originId: string): Promise<CompetencyRelationship[]> {
    return prisma.competencyRelationship.findMany({
      where: { originId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDestinationId(
    destinationId: string
  ): Promise<CompetencyRelationship[]> {
    return prisma.competencyRelationship.findMany({
      where: { destinationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<CompetencyRelationship[]> {
    return prisma.competencyRelationship.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.competencyRelationship.delete({
      where: { id },
    });
  }
}

export class PrismaCompetencyResourceLinkRepository
  implements CompetencyResourceLinkRepository
{
  async create(
    data: CreateCompetencyResourceLinkInput
  ): Promise<CompetencyResourceLink> {
    return prisma.competencyResourceLink.create({
      data: {
        competencyId: data.competencyId,
        resourceId: data.resourceId,
        userId: data.userId,
        matchType: data.matchType,
      },
    });
  }

  async findById(id: string): Promise<CompetencyResourceLink | null> {
    return prisma.competencyResourceLink.findUnique({
      where: { id },
    });
  }

  async findByCompetencyId(
    competencyId: string
  ): Promise<CompetencyResourceLink[]> {
    return prisma.competencyResourceLink.findMany({
      where: { competencyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByResourceId(
    resourceId: string
  ): Promise<CompetencyResourceLink[]> {
    return prisma.competencyResourceLink.findMany({
      where: { resourceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<CompetencyResourceLink[]> {
    return prisma.competencyResourceLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.competencyResourceLink.delete({
      where: { id },
    });
  }
}

export const userRepository = new PrismaUserRepository();
export const competencyRepository = new PrismaCompetencyRepository();
export const learningResourceRepository =
  new PrismaLearningResourceRepository();
export const competencyRelationshipRepository =
  new PrismaCompetencyRelationshipRepository();
export const competencyResourceLinkRepository =
  new PrismaCompetencyResourceLinkRepository();
