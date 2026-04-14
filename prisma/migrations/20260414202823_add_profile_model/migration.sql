-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "category" "ExpenseCategory";

-- AlterTable
ALTER TABLE "maintenance_requests" ADD COLUMN     "admin_comment" TEXT,
ADD COLUMN     "image_url" TEXT;

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

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
