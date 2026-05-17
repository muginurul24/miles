-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "credit_cards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "annual_fee" INTEGER NOT NULL,
    "min_income" INTEGER NOT NULL,
    "image_url" TEXT,
    "best_for" TEXT,
    "not_ideal_for" TEXT,
    "lounge_access" BOOLEAN NOT NULL DEFAULT false,
    "travel_insurance" BOOLEAN NOT NULL DEFAULT false,
    "airport_transfer" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_applications" (
    "id" UUID NOT NULL,
    "card_id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'card_detail',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earning_rates" (
    "id" UUID NOT NULL,
    "card_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "spend_per_point" INTEGER NOT NULL,
    "points_earned" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "earning_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_partners" (
    "id" UUID NOT NULL,
    "card_id" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "points_required" INTEGER NOT NULL,
    "miles_received" INTEGER NOT NULL,

    CONSTRAINT "transfer_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_pros" (
    "id" UUID NOT NULL,
    "card_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "card_pros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_cons" (
    "id" UUID NOT NULL,
    "card_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "card_cons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "sub_category" TEXT,
    "author" TEXT,
    "image_url" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "deal_tag" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_idr" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "is_highlighted" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER,

    CONSTRAINT "membership_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulting_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_idr" INTEGER,
    "price_label" TEXT,
    "outputs" JSONB NOT NULL,
    "icon" TEXT,

    CONSTRAINT "consulting_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulting_inquiries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "package_id" TEXT,
    "current_cards" TEXT,
    "needs" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consulting_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "membership_tier" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_cards_bank" ON "credit_cards"("bank");

-- CreateIndex
CREATE INDEX "idx_cards_bank_name" ON "credit_cards"("bank", "name");

-- CreateIndex
CREATE INDEX "idx_cards_annual_fee_name" ON "credit_cards"("annual_fee", "name");

-- CreateIndex
CREATE INDEX "idx_cards_tier" ON "credit_cards"("tier");

-- CreateIndex
CREATE INDEX "idx_cards_updated" ON "credit_cards"("updated_at" DESC);

-- CreateIndex
CREATE INDEX "idx_card_applications_card" ON "card_applications"("card_id");

-- CreateIndex
CREATE INDEX "idx_card_applications_created" ON "card_applications"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_earning_rates_card" ON "earning_rates"("card_id");

-- CreateIndex
CREATE INDEX "idx_earning_rates_type" ON "earning_rates"("transaction_type");

-- CreateIndex
CREATE INDEX "idx_transfer_partners_card" ON "transfer_partners"("card_id");

-- CreateIndex
CREATE INDEX "idx_transfer_partners_program" ON "transfer_partners"("program");

-- CreateIndex
CREATE INDEX "idx_card_pros_card" ON "card_pros"("card_id");

-- CreateIndex
CREATE INDEX "idx_card_cons_card" ON "card_cons"("card_id");

-- CreateIndex
CREATE INDEX "idx_articles_category" ON "articles"("category");

-- CreateIndex
CREATE INDEX "idx_articles_published" ON "articles"("published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_articles_premium" ON "articles"("premium");

-- CreateIndex
CREATE INDEX "idx_articles_category_published" ON "articles"("category", "published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_articles_category_subcategory_published" ON "articles"("category", "sub_category", "published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_articles_updated" ON "articles"("updated_at" DESC);

-- CreateIndex
CREATE INDEX "idx_membership_tiers_sort_price" ON "membership_tiers"("sort_order", "price_idr");

-- CreateIndex
CREATE INDEX "idx_consulting_packages_price_name" ON "consulting_packages"("price_idr", "name");

-- CreateIndex
CREATE INDEX "idx_inquiries_status" ON "consulting_inquiries"("status");

-- CreateIndex
CREATE INDEX "idx_inquiries_status_created" ON "consulting_inquiries"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_inquiries_package" ON "consulting_inquiries"("package_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_created" ON "consulting_inquiries"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "idx_newsletter_email" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "idx_newsletter_subscribed" ON "newsletter_subscribers"("subscribed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_membership_tier" ON "users"("membership_tier");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "idx_sessions_token" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_sessions_expires" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_accounts_user" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "idx_accounts_provider_account" ON "accounts"("provider_id", "account_id");

-- CreateIndex
CREATE INDEX "idx_verifications_identifier" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "idx_verifications_expires" ON "verifications"("expires_at");

-- AddForeignKey
ALTER TABLE "card_applications" ADD CONSTRAINT "card_applications_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earning_rates" ADD CONSTRAINT "earning_rates_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_partners" ADD CONSTRAINT "transfer_partners_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_pros" ADD CONSTRAINT "card_pros_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_cons" ADD CONSTRAINT "card_cons_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulting_inquiries" ADD CONSTRAINT "consulting_inquiries_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "consulting_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
