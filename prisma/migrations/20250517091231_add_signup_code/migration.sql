/*
  Warnings:

  - A unique constraint covering the columns `[signup_code]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "signup_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_signup_code_key" ON "Post"("signup_code");
