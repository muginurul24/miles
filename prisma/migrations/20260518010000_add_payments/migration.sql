-- AlterTable
ALTER TABLE "users" ADD COLUMN "membership_expires_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "tier_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "gateway_transaction_id" TEXT,
    "platform_order_id" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_type" TEXT NOT NULL DEFAULT 'bank_transfer',
    "payment_method" TEXT,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "gateway_payload" JSONB NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_webhook_events" (
    "id" UUID NOT NULL,
    "payment_order_id" UUID,
    "event" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "signature_valid" BOOLEAN NOT NULL,
    "payload" JSONB NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idx_payment_orders_order_id" ON "payment_orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_payment_orders_platform_order_id" ON "payment_orders"("platform_order_id");

-- CreateIndex
CREATE INDEX "idx_payment_orders_user_status" ON "payment_orders"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_payment_orders_tier" ON "payment_orders"("tier_id");

-- CreateIndex
CREATE INDEX "idx_payment_orders_status_created" ON "payment_orders"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_payment_webhook_events_order" ON "payment_webhook_events"("payment_order_id");

-- CreateIndex
CREATE INDEX "idx_payment_webhook_events_received" ON "payment_webhook_events"("received_at" DESC);

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "membership_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_webhook_events" ADD CONSTRAINT "payment_webhook_events_payment_order_id_fkey" FOREIGN KEY ("payment_order_id") REFERENCES "payment_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
