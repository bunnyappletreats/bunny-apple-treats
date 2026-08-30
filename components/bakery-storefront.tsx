'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faMinus, faPlus, faShoppingBag, faWandSparkles as faSparkles, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

const assets = {
  logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.png-FMeAZN2r8QFREgN60kcJFWKBGbCJ8Z.jpeg',
  hero: '/hero.png',
  cake: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngcake-UKABUjHhnWl6H0lmWTGqsNgupk5fwZ.png',
  cupcakes: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cakecupcakes-tv4DdQNG91WaZlqGYwDUJ9LfF3eH0a.webp',
  bento: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bentocake-JsfRHzvkJ7M2urbg5I0CNdyeC5z8Hy.webp',
  kids: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bentokids5-50B28gFPje8eaL0TGd7YbLZdnC0PiR.webp',
  box: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bento5box-HOEa67gwwCoDEzO3r1Y04RkpcVVn9r.webp',
  portrait: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paballo-p2W9srfaHOXJUFzxeb1num4WfEnNbz.webp',
  dessert: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-first-kbZZKvDf4aj1Ob8GTHicoIoVb8PTey.png',
}

const fallbackProducts = [
  { id: 1, name: 'Signature Bento Cake', category: 'Bento Boxes', price: 320, image: assets.bento, tag: 'Best seller', description: 'A petite celebration cake, made personal.' },
  { id: 2, name: 'Mini Treat Box', category: 'Dessert Boxes', price: 280, image: assets.box, tag: 'Sweet pick', description: 'A pretty little box of our favourite bites.' },
  { id: 3, name: 'Custom Celebration Cake', category: 'Cakes', price: 850, image: assets.cake, tag: 'Made to order', description: 'Your story, iced into every beautiful detail.' },
  { id: 4, name: 'Pink Berry Cupcake', category: 'Cupcakes & Add-ons', price: 55, image: assets.cupcakes, tag: 'From 6', description: 'Soft, fluffy and finished with fresh berries.' },
  { id: 5, name: 'Kids Party Bento', category: 'Bento Boxes', price: 350, image: assets.kids, tag: 'Little joys', description: 'Colourful, playful treats for their big day.' },
  { id: 6, name: 'Dessert Cup', category: 'Dessert Boxes', price: 75, image: assets.dessert, tag: 'From 6', description: 'Creamy layers, bright fruit and a little magic.' },
]

const categories = ['All treats', 'Bento Boxes', 'Cakes', 'Dessert Boxes', 'Cupcakes & Add-ons']
const whatsapp = '27658564939'
const zar = (value: number) => `R ${value.toLocaleString('en-ZA')}`

type Cart = Record<number, number>

