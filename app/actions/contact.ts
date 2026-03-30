"use server"

import { createAction, type FormState } from "@/lib/actions"
import { contactSchema } from "@/lib/validations/contact"
import { resend, senderAddress } from "@/lib/resend"

export const sendContactMessage = createAction(
  contactSchema,
  async (data): Promise<FormState> => {
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL
    if (!recipientEmail) {
      console.error("CONTACT_RECIPIENT_EMAIL is not configured")
      return { success: false, message: "Contact form is not configured." }
    }

    const { error } = await resend.emails.send({
      from: `${data.name} <${senderAddress}>`,
      replyTo: data.email,
      to: recipientEmail,
      subject: `[Website] ${data.subject}`,
      text: [
        `From: ${data.name} <${data.email}>`,
        `Subject: ${data.subject}`,
        "",
        data.message,
      ].join("\n"),
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, message: "Failed to send message. Please try again." }
    }

    return { success: true, message: "Message sent — thank you for reaching out." }
  },
)
