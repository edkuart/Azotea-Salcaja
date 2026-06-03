-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('pending', 'contacted', 'enrolled', 'cancelled');

-- CreateTable
CREATE TABLE "chess_enrollments" (
    "id" TEXT NOT NULL,
    "child_name" TEXT NOT NULL,
    "child_age" INTEGER NOT NULL,
    "parent_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "experience" TEXT NOT NULL DEFAULT 'none',
    "message" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chess_enrollments_pkey" PRIMARY KEY ("id")
);
