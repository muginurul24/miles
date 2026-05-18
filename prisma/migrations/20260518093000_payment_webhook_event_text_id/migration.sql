-- PayGate webhook IDs are provider-generated strings and are not guaranteed to be UUIDs.
ALTER TABLE "payment_webhook_events"
  ALTER COLUMN "id" TYPE TEXT USING "id"::text;

