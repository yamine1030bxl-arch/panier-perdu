// Clients Stripe et Supabase — À N'IMPORTER QUE CÔTÉ SERVEUR.
// Les clés secrètes ne quittent jamais le serveur.
import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requis(nom: string): string {
  const v = process.env[nom];
  if (!v) throw new Error(`Variable d'environnement manquante : ${nom}`);
  return v;
}

let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(requis("STRIPE_SECRET_KEY"));
  return _stripe;
}

let _db: SupabaseClient | null = null;
export function db(): SupabaseClient {
  if (!_db) {
    _db = createClient(requis("NEXT_PUBLIC_SUPABASE_URL"), requis("SUPABASE_SECRET_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _db;
}

export function secretWebhook(): string {
  return requis("STRIPE_WEBHOOK_SECRET");
}

export type BoutiqueDB = {
  id: string;
  email: string;
  nom: string;
  url: string | null;
  ton: "vous" | "tu";
  signature: string | null;
  produit_phare: string | null;
  code_promo_actif: boolean;
  code_promo_pourcentage: number;
  token_acces: string;
};

export type AbonnementDB = {
  formule: "mensuel" | "annuel";
  statut: "actif" | "impaye" | "annule";
  fin_periode: string | null;
};
