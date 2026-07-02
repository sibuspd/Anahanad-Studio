ALTER TABLE "batches" DROP CONSTRAINT "batches_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "batches" DROP CONSTRAINT "batches_teacher_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "batches_course_id_idx";--> statement-breakpoint
DROP INDEX "batches_teacher_id_idx";--> statement-breakpoint
ALTER TABLE "batches" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "batches" DROP COLUMN "course_id";--> statement-breakpoint
ALTER TABLE "batches" DROP COLUMN "teacher_id";