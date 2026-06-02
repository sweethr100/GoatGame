create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
    id uuid primary key default gen_random_uuid(),
    player_name text not null check (char_length(player_name) between 2 and 16),
    mode text not null check (mode in ('precision', 'reflex', 'tracking')),
    score integer not null check (score between 0 and 1000000),
    accuracy integer not null check (accuracy between 0 and 100),
    duration_seconds integer not null check (duration_seconds between 15 and 180),
    hits integer not null check (hits >= 0),
    shots integer not null check (shots >= 0),
    best_streak integer not null check (best_streak >= 0),
    tracking_seconds numeric(5, 1) not null check (tracking_seconds >= 0),
    client_hash text not null,
    created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_mode_score_idx
    on public.leaderboard_scores (mode, score desc, created_at asc);

create index if not exists leaderboard_scores_client_hash_created_at_idx
    on public.leaderboard_scores (client_hash, created_at desc);

alter table public.leaderboard_scores enable row level security;

revoke all on table public.leaderboard_scores from anon, authenticated;
grant all on table public.leaderboard_scores to service_role;
