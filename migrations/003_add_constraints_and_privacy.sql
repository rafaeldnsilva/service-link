-- ============================================
-- ServiceLink — Migration 003: Constraints e Privacidade
-- ============================================
-- Adiciona:
--   1. Trigger que impede review em booking não concluído
--   2. Índice único: um review por booking
--   3. Campos de privacidade e disponibilidade no perfil
--
-- Executar:
--   psql -U postgres -d servicelink -f migrations/003_add_constraints_and_privacy.sql
-- ============================================

-- ============================================
-- 1. CONSTRAINT: review apenas para booking completed
-- ============================================

CREATE OR REPLACE FUNCTION public.validate_review_booking()
RETURNS TRIGGER AS $$
DECLARE
    booking_status TEXT;
BEGIN
    SELECT status::TEXT INTO booking_status
    FROM public.bookings
    WHERE id = NEW.booking_id;

    IF booking_status IS NULL THEN
        RAISE EXCEPTION 'Booking % não encontrado.', NEW.booking_id;
    END IF;

    IF booking_status <> 'completed' THEN
        RAISE EXCEPTION
            'Não é possível avaliar: o booking % está com status "%". Apenas bookings com status "completed" podem ser avaliados.',
            NEW.booking_id, booking_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_review_booking ON public.reviews;

CREATE TRIGGER trg_validate_review_booking
    BEFORE INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.validate_review_booking();

-- ============================================
-- 2. UNIQUE: apenas um review por booking
-- ============================================

ALTER TABLE public.reviews
    DROP CONSTRAINT IF EXISTS uq_reviews_booking_id;

ALTER TABLE public.reviews
    ADD CONSTRAINT uq_reviews_booking_id UNIQUE (booking_id);

-- ============================================
-- 3. CAMPOS ADICIONAIS NO PERFIL
-- ============================================

-- Disponibilidade do prestador (para filtro de busca)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT false;

-- Raio de atendimento em km (para matching por proximidade)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS coverage_radius_km INTEGER DEFAULT 25;

-- Push notification token (Sprint 7)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Índice para busca de prestadores disponíveis
CREATE INDEX IF NOT EXISTS idx_profiles_available
    ON public.profiles(role, is_available)
    WHERE role = 'provider';

-- ============================================
-- MIGRATION 003 CONCLUÍDA
-- ============================================
