-- ============================================
-- ServiceLink — Migration 001: Schema Inicial
-- ============================================
-- Compatível com PostgreSQL puro (local dev).
-- Substitui dependências Supabase (auth.users, auth.uid(),
-- storage.*) por equivalentes nativos do PostgreSQL.
--
-- Executar:
--   psql -U postgres -d postgres -f migrations/001_create_schema.sql
-- ============================================

-- ============================================
-- 1. TABELA LOCAL DE USUÁRIOS
-- ============================================
-- Em produção (Supabase Cloud), esta tabela é gerenciada pelo
-- schema auth.users do Supabase. Localmente, criamos nossa própria.

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT        NOT NULL UNIQUE,
    password    TEXT        NOT NULL, -- bcrypt hash
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ENUMS
-- ============================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'provider');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 3. TABELAS PRINCIPAIS
-- ============================================

-- Profiles: dados públicos do usuário, referencia public.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    phone       TEXT,
    address     TEXT,
    avatar_url  TEXT,
    bio         TEXT,
    role        user_role   DEFAULT 'client',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Services: serviços cadastrados por prestadores
CREATE TABLE IF NOT EXISTS public.services (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title       TEXT        NOT NULL,
    description TEXT,
    category    TEXT        NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    image_url   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings: solicitações de serviço entre cliente e prestador
CREATE TABLE IF NOT EXISTS public.bookings (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id    UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_id  UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id   UUID          REFERENCES public.services(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ   NOT NULL,
    total_amount DECIMAL(10,2),
    status       booking_status DEFAULT 'pending',
    created_at   TIMESTAMPTZ   DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- Reviews: avaliações deixadas pelo cliente após serviço concluído
CREATE TABLE IF NOT EXISTS public.reviews (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id  UUID    NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    provider_id UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewer_id UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ÍNDICES DE PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role       ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_services_provider   ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category   ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_bookings_client     ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider   ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider    ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking     ON public.reviews(booking_id);

-- ============================================
-- 5. TRIGGERS: updated_at automático
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at    ON public.users;
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. TRIGGER: criar profile ao cadastrar usuário
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_created ON public.users;

CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MIGRATION 001 CONCLUÍDA
-- Próximo: execute migrations/002_seed_data.sql
-- ============================================
