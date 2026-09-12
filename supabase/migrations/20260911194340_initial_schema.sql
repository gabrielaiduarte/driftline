-- Application-specific user data
-- Authentication credentials are managed separately by Supabase Auth
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Restrict incident severity to vlaues understood by Driftline
create type public.incident_severity as enum (
    'P1',
    'P2',
    'P3',
    'P4'
);

-- Represents the lifecycle of an incident
create type public.incident_status as enum (
    'detected',
    'investigating',
    'mitigated',
    'resolved'
);

-- Central record for a software failure being investigated in Driftline
create table public.incidents (
    id uuid primary key default gen_random_uuid(),

    title text not null,
    description text not null,
    severity public.incident_severity not null,
    status public.incident_status not null default 'detected',

    affected_system text,

    created_by uuid not null references public.profiles(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    resolved_at timestamptz
);

-- Require explicit access policies instead of exposing table rows by default.
alter table public.profiles enable row level security;
alter table public.incidents enable row level security;