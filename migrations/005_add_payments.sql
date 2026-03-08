-- Migration 006: Add payment_methods and payments tables
-- Run on: local PostgreSQL (servicelink) and Supabase Cloud

-- ─── Payment Methods ─────────────────────────────────────────────────────────
-- Stores tokenized/masked card data per user (no real card numbers stored)
CREATE TABLE IF NOT EXISTS payment_methods (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    card_type     TEXT NOT NULL,          -- visa, mastercard, elo, amex, other
    last4         TEXT NOT NULL,          -- last 4 digits only
    holder_name   TEXT NOT NULL,
    expiry_month  INTEGER NOT NULL,       -- 1-12
    expiry_year   INTEGER NOT NULL,       -- 4-digit year
    is_default    BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one default per user
CREATE UNIQUE INDEX IF NOT EXISTS payment_methods_user_default
    ON payment_methods(user_id)
    WHERE is_default = true;

CREATE INDEX IF NOT EXISTS payment_methods_user_id ON payment_methods(user_id);

-- ─── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id        UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    amount            DECIMAL(10,2) NOT NULL,
    currency          TEXT NOT NULL DEFAULT 'BRL',
    status            TEXT NOT NULL DEFAULT 'pending',  -- pending, paid, refunded, failed
    gateway           TEXT NOT NULL DEFAULT 'simulated', -- stripe, pagarme, simulated
    gateway_ref       TEXT,
    paid_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT payments_status_check CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
    CONSTRAINT payments_booking_unique UNIQUE (booking_id)
);

CREATE INDEX IF NOT EXISTS payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_payment_method_id ON payments(payment_method_id);

-- ─── RLS policies (Supabase Cloud only) ──────────────────────────────────────
-- Uncomment these for Supabase Cloud deployment.
-- For local PostgreSQL, keep RLS disabled (auth.uid() does not exist locally).

-- ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users manage own payment methods"
--     ON payment_methods FOR ALL
--     USING (auth.uid() = user_id)
--     WITH CHECK (auth.uid() = user_id);

-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users view own payments"
--     ON payments FOR SELECT
--     USING (
--         booking_id IN (
--             SELECT id FROM bookings
--             WHERE client_id = auth.uid() OR provider_id = auth.uid()
--         )
--     );
-- CREATE POLICY "Users create payments for own bookings"
--     ON payments FOR INSERT
--     WITH CHECK (
--         booking_id IN (
--             SELECT id FROM bookings WHERE client_id = auth.uid()
--         )
--     );
