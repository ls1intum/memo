CREATE TYPE "ContributorRole" AS ENUM (
    'CONTRIBUTOR', 
    'MAINTAINER', 
    'ADMIN'
    );

CREATE TYPE "RelationshipType" AS ENUM (
    'PREREQUISITE', 
    'HIERARCHICAL', 
    'RELATED'
    );

CREATE TYPE "ResourceType" AS ENUM (
    'LECTURE_MATERIAL', 
    'RESEARCH_PAPER', 
    'BOOK', 
    'OTHER'
    );

CREATE TABLE "contributors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "ContributorRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "institution" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "competencies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "knowledgeArea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "competency_relationships" (
    "id" TEXT NOT NULL,
    "relationshipType" "RelationshipType" NOT NULL,
    "originId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_relationships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "learning_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "type" "ResourceType" NOT NULL,
    "author" TEXT,
    "abstract" TEXT,
    "isbn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "competency_resource_links" (
    "id" TEXT NOT NULL,
    "alignmentType" TEXT,
    "competencyId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_resource_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "contributors_email_key" ON "contributors"("email");

ALTER TABLE "competency_relationships" 
    ADD CONSTRAINT "competency_relationships_originId_fkey" 
        FOREIGN KEY ("originId") REFERENCES "competencies"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;

ALTER TABLE "competency_relationships" 
    ADD CONSTRAINT "competency_relationships_destinationId_fkey" 
        FOREIGN KEY ("destinationId") REFERENCES "competencies"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;

ALTER TABLE "competency_relationships" 
    ADD CONSTRAINT "competency_relationships_creatorId_fkey" 
        FOREIGN KEY ("creatorId") REFERENCES "contributors"("id") 
            ON DELETE RESTRICT 
            ON UPDATE CASCADE;

ALTER TABLE "competency_resource_links" 
    ADD CONSTRAINT "competency_resource_links_competencyId_fkey" 
        FOREIGN KEY ("competencyId") REFERENCES "competencies"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;

ALTER TABLE "competency_resource_links" 
    ADD CONSTRAINT "competency_resource_links_resourceId_fkey" 
        FOREIGN KEY ("resourceId") REFERENCES "learning_resources"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;

ALTER TABLE "competency_resource_links" 
    ADD CONSTRAINT "competency_resource_links_creatorId_fkey" 
        FOREIGN KEY ("creatorId") REFERENCES "contributors"("id") 
            ON DELETE RESTRICT 
            ON UPDATE CASCADE;
