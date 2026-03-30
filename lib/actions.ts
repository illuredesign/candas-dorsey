"use server"

import { z } from "zod"

export type FormState<T = void> = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  data?: T
}

const initialState: FormState = {
  success: false,
  message: "",
}

export { initialState }

/**
 * Creates a type-safe server action that validates FormData against a Zod schema
 * before running the handler. Designed for use with React 19's useActionState.
 *
 * Usage:
 *   const myAction = createAction(mySchema, async (data) => {
 *     // data is fully typed from the schema
 *     return { success: true, message: "Done" }
 *   })
 */
export function createAction<TSchema extends z.ZodType>(
  schema: TSchema,
  handler: (data: z.infer<TSchema>) => Promise<FormState>,
) {
  return async (
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    const raw = Object.fromEntries(formData)
    const result = schema.safeParse(raw)

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "_root")
        if (!fieldErrors[key]) fieldErrors[key] = []
        fieldErrors[key].push(issue.message)
      }
      return {
        success: false,
        message: "Please fix the errors below.",
        errors: fieldErrors,
      }
    }

    try {
      return await handler(result.data)
    } catch {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      }
    }
  }
}
