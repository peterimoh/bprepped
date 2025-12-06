-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role" TEXT,
    "full_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "bio" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "avatar_url" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "label" TEXT,
    "link" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email_notifications" BOOLEAN,
    "resume_tips" BOOLEAN,
    "job_alerts" BOOLEAN,
    "profile_visibility" BOOLEAN,
    "data_analytics" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_balances" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "current_balance" INTEGER,
    "total_purchased" INTEGER,
    "last_updated" TIMESTAMP(3),

    CONSTRAINT "token_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER,
    "balance_after" INTEGER,
    "transaction_type" TEXT,
    "feature_type" TEXT,
    "description" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "description" TEXT,
    "sections" INTEGER,
    "layout" TEXT,
    "preview_url" TEXT,
    "template_data" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT,
    "template_id" INTEGER,
    "content" JSONB,
    "personal_info" JSONB,
    "summary" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "skills" TEXT,
    "ats_score" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_draft" BOOLEAN NOT NULL DEFAULT false,
    "last_edited" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_drafts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resume_id" INTEGER,
    "template_id" INTEGER,
    "content" JSONB,
    "last_saved" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_sections" (
    "id" SERIAL NOT NULL,
    "resume_id" INTEGER NOT NULL,
    "section_type" TEXT,
    "section_order" INTEGER,
    "content" JSONB,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_experiences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "location" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "technologies" JSONB,
    "achievements" JSONB,
    "responsibilities" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_scans" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resume_id" INTEGER,
    "job_title" TEXT,
    "company" TEXT,
    "job_description" TEXT,
    "score" INTEGER,
    "keywords_matched" INTEGER,
    "keywords_missing" INTEGER,
    "keywords_total" INTEGER,
    "issues" JSONB,
    "suggestions" JSONB,
    "tokens_used" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_title" TEXT,
    "job_description" TEXT,
    "interviewer" JSONB,
    "metadata" JSONB,
    "score" INTEGER,
    "questions_answered" INTEGER,
    "total_questions" INTEGER,
    "feedback" TEXT,
    "strengths" JSONB,
    "improvements" JSONB,
    "duration_minutes" INTEGER,
    "tokens_used" INTEGER,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_analytics" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feature_type" TEXT,
    "tokens_used" INTEGER,
    "session_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_balances_user_id_key" ON "token_balances"("user_id");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_balances" ADD CONSTRAINT "token_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transactions" ADD CONSTRAINT "token_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "resume_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_drafts" ADD CONSTRAINT "resume_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_drafts" ADD CONSTRAINT "resume_drafts_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_drafts" ADD CONSTRAINT "resume_drafts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "resume_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_sections" ADD CONSTRAINT "resume_sections_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_experiences" ADD CONSTRAINT "user_experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_scans" ADD CONSTRAINT "resume_scans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_scans" ADD CONSTRAINT "resume_scans_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_analytics" ADD CONSTRAINT "usage_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
