/*
  Warnings:

  - The `createdAt` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `updatedAt` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
