-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "evaluation" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "rating" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
