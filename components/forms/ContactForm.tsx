"use client"

import { useActionState } from "react"
import { sendContactMessage } from "@/app/actions/contact"
import type { FormState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: FormState = { success: false, message: "" }

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="mt-1 font-sans text-sm text-label-red">{errors[0]}</p>
}

export default function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [state, action, pending] = useActionState(sendContactMessage, initialState)

  if (state.success) {
    return (
      <div className="border-t-2 border-emerald-green pt-6" role="status">
        <p className="font-display text-2xl tracking-[0.04em] text-foreground">Message sent.</p>
        <p className="mt-2 font-sans text-base text-ink-soft">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" className="eyebrow mb-2 block text-ink-soft">Name</Label>
          <Input id="name" name="name" required autoComplete="name" aria-invalid={!!state.errors?.name} />
          <FieldError errors={state.errors?.name} />
        </div>
        <div>
          <Label htmlFor="email" className="eyebrow mb-2 block text-ink-soft">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" aria-invalid={!!state.errors?.email} />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject" className="eyebrow mb-2 block text-ink-soft">Subject</Label>
        <Input id="subject" name="subject" required defaultValue={defaultSubject} aria-invalid={!!state.errors?.subject} />
        <FieldError errors={state.errors?.subject} />
      </div>
      <div>
        <Label htmlFor="message" className="eyebrow mb-2 block text-ink-soft">Message</Label>
        <Textarea id="message" name="message" required rows={7} aria-invalid={!!state.errors?.message} />
        <FieldError errors={state.errors?.message} />
      </div>

      {state.message && !state.success && (
        <p role="alert" className="font-sans text-sm text-label-red">{state.message}</p>
      )}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  )
}
