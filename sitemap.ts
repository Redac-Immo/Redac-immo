import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://redac-immo.fr'

  // Routes statiques — pages fixes du site
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/cgv`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  // Routes dynamiques — pages qui dépendent de données
  // Exemple : si tu avais des pages annonces publiques un jour
  // const supabase = createServiceClient()
  // const { data: annonces } = await supabase.from('annonces').select('id, created_at').eq('statut', 'vendu')
  // const dynamicRoutes = annonces?.map(annonce => ({
  //   url: `${baseUrl}/annonce/${annonce.id}`,
  //   lastModified: new Date(annonce.created_at),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // })) || []

  return [
    ...staticRoutes,
    // ...dynamicRoutes, // Décommenter quand les pages dynamiques existeront
  ]
}