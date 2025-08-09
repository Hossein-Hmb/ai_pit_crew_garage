AI Pit Crew Garage — a childish, funny, and cool Next.js demo using Supabase auth and OpenAI.

Features

- Login/Logout with OAuth (GitHub/Google via Supabase)
- Settings (theme, car nickname, crew personality) saved locally and to Supabase when signed in
- Garage with 3 AI toys:
  - Car Name Generator
  - Pit Stop Strategy
  - Crew Cheer Synthesizer

Getting Started

1. Install deps

```
npm i
```

2. Create `.env.local` from `.env.example` and fill values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

3. Supabase setup (SQL → Run):

```
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb
);

-- Save generated stuff to your Garage
create table if not exists garage_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind text check (kind in ('car_name','pit_strategy','crew_cheer')) not null,
  input jsonb,
  output text not null,
  favorite boolean default false,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- (Optional) RLS
alter table garage_items enable row level security;
create policy "owner can read" on garage_items for select using (auth.uid() = user_id or is_public = true);
create policy "owner can write" on garage_items for insert with check (auth.uid() = user_id);
create policy "owner can update" on garage_items for update using (auth.uid() = user_id);
create policy "owner can delete" on garage_items for delete using (auth.uid() = user_id);
```

4. Run dev server

```
npm run dev
```

5. Visit `/login` to sign in, then `/garage` to play.
