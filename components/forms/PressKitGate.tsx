"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { unlockPressKit } from "@/app/actions/pressKit"
import type { FormState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: FormState = { success: false, message: "" }

export default function PressKitGate() {
  const [state, action, pending] = useActionState(unlockPressKit, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) router.refresh()
  }, [state.success, router])

  return (
    <form action={action} className="max-w-md border-t-2 border-label-red pt-6">
      <Label htmlFor="password" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-label-red">
        Press kit password
      </Label>
      <div className="flex gap-2">
        <Input id="password" name="password" type="password" autoComplete="off" required aria-invalid={!!state.errors?.password} />
        <Button type="submit" variant="dark" disabled={pending}>
          {pending ? "Checking…" : "Unlock"}
        </Button>
      </div>
      {state.message && !state.success && (
        <p role="alert" className="mt-3 font-sans text-sm text-label-red">{state.message}</p>
      )}
      <p className="mt-4 font-sans text-sm text-foreground/60">
        Don&apos;t have it? <a href="/contact?subject=Press%20kit%20access" className="text-label-red underline underline-offset-4">Ask Candas</a> and she&apos;ll send it along.
      </p>
    </form>
  )
}
