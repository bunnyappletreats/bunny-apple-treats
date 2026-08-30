import { NextResponse } from 'next/server'
import { setAdminCookie } from '@/lib/admin-session'

export async function POST(request: Request) {
  const { password } = await request.json()
  if (!process.env.ADMIN_PASSWORD || typeof password !== 'string' || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  await setAdminCookie()
  return NextResponse.json({ ok: true })
}
