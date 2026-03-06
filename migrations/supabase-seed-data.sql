-- ============================================
-- ServiceLink Test Data Seed Script
-- ============================================
-- Run this script AFTER supabase-setup.sql
-- This will create test users, services, bookings, and reviews

-- ============================================
-- IMPORTANT: USER ACCOUNT CREDENTIALS
-- ============================================
-- You need to create these users manually in Supabase Auth Dashboard
-- or use the signup flow in the app:
--
-- TEST CLIENT ACCOUNT:
-- Email: cliente@test.com
-- Password: Cliente123!
--
-- TEST PROVIDER ACCOUNT:
-- Email: prestador@test.com
-- Password: Prestador123!
--
-- After creating these accounts through the app or dashboard,
-- note their User IDs and replace the UUIDs below
-- ============================================

-- ============================================
-- 1. SAMPLE USER PROFILES
-- ============================================
-- Note: Replace these UUIDs with actual user IDs after creating accounts

-- Example Client Profile (replace UUID with actual client user ID)
-- You'll need to update this after creating the cliente@test.com account
INSERT INTO profiles (id, full_name, phone, address, role, bio)
VALUES
    -- Replace '00000000-0000-0000-0000-000000000001' with actual client UUID
    ('00000000-0000-0000-0000-000000000001', 'João Silva', '(11) 98765-4321', 'Rua das Flores, 123 - São Paulo, SP', 'client', 'Cliente ativo procurando serviços de qualidade.')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

-- Example Provider Profiles (replace UUIDs with actual provider user IDs)
INSERT INTO profiles (id, full_name, phone, address, role, bio)
VALUES
    -- Replace '00000000-0000-0000-0000-000000000002' with actual provider UUID
    ('00000000-0000-0000-0000-000000000002', 'Carlos Mendes - Eletricista', '(11) 99876-5432', 'Avenida Paulista, 1000 - São Paulo, SP', 'provider', 'Eletricista profissional com 15 anos de experiência. Atendo residências e empresas com qualidade e pontualidade.'),
    ('00000000-0000-0000-0000-000000000003', 'Ana Costa - Encanadora', '(11) 98765-1234', 'Rua Augusta, 500 - São Paulo, SP', 'provider', 'Encanadora especializada em reparos e instalações. Trabalho rápido e garantido.'),
    ('00000000-0000-0000-0000-000000000004', 'Pedro Santos - Pintor', '(11) 97654-3210', 'Rua Oscar Freire, 200 - São Paulo, SP', 'provider', 'Pintor residencial e comercial. Acabamento perfeito e atendimento diferenciado.'),
    ('00000000-0000-0000-0000-000000000005', 'Maria Oliveira - Faxineira', '(11) 96543-2109', 'Rua Haddock Lobo, 300 - São Paulo, SP', 'provider', 'Serviços de limpeza residencial e comercial. Profissionalismo e dedicação.')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

-- ============================================
-- 2. SAMPLE SERVICES
-- ============================================

