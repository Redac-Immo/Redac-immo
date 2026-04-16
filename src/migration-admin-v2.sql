-- ═══════════════════════════════════════════════════════════════
-- REDAC-IMMO — Migration admin v2.0
-- À exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Colonne blocked sur profiles ────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;

-- ─── 2. Table admin_logs ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target_id  UUID,
  details    JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. RLS admin_logs ──────────────────────────────────────────
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent lire les logs
CREATE POLICY "admin_logs: lecture admin"
  ON public.admin_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seuls les admins peuvent insérer (via service role en pratique)
CREATE POLICY "admin_logs: insertion admin"
  ON public.admin_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── 4. Vue admin_clients (lecture consolidée) ──────────────────
CREATE OR REPLACE VIEW public.admin_clients AS
SELECT
  p.id,
  p.prenom,
  p.nom,
  p.agence,
  p.plan,
  p.role,
  p.blocked,
  p.created_at,
  u.email,
  u.last_sign_in_at,
  COUNT(a.id)::INT AS nb_annonces
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
LEFT JOIN public.annonces a ON a.user_id = p.id
WHERE p.role = 'client'
GROUP BY p.id, p.prenom, p.nom, p.agence, p.plan, p.role, p.blocked, p.created_at, u.email, u.last_sign_in_at;

-- ─── 5. RLS policies manquantes sur annonces (admin) ────────────
-- Permettre à l'admin de lire toutes les annonces via service role
-- (service role bypasse RLS — pas de policy nécessaire côté API)

-- ─── VÉRIFICATION : afficher les colonnes de profiles ────────────
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'profiles' ORDER BY ordinal_position;
