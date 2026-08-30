import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'bunny_admin'
const secret = () => process.env.ADMIN_PASSWORD || ''
const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('hex')

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value || ''
  const [payload, signature] = value.split('.')
  if (!payload || !signature || !secret()) return false
  const expected = sign(payload)
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) && payload === 'authenticated'
}

export async function setAdminCookie() {
  const value = `authenticated.${sign('authenticated')}`
  ;(await cookies()).set(COOKIE, value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12 })
}

export async function clearAdminCookie() { (await cookies()).delete(COOKIE) }
