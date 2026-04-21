/*
  Warnings:

  - You are about to drop the column `chore_name` on the `chore_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `chore_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `chore_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `chore_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `chore_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `chore_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chore_id,user_id]` on the table `chore_assignments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chore_id` to the `chore_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "chore_assignments_user_id_due_date_idx";

-- AlterTable
ALTER TABLE "chore_assignments" DROP COLUMN "chore_name",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "due_date",
DROP COLUMN "status",
DROP COLUMN "updated_at",
ADD COLUMN     "chore_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_requests" ADD COLUMN     "admin_comment" TEXT,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "chores" (
    "id" SERIAL NOT NULL,
    "chore_name" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "ChoreStatus" NOT NULL DEFAULT 'pending',
    "completed_by_user_id" INTEGER,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "room_number" TEXT,
    "avatar_url" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_student_id_key" ON "profiles"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chore_assignments_chore_id_user_id_key" ON "chore_assignments"("chore_id", "user_id");

-- AddForeignKey
ALTER TABLE "chores" ADD CONSTRAINT "chores_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chore_assignments" ADD CONSTRAINT "chore_assignments_chore_id_fkey" FOREIGN KEY ("chore_id") REFERENCES "chores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
