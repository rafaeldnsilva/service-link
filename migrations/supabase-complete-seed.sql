-- ============================================
-- ServiceLink COMPLETE Seed Script
-- ============================================

-- 1. SETUP EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREATE USERS
-- Define UUIDs
-- Client: d0d8fd1b-5e26-4074-8742-99036c0e8666
-- Provider: 1867dd1f-0e42-4f73-9831-277c0f188225

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES
-- Client User
(
    '00000000-0000-0000-0000-000000000000',
    'd0d8fd1b-5e26-4074-8742-99036c0e8666',
    'authenticated',
    'authenticated',
    'cliente@test.com',
    crypt('Cliente123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"João Silva (Test)"}',
    NOW(),
    NOW(),
    '',
    ''
),
-- Provider User
(
    '00000000-0000-0000-0000-000000000000',
    '1867dd1f-0e42-4f73-9831-277c0f188225',
    'authenticated',
    'authenticated',
    'prestador@test.com',
    crypt('Prestador123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Carlos Mendes (Test)"}',
    NOW(),
    NOW(),
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- Force profile role update (trigger might set default)
UPDATE public.profiles 
SET role = 'client' 
WHERE id = 'd0d8fd1b-5e26-4074-8742-99036c0e8666';

UPDATE public.profiles 
SET role = 'provider' 
WHERE id = '1867dd1f-0e42-4f73-9831-277c0f188225';

-- 3. SEED DATA (Adapted from supabase-seed-data.sql)

-- Update Profiles with more info
UPDATE profiles 
SET 
    phone = '(11) 98765-4321',
    address = 'Rua das Flores, 123 - São Paulo, SP',
    bio = 'Cliente ativo procurando serviços de qualidade.'
WHERE id = 'd0d8fd1b-5e26-4074-8742-99036c0e8666';

UPDATE profiles
SET
    phone = '(11) 99876-5432',
    address = 'Avenida Paulista, 1000 - São Paulo, SP',
    bio = 'Eletricista profissional com 15 anos de experiência. Atendo residências e empresas.'
WHERE id = '1867dd1f-0e42-4f73-9831-277c0f188225';

-- Create Services (for Provider)
INSERT INTO services (provider_id, title, description, category, price, image_url)
VALUES
    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Instalação Elétrica Residencial', 'Instalação completa de sistema elétrico em residências.', 'Eletricista', 150.00, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'),
    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Reparo de Fiação', 'Conserto e substituição de fiação elétrica danificada.', 'Eletricista', 80.00, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'),
    ('1867dd1f-0e42-4f73-9831-277c0f188225', 'Instalação de Chuveiro', 'Instalação profissional de chuveiro elétrico.', 'Eletricista', 60.00, 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400')
ON CONFLICT DO NOTHING;

-- Create Bookings
INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    'd0d8fd1b-5e26-4074-8742-99036c0e8666', -- client
    '1867dd1f-0e42-4f73-9831-277c0f188225', -- provider
    id,
    NOW() + INTERVAL '3 days',
    price,
    'pending'
FROM services
WHERE title = 'Instalação Elétrica Residencial' AND provider_id = '1867dd1f-0e42-4f73-9831-277c0f188225'
LIMIT 1;

INSERT INTO bookings (client_id, provider_id, service_id, scheduled_at, total_amount, status)
SELECT
    'd0d8fd1b-5e26-4074-8742-99036c0e8666', -- client
    '1867dd1f-0e42-4f73-9831-277c0f188225', -- provider
    id,
    NOW() - INTERVAL '2 days',
    price,
    'completed'
FROM services
WHERE title = 'Instalação de Chuveiro' AND provider_id = '1867dd1f-0e42-4f73-9831-277c0f188225'
LIMIT 1;

-- Create Reviews
INSERT INTO reviews (booking_id, provider_id, reviewer_id, rating, comment)
SELECT
    b.id,
    b.provider_id,
    b.client_id,
    5,
    'Serviço excelente! Muito rápido e limpo.'
FROM bookings b
WHERE b.status = 'completed' AND b.client_id = 'd0d8fd1b-5e26-4074-8742-99036c0e8666'
LIMIT 1;

