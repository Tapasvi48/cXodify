-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "evaluatedCases" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCases" INTEGER NOT NULL DEFAULT 0;
