import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-session'

export async function GET() {
  return (await isAdmin())
    ? NextResponse.json({ authenticated: true })
    : NextResponse.json({ authenticated: false }, { status: 401 })
}