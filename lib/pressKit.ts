import "server-only"

import { createHash, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { getPressKitPassword } from "@/lib/sanity/fetch"

export const PRESS_KIT_COOKIE = "presskit"

export function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

/** True when the visitor's cookie matches the current CMS password. */
export async function hasPressKitAccess(): Promise<boolean> {
  const cookie = (await cookies()).get(PRESS_KIT_COOKIE)?.value
  if (!cookie) return false
  const password = await getPressKitPassword()
  if (!password) return false
  return safeEqual(cookie, hashPassword(password))
}
