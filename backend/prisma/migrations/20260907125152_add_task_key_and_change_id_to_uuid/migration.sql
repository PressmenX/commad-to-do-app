/*
  Warnings:

  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,task_key]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `task_key` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
ADD COLUMN     "task_key" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tasks_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "tasks_user_id_task_key_key" ON "tasks"("user_id", "task_key");
