-- AlterTable
ALTER TABLE "User" ALTER COLUMN "version" SET DEFAULT 1,
ALTER COLUMN "version" DROP DEFAULT;
DROP SEQUENCE "User_version_seq";
