-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('ASSUMES', 'EXTENDS', 'MATCHES');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" VARCHAR(30) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_relationships" (
    "id" VARCHAR(30) NOT NULL,
    "relationship_type" "RelationshipType" NOT NULL,
    "origin_id" VARCHAR(30) NOT NULL,
    "destination_id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_resources" (
    "id" VARCHAR(30) NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_resource_links" (
    "id" VARCHAR(30) NOT NULL,
    "competency_id" VARCHAR(30) NOT NULL,
    "resource_id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_resource_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competency_relationships_unique" ON "competency_relationships"("origin_id", "destination_id", "relationship_type");

-- CreateIndex
CREATE INDEX "idx_competency_id" ON "competency_resource_links"("competency_id");

-- CreateIndex
CREATE INDEX "idx_resource_id" ON "competency_resource_links"("resource_id");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "competency_resource_links"("user_id");

-- AddForeignKey
ALTER TABLE "competency_relationships" ADD CONSTRAINT "competency_relationships_originId_fkey" FOREIGN KEY ("origin_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_relationships" ADD CONSTRAINT "competency_relationships_destinationId_fkey" FOREIGN KEY ("destination_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_relationships" ADD CONSTRAINT "competency_relationships_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_resource_links" ADD CONSTRAINT "competency_resource_links_competencyId_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_resource_links" ADD CONSTRAINT "competency_resource_links_resourceId_fkey" FOREIGN KEY ("resource_id") REFERENCES "learning_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_resource_links" ADD CONSTRAINT "competency_resource_links_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
