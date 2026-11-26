
-- =========================================================
-- VTCAR PREMIUM
-- Estrutura inicial do banco de dados PostgreSQL
-- =========================================================

BEGIN;

-- =========================================================
-- 1. USUÁRIOS E CONTROLE DE ACESSO
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,

    role VARCHAR(30) NOT NULL DEFAULT 'employee'
        CHECK (role IN ('master', 'admin', 'manager', 'employee')),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    failed_login_attempts INTEGER NOT NULL DEFAULT 0
        CHECK (failed_login_attempts >= 0),

    locked_until TIMESTAMPTZ,

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
    ON users (LOWER(email));

CREATE INDEX IF NOT EXISTS users_role_idx
    ON users (role);

CREATE INDEX IF NOT EXISTS users_active_idx
    ON users (active);

-- =========================================================
-- 2. VEÍCULOS
-- =========================================================

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(180) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,

    brand VARCHAR(100) NOT NULL,
    model VARCHAR(120) NOT NULL,
    version VARCHAR(150),

    manufacture_year SMALLINT NOT NULL
        CHECK (manufacture_year BETWEEN 1900 AND 2100),

    model_year SMALLINT NOT NULL
        CHECK (model_year BETWEEN 1900 AND 2100),

    price NUMERIC(12, 2) NOT NULL
        CHECK (price >= 0),

    mileage INTEGER NOT NULL DEFAULT 0
        CHECK (mileage >= 0),

    transmission VARCHAR(40),
    fuel_type VARCHAR(40),
    color VARCHAR(60),

    description TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'paused', 'sold')),

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    published_at TIMESTAMPTZ,

    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicles_status_idx
    ON vehicles (status);

CREATE INDEX IF NOT EXISTS vehicles_brand_idx
    ON vehicles (brand);

CREATE INDEX IF NOT EXISTS vehicles_price_idx
    ON vehicles (price);

CREATE INDEX IF NOT EXISTS vehicles_year_idx
    ON vehicles (model_year);

CREATE INDEX IF NOT EXISTS vehicles_featured_idx
    ON vehicles (featured);

CREATE INDEX IF NOT EXISTS vehicles_created_at_idx
    ON vehicles (created_at DESC);

-- =========================================================
-- 3. FOTOGRAFIAS DOS VEÍCULOS
-- =========================================================

CREATE TABLE IF NOT EXISTS vehicle_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vehicle_id UUID NOT NULL
        REFERENCES vehicles(id) ON DELETE CASCADE,

    image_url TEXT NOT NULL,
    storage_key TEXT,

    alt_text VARCHAR(255),

    position INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_idx
    ON vehicle_images (vehicle_id, position);

CREATE UNIQUE INDEX IF NOT EXISTS vehicle_images_single_cover
    ON vehicle_images (vehicle_id)
    WHERE is_cover = TRUE;

-- =========================================================
-- 4. LEADS / INTERESSADOS
-- =========================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vehicle_id UUID
        REFERENCES vehicles(id) ON DELETE SET NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30) NOT NULL,

    message TEXT,

    source VARCHAR(50) NOT NULL DEFAULT 'website',

    status VARCHAR(25) NOT NULL DEFAULT 'new'
        CHECK (status IN (
            'new',
            'contacted',
            'qualified',
            'negotiating',
            'converted',
            'lost'
        )),

    consent_at TIMESTAMPTZ,

    assigned_to UUID
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx
    ON leads (status);

CREATE INDEX IF NOT EXISTS leads_vehicle_idx
    ON leads (vehicle_id);

CREATE INDEX IF NOT EXISTS leads_created_at_idx
    ON leads (created_at DESC);

CREATE INDEX IF NOT EXISTS leads_assigned_to_idx
    ON leads (assigned_to);

-- =========================================================
-- 5. AUDITORIA
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES users(id) ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,

    details JSONB NOT NULL DEFAULT '{}'::JSONB,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_user_idx
    ON audit_logs (user_id);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx
    ON audit_logs (entity, entity_id);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
    ON audit_logs (created_at DESC);

-- =========================================================
-- 6. ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at_trigger ON users;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS vehicles_updated_at_trigger ON vehicles;

CREATE TRIGGER vehicles_updated_at_trigger
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS leads_updated_at_trigger ON leads;

CREATE TRIGGER leads_updated_at_trigger
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
