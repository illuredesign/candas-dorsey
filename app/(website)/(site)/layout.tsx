import SiteHeader from "@/components/layout/SiteHeader"
import SiteFooter from "@/components/layout/SiteFooter"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
