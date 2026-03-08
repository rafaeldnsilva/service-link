-- ============================================================
-- 007_add_notifications.sql
-- In-app notification records with automatic DB trigger
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,
    body        TEXT,
    type        TEXT    NOT NULL,
    -- types: new_booking | booking_accepted | booking_cancelled | service_completed | new_message
    booking_id  UUID    REFERENCES bookings(id) ON DELETE SET NULL,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_date
    ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON notifications(user_id)
    WHERE read_at IS NULL;

-- ─── Row-Level Security (Supabase Cloud) ─────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_notifications" ON notifications
    FOR UPDATE
    USING    (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Trigger: auto-create notifications on booking events ────────────────────

CREATE OR REPLACE FUNCTION public.create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Provider receives a new booking request
    IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
        INSERT INTO public.notifications(user_id, title, body, type, booking_id)
        VALUES (
            NEW.provider_id,
            'Novo pedido recebido',
            'Um cliente quer contratar seus serviços.',
            'new_booking',
            NEW.id
        );

    -- Client notified when provider accepts
    ELSIF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        INSERT INTO public.notifications(user_id, title, body, type, booking_id)
        VALUES (
            NEW.client_id,
            'Pedido aceito!',
            'Seu prestador está confirmado e a caminho.',
            'booking_accepted',
            NEW.id
        );

    -- Client notified when booking is cancelled
    ELSIF NEW.status = 'cancelled'
          AND OLD.status IN ('pending', 'accepted') THEN
        INSERT INTO public.notifications(user_id, title, body, type, booking_id)
        VALUES (
            NEW.client_id,
            'Pedido cancelado',
            'O prestador não pôde atender seu pedido.',
            'booking_cancelled',
            NEW.id
        );

    -- Client notified when service is completed
    ELSIF NEW.status = 'completed' AND OLD.status = 'accepted' THEN
        INSERT INTO public.notifications(user_id, title, body, type, booking_id)
        VALUES (
            NEW.client_id,
            'Serviço concluído!',
            'Avalie sua experiência com o prestador.',
            'service_completed',
            NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_notifications ON public.bookings;

CREATE TRIGGER trg_booking_notifications
    AFTER INSERT OR UPDATE OF status ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.create_booking_notification();

-- ─── Enable Realtime ─────────────────────────────────────────────────────────
-- In Supabase dashboard: Database → Replication → enable notifications table
