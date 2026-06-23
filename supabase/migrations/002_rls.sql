-- RLS policies

alter table profiles enable row level security;
alter table style_profiles enable row level security;
alter table capsules enable row level security;
alter table capsule_items enable row level security;
alter table products enable row level security;
alter table consults enable row level security;
alter table orders enable row level security;
alter table chat_messages enable row level security;
alter table trade_ins enable row level security;
alter table alterations enable row level security;
alter table fit_profiles enable row level security;

-- Profiles: users read/update own; stylists read all
create policy profiles_select on profiles for select using (
  auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);
create policy profiles_update on profiles for update using (auth.uid() = id);

-- Products: public read active; stylists write
create policy products_select on products for select using (active = true or exists (
  select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true
));
create policy products_all on products for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);

-- Style profiles
create policy style_profiles_own on style_profiles for all using (auth.uid() = user_id);

-- Capsules
create policy capsules_own on capsules for select using (
  auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);
create policy capsules_insert on capsules for insert with check (auth.uid() = user_id);
create policy capsules_update on capsules for update using (
  auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);

-- Capsule items via capsule ownership
create policy capsule_items_select on capsule_items for select using (
  exists (select 1 from capsules c where c.id = capsule_id and (
    c.user_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
  ))
);
create policy capsule_items_write on capsule_items for all using (
  exists (select 1 from capsules c where c.id = capsule_id and (
    c.user_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
  ))
);

-- Consults
create policy consults_own on consults for select using (
  auth.uid() = user_id or email = (select email from profiles where id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);
create policy consults_insert on consults for insert with check (true);

-- Orders
create policy orders_own on orders for all using (
  auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_stylist = true)
);

-- Chat
create policy chat_own on chat_messages for all using (auth.uid() = user_id);

-- Trade-ins & alterations
create policy trade_ins_own on trade_ins for all using (auth.uid() = user_id);
create policy alterations_own on alterations for all using (auth.uid() = user_id);
create policy fit_profiles_own on fit_profiles for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
