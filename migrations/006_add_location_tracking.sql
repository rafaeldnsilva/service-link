-- ============================================================
-- 006_add_location_tracking.sql
-- Real-time provider location tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS provider_locations (
    provider_id UUID           PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    latitude    DECIMAL(10, 8) NOT NULL,
    longitude   DECIMAL(11, 8) NOT NULL,
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Index for bounding-box proximity queries (lat/lng range)
CREATE INDEX IF NOT EXISTS idx_provider_locations_coords
    ON provider_locations(latitude, longitude);

-- ─── Row-Level Security (Supabase Cloud) ─────────────────────────────────────

ALTER TABLE provider_locations ENABLE ROW LEVEL SECURITY;

-- Providers can upsert their own location
CREATE POLICY "providers_manage_own_location" ON provider_locations
    FOR ALL
    USING  (auth.uid() = provider_id)
    WITH CHECK (auth.uid() = provider_id);

-- Clients with an active (accepted) booking can read the provider's location
CREATE POLICY "clients_read_active_provider_location" ON provider_locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.provider_id = provider_locations.provider_id
              AND bookings.client_id   = auth.uid()
              AND bookings.status      = 'accepted'
        )
    );

-- ─── Enable Realtime ─────────────────────────────────────────────────────────
-- In Supabase dashboard: Database → Replication → enable provider_locations table
