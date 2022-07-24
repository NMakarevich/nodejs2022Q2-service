-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Favourites" (
    "id" TEXT NOT NULL,
    "albumsIds" TEXT[],
    "artistsIds" TEXT[],
    "tracksIds" TEXT[],

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("id")
);
