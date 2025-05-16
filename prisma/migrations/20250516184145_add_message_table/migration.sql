-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "interest_area" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
