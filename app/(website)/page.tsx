import Hero from "@/components/hero/Hero"
import TwoDoors from "@/components/home/TwoDoors"
import SelectedWorks from "@/components/home/SelectedWorks"
import NowStrip from "@/components/home/NowStrip"
import AboutTeaser from "@/components/home/AboutTeaser"
import SiteFooter from "@/components/layout/SiteFooter"
import { getHomeData, getSiteSettings } from "@/lib/sanity/fetch"

/**
 * Home. The hero carries its own header (it sits on the yellow field), so this
 * page lives outside the (site) layout group and renders its own footer.
 */
export default async function Home() {
  const [home, settings] = await Promise.all([getHomeData(), getSiteSettings()])
  const featuredBook = home.upcomingBook ?? home.latestBook

  return (
    <>
      <Hero settings={settings} counts={home.counts} />
      <main id="main">
        <TwoDoors
          featuredBook={featuredBook}
          isUpcoming={!!home.upcomingBook}
          recentBooks={home.recentBooks}
          series={home.series}
          counts={home.counts}
        />
        <SelectedWorks artworks={home.artworks} />
        <NowStrip nextEvent={home.nextEvent} nextExhibition={home.nextExhibition} latestPost={home.latestPost} />
        <AboutTeaser about={home.about} />
      </main>
      <SiteFooter />
    </>
  )
}
