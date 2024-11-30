-- Type: provider_enum

-- DROP TYPE IF EXISTS public.provider_enum;

CREATE TYPE public.provider_enum AS ENUM
    ('google', 'facebook', 'github', 'local');

ALTER TYPE public.provider_enum
    OWNER TO postgres;


-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    fullname character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password character varying(255) NOT NULL,
    provider provider_enum DEFAULT 'local'::provider_enum,
    is_verified boolean NOT NULL DEFAULT false,
    is_account_non_expired boolean NOT NULL DEFAULT true,
    is_account_non_locked boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_number_key UNIQUE (phone_number)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Table: public.profiles

-- DROP TABLE IF EXISTS public.profiles;

CREATE TABLE IF NOT EXISTS public.profiles
(
    id uuid NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    profile_name character varying(255) NOT NULL,
    avatar_url TEXT,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;


-- FUNCTION UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
