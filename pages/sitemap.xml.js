import { supabase } from '../lib/supabase'

// 1. This function generates the raw XML structure mapping your routes
function generateSiteMap(properties) {
  // Replace this with your actual production deployment domain
  const BASE_URL = 'https://hostelset.com' 

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- 1. Hardcode your static public marketing routes -->
     <url>
       <loc>${BASE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${BASE_URL}/properties</loc>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${BASE_URL}/login</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${BASE_URL}/register</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>

     <!-- 2. Hardcode your public footer/company files -->
     <url><loc>${BASE_URL}/footers/features</loc><priority>0.6</priority></url>
     <url><loc>${BASE_URL}/footers/about</loc><priority>0.6</priority></url>
     <url><loc>${BASE_URL}/footers/contact</loc><priority>0.7</priority></url>
     <url><loc>${BASE_URL}/footers/blog</loc><priority>0.6</priority></url>
     <url><loc>${BASE_URL}/footers/careers</loc><priority>0.5</priority></url>
     <url><loc>${BASE_URL}/footers/privacy-policy</loc><priority>0.3</priority></url>
     <url><loc>${BASE_URL}/footers/terms-of-service</loc><priority>0.3</priority></url>

     <!-- 3. Dynamically map over all active property profiles inside Supabase -->
     ${properties
       .map(({ id, updated_at }) => {
         return `
       <url>
           <loc>${`${BASE_URL}/property/${id}`}</loc>
           <lastmod>${updated_at ? new Date(updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export async function getServerSideProps({ res }) {
  try {
    // 2. Fetch all active property IDs and updated timestamps directly from your table
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, updated_at')
      .eq('is_active', true)

    if (error) throw error

    // 3. Generate the XML map content with your live data array
    const sitemap = generateSiteMap(properties || [])

    // 4. Set standard XML response headers so crawlers read it as a file endpoint
    res.setHeader('Content-Type', 'text/xml')
    // Cache the sitemap on edge servers for 1 hour to keep DB queries optimal
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')
    
    res.write(sitemap)
    res.end()
  } catch (err) {
    console.error('Sitemap rendering error:', err)
    res.statusCode = 500
    res.end()
  }

  // Next.js requires returning a props object, even if empty, for server side execution
  return {
    props: {},
  }
}

// Default export component can be completely empty since browser responses are intercepted above
export default function SiteMap() {}