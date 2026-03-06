-- ============================================
-- ServiceLink — Migration 002: Dados de Teste
-- ============================================
-- Popula o banco local com usuários, serviços,
-- agendamentos e avaliações para desenvolvimento.
--
-- Pré-requisito: migration 001 já executada.
--
-- Executar:
--   psql -U postgres -d postgres -f migrations/002_seed_data.sql
--
-- CONTAS DE TESTE:
--   Cliente:   cliente@test.com  / Cliente123!
--   Prestador: prestador@test.com / Prestador123!
-- ============================================

-- IDs fixos para facilitar referência durante dev
-- Cliente:   d0d8fd1b-5e26-4074-8742-99036c0e8666
-- Prestador: 1867dd1f-0e42-4f73-9831-277c0f188225

-- ============================================
-- 1. USUÁRIOS
-- ============================================
-- Senhas armazenadas com bcrypt (pgcrypto).
-- Em produção, a autenticação é gerenciada pelo Supabase Auth.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.users (id, email, password)
VALUES
    (
        'd0d8fd1b-5e26-4074-8742-99036c0e8666',
        'cliente@test.com',
        crypt('Cliente123!', gen_salt('bf'))
    ),
    (
        '1867dd1f-0e42-4f73-9831-277c0f188225',
        'prestador@test.com',
        crypt('Prestador123!', gen_salt('bf'))
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. PERFIS
-- ============================================
-- O trigger on_user_created já cria o perfil base.
-- Aqui completamos com informações adicionais.

UPDATE public.profiles SET
    full_name = 'João Silva',
    phone     = '(11) 98765-4321',
    address   = 'Rua das Flores, 123 - São Paulo, SP',
    role      = 'client',
    bio       = 'Cliente ativo procurando serviços de qualidade.'
WHERE id = 'd0d8fd1b-5e26-4074-8742-99036c0e8666';

UPDATE public.profiles SET
    full_name = 'Carlos Mendes',
    phone     = '(11) 99876-5432',
    address   = 'Avenida Paulista, 1000 - São Paulo, SP',
    role      = 'provider',
    bio       = 'Eletricista profissional com 15 anos de experiência. Atendo residências e empresas com qualidade e pontualidade.'
WHERE id = '1867dd1f-0e42-4f73-9831-277c0f188225';

-- Prestadores adicionais (sem conta de login para simplificar dev)
INSERT INTO public.users (id, email, password) VALUES
    ('aaaaaaaa-0000-0000-0000-000000000003', 'encanadora@test.com',  crypt('Test123!', gen_salt('bf'))),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'pintor@test.com',      crypt('Test123!', gen_salt('bf'))),
    ('aaaaaaaa-0000-0000-0000-000000000005', 'faxineira@test.com',   crypt('Test123!', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET
    full_name = 'Ana Costa',
    phone     = '(11) 98765-1234',
    address   = 'Rua Augusta, 500 - São Paulo, SP',
    role      = 'provider',
    bio       = 'Encanadora especializada em reparos e instalações. Trabalho rápido e garantido.'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000003';

UPDATE public.profiles SET
    full_name = 'Pedro Santos',
    phone     = '(11) 97654-3210',
    address   = 'Rua Oscar Freire, 200 - São Paulo, SP',
    role      = 'provider',
    bio       = 'Pintor residencial e comercial. Acabamento perfeito e atendimento diferenciado.'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000004';

UPDATE public.profiles SET
    full_name = 'Maria Oliveira',
    phone     = '(11) 96543-2109',
    address   = 'Rua Haddock Lobo, 300 - São Paulo, SP',
    role      = 'provider',
    bio       = 'Serviços de limpeza residencial e comercial. Profissionalismo e dedicação.'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000005';

-- ============================================
-- 3. SERVIÇOS
-- ============================================

INSERT INTO public.services (provider_id, title, description, category, price, image_url) VALUES
    -- Carlos Mendes (Eletricista)
    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Instalação Elétrica Residencial',
     'Instalação completa de sistema elétrico em residências, incluindo quadro de distribuição, tomadas e interruptores.',
     'Eletricista', 150.00, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'),

    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Reparo de Fiação',
     'Conserto e substituição de fiação elétrica danificada. Identificação de problemas elétricos.',
     'Eletricista', 80.00, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'),

    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Instalação de Chuveiro Elétrico',
     'Instalação profissional de chuveiro elétrico com garantia de segurança.',
     'Eletricista', 60.00, 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400'),

    -- Ana Costa (Encanadora)
    ('aaaaaaaa-0000-0000-0000-000000000003', 'Desentupimento de Pia',
     'Desentupimento rápido e eficiente de pias de cozinha e banheiro.',
     'Encanador', 70.00, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000003', 'Reparo de Vazamentos',
     'Identificação e reparo de vazamentos em torneiras, canos e registros.',
     'Encanador', 90.00, 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000003', 'Instalação de Filtro de Água',
     'Instalação completa de filtro de água residencial.',
     'Encanador', 100.00, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'),

    -- Pedro Santos (Pintor)
    ('aaaaaaaa-0000-0000-0000-000000000004', 'Pintura de Apartamento',
     'Pintura completa de apartamentos com tinta de qualidade. Inclui preparação de parede.',
     'Pintor', 1200.00, 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000004', 'Pintura de Fachada',
     'Pintura externa de fachadas residenciais e comerciais.',
     'Pintor', 2000.00, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000004', 'Pintura de Quarto',
     'Pintura de um quarto com acabamento profissional.',
     'Pintor', 300.00, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'),

    -- Maria Oliveira (Limpeza)
    ('aaaaaaaa-0000-0000-0000-000000000005', 'Faxina Completa',
     'Limpeza profunda de residência, incluindo todos os cômodos.',
     'Limpeza', 150.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000005', 'Limpeza Pós-Obra',
     'Limpeza especializada após reformas e construções.',
     'Limpeza', 250.00, 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400'),

    ('aaaaaaaa-0000-0000-0000-000000000005', 'Limpeza de Vidros',
     'Limpeza profissional de vidros e espelhos.',
     'Limpeza', 80.00, 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400')

ON CONFLICT DO NOTHING;

-- ============================================
-- 4. AGENDAMENTOS (BOOKINGS)
-- ============================================

INSERT INTO public.bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    'd0d8fd1b-5e26-4074-8742-99036c0e8666',
    provider_id,
    id,
    NOW() + INTERVAL '3 days',
    price,
    'pending'
FROM public.services
WHERE title = 'Instalação Elétrica Residencial'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    'd0d8fd1b-5e26-4074-8742-99036c0e8666',
    provider_id,
    id,
    NOW() - INTERVAL '5 days',
    price,
    'completed'
FROM public.services
WHERE title = 'Faxina Completa'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    'd0d8fd1b-5e26-4074-8742-99036c0e8666',
    provider_id,
    id,
    NOW() - INTERVAL '2 days',
    price,
    'accepted'
FROM public.services
WHERE title = 'Reparo de Vazamentos'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. AVALIAÇÕES (REVIEWS)
-- ============================================

INSERT INTO public.reviews (booking_id, provider_id, reviewer_id, rating, comment)
SELECT
    b.id,
    b.provider_id,
    b.client_id,
    5,
    'Serviço excelente! Muito caprichosa e pontual. Recomendo!'
FROM public.bookings b
WHERE b.status = 'completed'
  AND b.client_id = 'd0d8fd1b-5e26-4074-8742-99036c0e8666'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION 002 CONCLUÍDA
-- ============================================