export function BakeryStorefront() {
  const [category, setCategory] = useState('All treats')
  const [catalogue, setCatalogue] = useState(fallbackProducts)
  const [cart, setCart] = useState<Cart>({})
  useEffect(() => { fetch('/api/catalogue').then((response) => response.ok ? response.json() : fallbackProducts).then(setCatalogue).catch(() => {}) }, [])
  const [drawer, setDrawer] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const filtered = category === 'All treats' ? catalogue : catalogue.filter((product) => product.category === category)
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = useMemo(() => catalogue.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0), [cart])

  const add = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  const remove = (id: number) => setCart((current) => {
    const next = { ...current }
    if (next[id] > 1) next[id] -= 1
    else delete next[id]
    return next
  })
  const order = () => {
    const lines = catalogue.filter((product) => cart[product.id]).map((product) => `${cart[product.id]} x ${product.name} — ${zar(product.price * cart[product.id])}`)
    const message = `Hello Bunny Apple Treats!%0A%0AI'd like to enquire about:%0A${lines.join('%0A')}%0A%0ASubtotal: ${zar(subtotal)}%0AName: ${name || 'Not provided'}%0AEvent / pickup date: ${date || 'Not provided'}%0ANotes: ${notes || 'None'}`
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Bunny Apple Treats home">
            <Image src={assets.logo} alt="Bunny Apple Treats logo" width={46} height={46} className="rounded-full" />
            <span className="hidden font-serif text-lg font-semibold sm:block">Bunny Apple Treats</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#treats" className="transition-colors hover:text-primary">Shop treats</a>
            <a href="#story" className="transition-colors hover:text-primary">Our story</a>
            <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="relative rounded-full border border-foreground/15 p-3 transition-colors hover:bg-accent" aria-label={`Open cart with ${count} items`}>
              <FontAwesomeIcon icon={faShoppingBag} />
              {count > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{count}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-foreground/15 p-3 md:hidden" aria-label="Toggle menu"><FontAwesomeIcon icon={faBars} /></button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-foreground/10 px-5 py-4 text-sm md:hidden"><a href="#treats" onClick={() => setMenuOpen(false)}>Shop treats</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav>}
      </header>

      <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary"><FontAwesomeIcon icon={faSparkles} /> Treat your happy</p>
          <h1 className="text-balance font-serif text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">Made for your <em className="text-primary">sweetest</em> moments.</h1>
          <p className="mt-7 max-w-md text-pretty text-base leading-7 text-muted-foreground">Beautiful bakes, dessert boxes and little luxuries handcrafted in Bloemfontein. Every order is made with care, colour and a little Bunny Apple joy.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#treats" className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Explore the treats <FontAwesomeIcon icon={faArrowRight} /></a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent">Chat on WhatsApp</a></div>
          <div className="mt-10 flex items-center gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCheck} className="text-primary" /> Custom orders</span><span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCheck} className="text-primary" /> Bloemfontein</span></div>
        </div>
        <div className="relative flex min-h-[480px] items-end justify-center lg:min-h-[650px]"><div className="absolute inset-x-8 bottom-5 top-8 -z-10 rounded-[48%_52%_45%_55%/45%_40%_60%_55%] bg-secondary lg:inset-x-20" /><Image src={assets.hero} alt="Baker holding a celebration cake" width={768} height={1024} className="relative z-10 h-[500px] w-auto object-contain drop-shadow-xl lg:h-[690px]" priority /><div className="absolute bottom-6 left-0 z-20 rounded-2xl border border-foreground/10 bg-background/95 px-5 py-4 shadow-lg"><p className="font-serif text-lg">The joy is in the details.</p><p className="mt-1 text-xs text-muted-foreground">Handmade with love in Bloem</p></div></div>
      </section>

      <section id="treats" className="border-y border-foreground/10 bg-secondary/50 px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">The menu</p><h2 className="mt-3 font-serif text-5xl lg:text-6xl">A little something <em className="text-primary">sweet.</em></h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">Choose a favourite or start a conversation for something made entirely for you.</p></div><div className="mt-10 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${category === item ? 'bg-primary text-primary-foreground' : 'border border-foreground/15 hover:bg-background'}`}>{item}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <article key={product.id} className="group overflow-hidden rounded-3xl border border-foreground/10 bg-background"><div className="relative aspect-[4/3] overflow-hidden bg-muted"><Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /><span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">{product.tag}</span></div><div className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-2xl">{product.name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{product.description}</p></div><p className="shrink-0 text-sm font-semibold">{zar(product.price)}</p></div><button onClick={() => add(product.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-foreground/20 py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"><FontAwesomeIcon icon={faPlus} /> Add to order</button></div></article>)}</div></div></section>

      <section id="story" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28"><div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-4 -rotate-3 rounded-[2rem] bg-secondary" /><Image src={assets.portrait} alt="Bunny Apple Treats founder with a pink cake" width={823} height={1200} className="relative rounded-[2rem] object-cover" /></div><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">From our kitchen</p><h2 className="mt-4 font-serif text-5xl leading-tight lg:text-6xl">Bakes that feel like a <em className="text-primary">warm hug.</em></h2><p className="mt-6 text-base leading-7 text-muted-foreground">Bunny Apple Treats started with a simple belief: dessert should make an ordinary day feel worth celebrating. From tiny bento cakes to show-stopping custom designs, we create joyful treats for birthdays, milestones and just-because moments.</p><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 font-semibold underline decoration-primary decoration-2 underline-offset-8">Start your order <FontAwesomeIcon icon={faArrowRight} /></a></div></section>

      <section id="contact" className="bg-primary px-5 py-16 text-primary-foreground lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><Image src={assets.logo} alt="Bunny Apple Treats logo" width={64} height={64} className="rounded-full" /><h2 className="mt-5 font-serif text-4xl">Let&apos;s make something lovely.</h2><p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/75">Orders and enquiries are handled personally on WhatsApp. We&apos;d love to hear what you&apos;re celebrating.</p></div><div className="flex flex-col gap-3 text-sm"><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 underline underline-offset-4">WhatsApp catalogue <FontAwesomeIcon icon={faArrowRight} /></a><a href="https://www.instagram.com/bunnyappletreats" target="_blank" rel="noreferrer" className="flex items-center gap-3 underline underline-offset-4"><span aria-hidden="true" className="text-base">◎</span> @bunnyappletreats</a><a href="https://www.tiktok.com/@bunny_apple_treats" target="_blank" rel="noreferrer" className="underline underline-offset-4">TikTok @bunny_apple_treats</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="underline underline-offset-4">Facebook · Bunny Apple Treats</a></div></div></section>

      {drawer && <div className="fixed inset-0 z-50"><button className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} aria-label="Close cart" /><aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-foreground/10 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your order</p><h2 className="mt-1 font-serif text-3xl">Sweet picks</h2></div><button onClick={() => setDrawer(false)} aria-label="Close cart"><FontAwesomeIcon icon={faXmark} /></button></div><div className="flex-1 overflow-y-auto py-5">{count === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><FontAwesomeIcon icon={faShoppingBag} className="text-muted-foreground" size="2x" /><p className="mt-4 font-serif text-2xl">Your order is empty</p><p className="mt-2 text-sm text-muted-foreground">Add a little sweetness from the menu.</p></div> : catalogue.filter((product) => cart[product.id]).map((product) => <div key={product.id} className="flex items-center gap-3 border-b border-foreground/10 py-4"><Image src={product.image} alt="" width={64} height={64} className="size-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{product.name}</p><p className="text-sm text-muted-foreground">{zar(product.price)}</p><div className="mt-2 flex items-center gap-3"><button onClick={() => remove(product.id)} className="rounded-full border p-1" aria-label={`Remove one ${product.name}`}><FontAwesomeIcon icon={faMinus} /></button><span className="text-sm">{cart[product.id]}</span><button onClick={() => add(product.id)} className="rounded-full border p-1" aria-label={`Add one ${product.name}`}><FontAwesomeIcon icon={faPlus} /></button></div></div></div>)}</div>{count > 0 && <div className="border-t border-foreground/10 pt-5"><div className="mb-5 flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{zar(subtotal)}</span></div><div className="grid gap-3"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-xl border border-foreground/15 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-foreground/15 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell us about your order (optional)" rows={3} className="resize-none rounded-xl border border-foreground/15 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><button onClick={order} className="rounded-full bg-primary py-3 font-semibold text-primary-foreground">Send order on WhatsApp <ArrowRight className="ml-2 inline" size={16} /></button></div></div>}</aside></div>}
    </main>
  )
}

export default BakeryStorefront
