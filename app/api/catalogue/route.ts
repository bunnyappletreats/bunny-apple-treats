import { NextResponse } from 'next/server'
import { deleteCatalogueItem, listCatalogue, saveCatalogueItem, seedCatalogue } from '@/lib/catalogue'
import { isAdmin } from '@/lib/admin-session'

export async function GET() { await seedCatalogue(); return NextResponse.json(await listCatalogue()) }
export async function POST(request: Request) { if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const body = await request.json(); return NextResponse.json(await saveCatalogueItem(body)) }
export async function DELETE(request: Request) { if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const { id } = await request.json(); if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid item' }, { status: 400 }); await deleteCatalogueItem(id); return NextResponse.json({ ok: true }) }
