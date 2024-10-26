-- CreateTable
CREATE TABLE "chats" (
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "FriendName" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("chatId")
);