INSERT INTO services (provider_id, title, description, category, price, image_url)
VALUES
    -- Carlos Mendes - Electrician services
    ('00000000-0000-0000-0000-000000000002', 'Instalação Elétrica Residencial', 'Instalação completa de sistema elétrico em residências, incluindo quadro de distribuição, tomadas e interruptores.', 'Eletricista', 150.00, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'),
    ('00000000-0000-0000-0000-000000000002', 'Reparo de Fiação', 'Conserto e substituição de fiação elétrica danificada. Identificação de problemas elétricos.', 'Eletricista', 80.00, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'),
    ('00000000-0000-0000-0000-000000000002', 'Instalação de Chuveiro Elétrico', 'Instalação profissional de chuveiro elétrico com garantia de segurança.', 'Eletricista', 60.00, 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400'),

    -- Ana Costa - Plumbing services
    ('00000000-0000-0000-0000-000000000003', 'Desentupimento de Pia', 'Desentupimento rápido e eficiente de pias de cozinha e banheiro.', 'Encanador', 70.00, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400'),
    ('00000000-0000-0000-0000-000000000003', 'Reparo de Vazamentos', 'Identificação e reparo de vazamentos em torneiras, canos e registros.', 'Encanador', 90.00, 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400'),
    ('00000000-0000-0000-0000-000000000003', 'Instalação de Filtro de Água', 'Instalação completa de filtro de água residencial.', 'Encanador', 100.00, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'),

    -- Pedro Santos - Painting services
    ('00000000-0000-0000-0000-000000000004', 'Pintura de Apartamento', 'Pintura completa de apartamentos com tinta de qualidade. Inclui preparação de parede.', 'Pintor', 1200.00, 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400'),
    ('00000000-0000-0000-0000-000000000004', 'Pintura de Fachada', 'Pintura externa de fachadas residenciais e comerciais.', 'Pintor', 2000.00, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'),
    ('00000000-0000-0000-0000-000000000004', 'Pintura de Quarto', 'Pintura de um quarto com acabamento profissional.', 'Pintor', 300.00, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'),

    -- Maria Oliveira - Cleaning services
    ('00000000-0000-0000-0000-000000000005', 'Faxina Completa', 'Limpeza profunda de residência, incluindo todos os cômodos.', 'Faxina', 150.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'),
    ('00000000-0000-0000-0000-000000000005', 'Limpeza Pós-Obra', 'Limpeza especializada após reformas e construções.', 'Faxina', 250.00, 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400'),
    ('00000000-0000-0000-0000-000000000005', 'Limpeza de Vidros', 'Limpeza profissional de vidros e espelhos.', 'Faxina', 80.00, 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. SAMPLE BOOKINGS
-- ============================================

INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    '00000000-0000-0000-0000-000000000001', -- client_id
    provider_id,
    id,
    NOW() + INTERVAL '3 days',
    price,
    'pending'
FROM services
WHERE title = 'Instalação Elétrica Residencial'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    '00000000-0000-0000-0000-000000000001', -- client_id
    provider_id,
    id,
    NOW() - INTERVAL '5 days',
    price,
    'completed'
FROM services
WHERE title = 'Faxina Completa'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    '00000000-0000-0000-0000-000000000001', -- client_id
    provider_id,
    id,
    NOW() - INTERVAL '2 days',
    price,
    'accepted'
FROM services
WHERE title = 'Reparo de Vazamentos'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. SAMPLE REVIEWS
-- ============================================

-- Review for completed cleaning service
INSERT INTO reviews (booking_id, provider_id, reviewer_id, rating, comment)
SELECT
    b.id,
    b.provider_id,
    b.client_id,
    5,
    'Serviço excelente! Muito caprichosa e pontual. Recomendo!'
FROM bookings b
WHERE b.status = 'completed' AND b.client_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Additional reviews for providers
INSERT INTO reviews (booking_id, provider_id, reviewer_id, rating, comment)
VALUES
    -- Reviews for Carlos (Electrician) - using dummy booking IDs
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', gen_random_uuid(), 5, 'Profissional muito competente. Resolveu o problema rapidamente.'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', gen_random_uuid(), 4, 'Bom trabalho, mas chegou um pouco atrasado.'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', gen_random_uuid(), 5, 'Excelente! Super recomendo.'),

    -- Reviews for Ana (Plumber)
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', gen_random_uuid(), 5, 'Resolveu o vazamento muito rápido. Profissional excelente!'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', gen_random_uuid(), 5, 'Muito educada e competente. Voltarei a contratar.'),

    -- Reviews for Pedro (Painter)
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', gen_random_uuid(), 4, 'Bom trabalho de pintura, mas demorou mais que o esperado.'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', gen_random_uuid(), 5, 'Pintura perfeita! Ficou lindo.'),

    -- Reviews for Maria (Cleaner)
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', gen_random_uuid(), 5, 'Casa ficou impecável! Muito satisfeita.'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', gen_random_uuid(), 5, 'Melhor faxineira que já contratei!')
ON CONFLICT DO NOTHING;

-- ============================================
-- DATA SEED COMPLETE!
-- ============================================
-- Remember to update the UUIDs above with actual user IDs from Supabase Auth
-- after creating the test accounts:
-- - cliente@test.com / Cliente123!
-- - prestador@test.com / Prestador123!
