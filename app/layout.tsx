import { Bebas_Neue, EB_Garamond, JetBrains_Mono } from "next/font/google"

// Font variables live on <html> so that the `--ff-*` stacks declared in
// `:root` (globals.css) can resolve them. Declaring them lower in the tree
// leaves `:root` unable to see them and every label/mono class falls back
// to the inherited serif.
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
})

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  display: "swap",
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full ${bebasNeue.variable} ${ebGaramond.variable} ${jetBrainsMono.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
