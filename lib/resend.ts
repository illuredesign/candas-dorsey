import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

/** The verified sender address for outbound mail. */
export const senderAddress =
  process.env.RESEND_FROM_EMAIL ?? "noreply@candasjanedorsey.com"
