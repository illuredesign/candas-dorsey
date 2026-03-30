import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

const secret = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    if (!secret) {
      return new NextResponse("Webhook secret not configured", { status: 500 })
    }

    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, secret)

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse("Bad request", { status: 400 })
    }

    // Revalidate the tag matching the document type
    revalidateTag(body._type, "max")

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    })
  } catch (err) {
    console.error("Revalidation error:", err)
    return new NextResponse("Error revalidating", { status: 500 })
  }
}
