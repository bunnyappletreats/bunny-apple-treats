import { Pool } from 'pg'

export type CatalogueItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
  tag: string
  description: string
  available: boolean
}

const globalForDb = globalThis as unknown as { pool?: Pool }
const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export async function listCatalogue() {
  const result = await pool.query<CatalogueItem>('SELECT id, name, category, price, image, tag, description, available FROM catalogue_items ORDER BY id')
  return result.rows
}

export async function seedCatalogue() {
  const count = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM catalogue_items')
  if (count.rows[0]?.count !== '0') return
  const items = [
    ['Signature Bento Cake', 'Bento Boxes', 320, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bentocake-JsfRHzvkJ7M2urbg5I0CNdyeC5z8Hy.webp', 'Best seller', 'A petite celebration cake, made personal.'],
    ['Mini Treat Box', 'Dessert Boxes', 280, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bento5box-HOEa67gwwCoDEzO3r1Y04RkpcVVn9r.webp', 'Sweet pick', 'A pretty little box of our favourite bites.'],
    ['Custom Celebration Cake', 'Cakes', 850, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngcake-UKABUjHhnWl6H0lmWTGqsNgupk5fwZ.png', 'Made to order', 'Your story, iced into every beautiful detail.'],
    ['Pink Berry Cupcake', 'Cupcakes & Add-ons', 55, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cakecupcakes-tv4DdQNG91WaZlqGYwDUJ9LfF3eH0a.webp', 'From 6', 'Soft, fluffy and finished with fresh berries.'],
    ['Kids Party Bento', 'Bento Boxes', 350, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bentokids5-50B28gFPje8eaL0TGd7YbLZdnC0PiR.webp', 'Little joys', 'Colourful, playful treats for their big day.'],
    ['Dessert Cup', 'Dessert Boxes', 75, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-first-kbZZKvDf4aj1Ob8GTHicoIoVb8PTey.png', 'From 6', 'Creamy layers, bright fruit and a little magic.'],
  ]
  for (const item of items) await pool.query('INSERT INTO catalogue_items (name, category, price, image, tag, description) VALUES ($1,$2,$3,$4,$5,$6)', item)
}

export async function saveCatalogueItem(item: Partial<CatalogueItem> & { id?: number }) {
  if (item.id) {
    const result = await pool.query<CatalogueItem>('UPDATE catalogue_items SET name=$1, category=$2, price=$3, image=$4, tag=$5, description=$6, available=$7, updated_at=NOW() WHERE id=$8 RETURNING id, name, category, price, image, tag, description, available', [item.name, item.category, Math.max(0, Number(item.price) || 0), item.image || '', item.tag || 'Made to order', item.description || '', item.available !== false, item.id])
    return result.rows[0]
  }
  const result = await pool.query<CatalogueItem>('INSERT INTO catalogue_items (name, category, price, image, tag, description, available) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, category, price, image, tag, description, available', [item.name || 'New treat', item.category || 'Cakes', Math.max(0, Number(item.price) || 0), item.image || '', item.tag || 'Made to order', item.description || '', item.available !== false])
  return result.rows[0]
}

export async function deleteCatalogueItem(id: number) { await pool.query('DELETE FROM catalogue_items WHERE id=$1', [id]) }
