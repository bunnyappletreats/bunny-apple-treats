'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, LogOut, Plus, Save, Trash2, Upload } from 'lucide-react'
import type { CatalogueItem } from '@/lib/catalogue'

const categories = ['Bento Boxes', 'Cakes', 'Dessert Boxes', 'Cupcakes & Add-ons']

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadCatalogue = async () => {
    const response = await fetch('/api/catalogue')
    if (response.ok) setItems(await response.json())
  }

  const checkSession = async () => {
    setChecking(true)
    const session = await fetch('/api/admin/session')
    if (session.ok) {
      setLoggedIn(true)
      await loadCatalogue()
    } else {
      setLoggedIn(false)
    }
    setChecking(false)
  }

  useEffect(() => {
    checkSession()
  }, [])

  const login = async () => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) {
      setError('')
      await checkSession()
    } else {
      setError('That password was not accepted.')
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setLoggedIn(false)
    setItems([])
  }

  const update = (id: number, patch: Partial<CatalogueItem>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const save = async (item: CatalogueItem) => {
    setSaving(true)
    await fetch('/api/catalogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    setSaving(false)
  }

  const add = async () => {
    const response = await fetch('/api/catalogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New treat', category: 'Cakes', price: 0 }),
    })
    if (response.ok) {
      const item = await response.json()
      setItems((current) => [...current, item])
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Remove this item from the catalogue?')) return
    await fetch('/api/catalogue', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const upload = async (id: number, file?: File) => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    if (response.ok) update(id, { image: (await response.json()).url })
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-5">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </main>
    )
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-5">
        <div className="w-full max-w-md rounded-[2rem] border border-foreground/10 bg-background p-8 shadow-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft size={15} /> Back to storefront
          </Link>
          <p className="mt-12 text-xs font-semibold uppercase tracking-[.22em] text-primary">
            Private workspace
          </p>
          <h1 className="mt-3 font-serif text-4xl">Catalogue admin</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Enter your admin password to manage Bunny Apple Treats.
          </p>
          <label className="mt-8 block text-sm font-semibold" htmlFor="password">
            Admin password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) login()
            }}
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <button
            onClick={login}
            className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Continue to catalogue
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-secondary/50">
      <header className="border-b border-foreground/10 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">
              Bunny Apple Treats
            </p>
            <h1 className="mt-1 font-serif text-3xl">Catalogue admin</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="rounded-full border border-foreground/15 px-4 py-2 text-sm">
              View shop
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Changes here update the public catalogue.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload JPG, PNG, WEBP or GIF images up to 5MB.
            </p>
          </div>
          <button
            onClick={add}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} /> Add item
          </button>
        </div>

        <div className="grid gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-5 rounded-3xl border border-foreground/10 bg-background p-5 md:grid-cols-[180px_1fr_auto] md:items-start"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImagePlus />
                  </div>
                )}
                <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-background/95 px-3 py-2 text-xs font-semibold shadow">
                  <Upload size={14} /> Change
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => upload(item.id, e.target.files?.[0])}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Name
                  <input
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price (ZAR)
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => update(item.id, { price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                  <select
                    value={item.category}
                    onChange={(e) => update(item.id, { category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tag
                  <input
                    value={item.tag}
                    onChange={(e) => update(item.id, { tag: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2">
                  Description
                  <textarea
                    value={item.description}
                    onChange={(e) => update(item.id, { description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full resize-none rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={(e) => update(item.id, { available: e.target.checked })}
                  />
                  Available in shop
                </label>
              </div>

              <div className="flex gap-2 md:flex-col">
                <button
                  onClick={() => save(item)}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Save size={15} /> Save
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-sm text-destructive"
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}