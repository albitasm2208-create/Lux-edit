-- The Luxe Edit — initial schema

create type membership_tier as enum ('none', 'essential', 'premium', 'concierge');
create type capsule_status as enum ('draft', 'pending_review', 'client_review', 'approved', 'ordered');
create type order_status as enum ('pending', 'paid', 'packed', 'shipped', 'delivered', 'returned');
create type consult_type as enum ('general', 'in_home_fitting', 'event');
create type consult_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
create type tradein_status as enum ('submitted', 'valued', 'approved', 'completed', 'declined');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  membership_tier membership_tier default 'none',
  fit_prefs jsonb default '{}',
  climate text,
  is_stylist boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  answers jsonb not null default '{}',
  summary text,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  brand text not null,
  category text not null,
  price_cents integer not null,
  image_url text,
  inventory_count integer default 0,
  tags text[] default '{}',
  palette_tags text[] default '{}',
  life_tags text[] default '{}',
  season_tags text[] default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

create table capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  style_profile_id uuid references style_profiles(id),
  season text,
  status capsule_status default 'draft',
  stylist_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table capsule_items (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid references capsules(id) on delete cascade,
  product_id uuid references products(id),
  slot integer,
  approved boolean,
  swap_requested boolean default false,
  created_at timestamptz default now()
);

create table consults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  type consult_type default 'general',
  tier text,
  status consult_status default 'requested',
  name text,
  email text not null,
  notes text,
  scheduled_at timestamptz,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  capsule_id uuid references capsules(id),
  stripe_payment_id text,
  status order_status default 'pending',
  shipping_address jsonb,
  tracking_number text,
  priority boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table trade_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_name text not null,
  condition_notes text,
  photo_urls text[] default '{}',
  estimated_value_cents integer,
  status tradein_status default 'submitted',
  created_at timestamptz default now()
);

create table alterations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_name text not null,
  request_notes text,
  status text default 'requested',
  created_at timestamptz default now()
);

create table fit_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  height_cm integer,
  sizes jsonb default '{}',
  photo_url text,
  notes text,
  updated_at timestamptz default now()
);

create index idx_capsules_user on capsules(user_id);
create index idx_capsules_status on capsules(status);
create index idx_products_category on products(category);
create index idx_orders_user on orders(user_id);
