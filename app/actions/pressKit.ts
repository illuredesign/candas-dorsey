"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { createAction, type FormState } from "@/lib/actions"
import { getPressKitPassword } from "@/lib/sanity/fetch"
import { PRESS_KIT_COOKIE, hashPassword, safeEqual } from "@/lib/pressKit"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const schema = z.object({
  password: z.string().min(1, "Please enter the password."),
})

export const unlockPressKit = createAction(schema, async (data): Promise<FormState> => {
  const password = await getPressKitPassword()
  if (!password) return { success: false, message: "The press kit is not set up yet." }

  if (!safeEqual(data.password, password)) {
    return { success: false, message: "That password isn't right.", errors: { password: ["Incorrect password."] } }
  }

  ;(await cookies()).set(PRESS_KIT_COOKIE, hashPassword(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/about/press",
  })
  return { success: true, message: "Unlocked." }
})
