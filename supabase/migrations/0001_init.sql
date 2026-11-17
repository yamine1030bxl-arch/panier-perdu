-- Panier Perdu — schéma initial
-- À coller tel quel dans Supabase > SQL Editor > New query, puis « Run ».

-- Génère un jeton aléatoire de 64 caractères (sans extension).
create or replace function public.jeton_aleatoire() returns text
language sql volatile as $$
  select replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
$$;

-- Une boutique = un client
create table public.boutiques (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nom text not null,
  url text,
  plateforme text not null default 'woocommerce' check (plateforme in ('woocommerce', 'shopify')),
  ton text not null default 'vous' check (ton in ('vous', 'tu')),
  signature text,
  produit_phare text,
  code_promo_actif boolean not null default false,
  code_promo_pourcentage int not null default 10 check (code_promo_pourcentage between 1 and 50),
  commandes_mois int,
  panier_moyen int,
  token_acces text not null unique default public.jeton_aleatoire(),   -- lien d'accès privé du client
  cle_connexion text not null unique default public.jeton_aleatoire(), -- clé de l'extension WooCommerce
  user_id uuid references auth.users (id) on delete set null,          -- compte utilisateur (semaine 2)
  created_at timestamptz not null default now()
);

-- Abonnement Stripe de la boutique
create table public.abonnements (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references public.boutiques (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text unique,
  formule text not null check (formule in ('mensuel', 'annuel')),
  statut text not null default 'actif' check (statut in ('actif', 'impaye', 'annule')),
  fin_periode timestamptz,
  created_at timestamptz not null default now()
);

-- Paniers abandonnés et suivi des relances
create table public.paniers (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references public.boutiques (id) on delete cascade,
  email text not null,
  prenom text,
  contenu jsonb not null default '[]',
  montant numeric(10, 2) not null default 0,
  lien_reprise text,
  abandonne_le timestamptz not null default now(),
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'relance1', 'relance2', 'recupere', 'desinscrit')),
  relance1_le timestamptz,
  relance2_le timestamptz,
  recupere_le timestamptz,
  montant_recupere numeric(10, 2),
  created_at timestamptz not null default now()
);

create index on public.abonnements (boutique_id);
create index on public.paniers (boutique_id, statut);

-- Sécurité : personne n'accède aux tables depuis le navigateur.
-- Seul le serveur (clé secrète) lit et écrit.
alter table public.boutiques enable row level security;
alter table public.abonnements enable row level security;
alter table public.paniers enable row level security;
