import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-session'

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData(); const file = form.get('file')
  if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Use an image under 5MB' }, { status: 400 })
  const blob = await put(`catalogue/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}
