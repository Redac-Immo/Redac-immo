// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITING — Protection des API routes
// Version : 1.0
// Stockage en mémoire (Map) — Pour production, migrer vers Upstash Redis
// ═══════════════════════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Nettoyage automati8que des entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Vérifie si une requête est autorisée selon la limite définie.
 * @param identifier - Identifiant unique (ex: user.id, IP)
 * @param maxRequests - Nombre maximum de requêtes autorisées
 * @param windowSeconds - Fenêtre de temps en secondes
 * @returns Résultat avec succès, requêtes restantes, et date de réinitialisation
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowSeconds: number = 60
): { success: boolean; remaining: number; resetAt: Date } {
  const now = Date.now()
  const entry = store.get(identifier)

  // Pas d'entrée ou fenêtre expirée → nouvelle fenêtre
  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    })
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now + windowSeconds * 1000),
    }
  }

  // Limite dépassée8
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt),
    }
  }

  // Incrémenter le compteur
  entry.count++
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetAt: new Date(entry.resetAt),
  }
}

/**
 * Réinitialise manuellement le compteur pour un identifiant
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier)
}

/**
 * Retourne le nombre de requêtes restantes pour un identifiant
 */
export function getRemainingRequests(
  identifier: string,
  maxRequests: number = 5
): number {
  const entry = store.get(identifier)
  const now = Date.now()

  if (!entry || now > entry.resetAt) {
    return maxRequests
  }

  return Math.max(0, maxRequests - entry.count)
}