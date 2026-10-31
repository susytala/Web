-- Ejecutá esto en Supabase: SQL Editor > New query > Run

-- 1) Tabla de perfiles (uno por usuario de Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text check (plan in ('mensual', 'anual')),
  created_at timestamptz not null default now()
);

-- 2) Seguridad por filas: cada persona ve y edita solo su perfil
alter table public.profiles enable row level security;

create policy "Ver mi perfil" on public.profiles
  for select using (auth.uid() = id);

create policy "Editar mi perfil" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 3) Desde el navegador solo se puede modificar el nombre.
--    El plan lo actualiza tu servidor (service_role) al confirmarse un pago.
revoke update on public.profiles from authenticated;
grant update (name) on public.profiles to authenticated;

-- 4) Crea el perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
