-- ============================================================
-- 004_add_messages.sql
-- Real-time chat between client and provider per booking
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient per-booking message queries
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(booking_id, created_at);

-- Enable Row-Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Only the client and provider of the booking can read messages
CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (
        sender_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = messages.booking_id
              AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
        )
    );

-- Policy: Only authenticated users who belong to the booking can insert
CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_id
              AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
        )
    );

-- Policy: Users can mark their received messages as read
CREATE POLICY "messages_update_policy" ON messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = messages.booking_id
              AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
        )
    ) WITH CHECK (
        sender_id != auth.uid() -- can only update (mark read) messages you received
    );

-- Enable Realtime for this table in Supabase dashboard:
-- Database → Replication → enable messages table
