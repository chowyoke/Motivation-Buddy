-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "scheduled_hour" INTEGER,
ADD COLUMN     "scheduled_minute" INTEGER,
ADD COLUMN     "telegram_chat_id" BIGINT;
