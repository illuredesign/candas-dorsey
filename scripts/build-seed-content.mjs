/**
 * Builds `sanity/seed-content.ndjson` + `sanity/seed-assets/` from Candas's client folder.
 *
 * Artwork, headshots and page images are copied out of the client archive, rotated upright,
 * resized for the web and referenced with Sanity's `_sanityAsset` import syntax, so a single
 *
 *   npx sanity dataset import sanity/seed-content.ndjson production --replace
 *
 * uploads the files and creates/updates the documents. Documents that already exist from
 * `seed.ndjson` (books, pages, press kit, settings, FLAT project, categories) are re-emitted in
 * full with the new image fields, which is why `--replace` is required.
 *
 * Usage:  node scripts/build-seed-content.mjs
 * Env:    CLIENT_DIR  (default: the OneDrive "client files/Candas Dorsey" folder)
 */
import { createRequire } from "node:module"
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const sharp = require("sharp")

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const CLIENT = process.env.CLIENT_DIR ?? "/mnt/c/Users/JenJo/OneDrive/Documents/client files/Candas Dorsey"
const ART = join(CLIENT, "Candas's Visual Art Work")
const CURATED = join(CLIENT, "Content 2020-02-14 on/5 title is Candas @ art -- this is artwork -- note folders numbered in menu order/1 visual art")
const PHOTOS = join(CLIENT, "Candas Additional Photos")
const MUGS = join(CLIENT, "Candas all older mug shots")
const MACEWAN = join(CLIENT, "Candas 2022 MacEwan mug shots ph credit Steven Stefaniuk")

const OUT_NDJSON = join(ROOT, "sanity/seed-content.ndjson")
const ASSETS = join(ROOT, "sanity/seed-assets")
const SEED = join(ROOT, "sanity/seed.ndjson")

const ARTIST = "Candas Jane Dorsey"

// ── helpers ──────────────────────────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
const key = () => Math.random().toString(36).slice(2, 12)
const block = (text) => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children: [{ _type: "span", _key: key(), text, marks: [] }] })

const jobs = [] // image processing jobs
let assetBytes = 0

/** Register an image to be copied/resized; returns the Sanity image object. */
function img(src, { dir, name, alt, credit, caption, max = 2400, quality = 88 }) {
  const full = resolve(src)
  if (!existsSync(full)) throw new Error(`Missing source image: ${full}`)
  const rel = `seed-assets/${dir}/${name}.jpg`
  jobs.push({ src: full, dest: join(ROOT, "sanity", rel), max, quality })
  const o = { _type: "image", _sanityAsset: `image@file://./${rel}`, alt }
  if (credit) o.credit = credit
  if (caption) o.caption = caption
  return o
}

const docs = []
const seed = readFileSync(SEED, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
const seedById = Object.fromEntries(seed.map((d) => [d._id, d]))

// ── 1. Artwork ────────────────────────────────────────────────────────────
// status: available | sold | privateCollection | notForSale
const A = (rel) => join(ART, rel)
const C = (rel) => join(CURATED, rel)
const D = (rel) => join(ART, "Drawings--pencil pencilcrayon crayon charcoal", rel)

const categories = {
  acrylic: { id: "galleryCategory-acrylic-paintings", medium: "Acrylic on canvas", description: "Prairie skies, fields and semi-abstract landscapes, mostly in acrylic, with a few water-soluble oils." },
  watercolour: { id: "galleryCategory-watercolour-paintings", medium: "Watercolour on paper", description: "Flowers, cities, lakes and the occasional self-portrait, in watercolour, ink and gouache." },
  drawings: { id: "galleryCategory-drawings", medium: "Pencil on paper", description: "Pencil, pencil crayon, coloured pencil and charcoal, including a long-running series of cats." },
  wordSalad: { id: "galleryCategory-word-salad", medium: "Collage", description: "Collages built from letters, found objects and paper: words taken apart and put back together." },
  photographs: { id: "galleryCategory-photographs", medium: "Photograph", description: "Still lifes, plants and found compositions." },
  otherMedia: { id: "galleryCategory-other-media", medium: "Mixed media", description: "Gel transfers, soap-on-mirror self-portraits and other experiments." },
  pastels: { id: "galleryCategory-pastels", medium: "Chalk pastel on paper", description: "Chalk pastel and conté: flowers, landscapes and a well-loved cat." },
  encaustics: { id: "galleryCategory-encaustics", medium: "Encaustic on board", description: "Pigmented wax worked with heat." },
  prints: { id: "galleryCategory-prints", medium: "Monoprint", description: "Linocuts and monoprints." },
}

/** [category, title, file, { year, medium, dimensions, status, series, note }] */
const artworks = [
  // Acrylics (Candas's own 2020 selection first, then named works)
  ["acrylic", "Unsettled Day", A("Acrylics including semiabstracts/Unsettled Day better pic.jpg"), {}],
  ["acrylic", "Voyer-ism Field", A("Acrylics including semiabstracts/Voyer-ism Field 2018.jpg"), { year: "2018" }],
  ["acrylic", "Harvest Field 1", A("Acrylics including semiabstracts/Harvest Field 1 2020 16x20.jpg"), { year: "2020", dimensions: "16 × 20 in" }],
  ["acrylic", "Harvest Fields 2", A("Acrylics including semiabstracts/Harvest Fields 2 2020 16x20.jpg"), { year: "2020", dimensions: "16 × 20 in" }],
  ["acrylic", "Brown Hills", A("Acrylics including semiabstracts/Brown Hills 2020 16x20.jpg"), { year: "2020", dimensions: "16 × 20 in" }],
  ["acrylic", "Purple Rain", A("Acrylics including semiabstracts/Purple Rain lol 2020 16x20.jpg"), { year: "2020", dimensions: "16 × 20 in" }],
  ["acrylic", "Travels with My Mother 1: The Medicine Hills", A("Acrylics including semiabstracts/2017 Travels with my Mother 1--The Medicine Hills 14hx32lin.jpg"), { year: "2017", dimensions: "14 × 32 in", series: "Travels with My Mother" }],
  ["acrylic", "That Sky", A("Acrylics including semiabstracts/That sky 2017.JPG"), { year: "2017" }],
  ["acrylic", "Rain at Sunset", A("Acrylics including semiabstracts/Rain at sunset 2018.jpg"), { year: "2018" }],
  ["acrylic", "In the Night Garden", A("Acrylics including semiabstracts/In the Night Garden.jpg"), {}],
  ["acrylic", "Hoya with Toy Horse", A("Acrylics including semiabstracts/Hoya with toy horse 2012-12-30.jpg"), { year: "2012", status: "notForSale" }],
  ["acrylic", "Meconopsis", A("Acrylics including semiabstracts/Mecanopsis acrylic from Tina R photo2012-12-31.jpg"), { year: "2012", note: "After a photograph by Tina R." }],
  ["acrylic", "Field of Poppies", C("1 acrylic painting/Field of Poppoes given to Sean and Shawna Chmas 2015.JPG"), { year: "2015", status: "privateCollection" }],
  ["acrylic", "Diptych", A("Acrylics including semiabstracts/Diptych 2015.JPG"), { year: "2015", status: "privateCollection" }],
  ["acrylic", "Green Hills", A("Acrylics including semiabstracts/Given to Robin Dezall Chmas 2015.JPG"), { year: "2015", status: "privateCollection" }],
  ["acrylic", "Sunset over City Central Yards", A("Given or sold away/Sunset over City Central Yards 2017 sold art walk 2017.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Valley Road", A("Given or sold away/Valley Road 2017 gave to Emil Foisin for Chmas 2017.JPG"), { year: "2017", status: "privateCollection" }],
  ["acrylic", "Grey Sky, Green Field", C("1 acrylic painting/DSCN1626.JPG"), {}],
  ["acrylic", "Red Horizon", C("1 acrylic painting/DSCN1630.JPG"), {}],
  ["acrylic", "Cloud Study", C("1 acrylic painting/DSCN1673--cropped.jpg"), {}],
  ["acrylic", "Orange Field", C("1 acrylic painting/John Park has it.JPG"), { status: "privateCollection" }],
  ["acrylic", "Prairie in Orange", C("1 acrylic painting/on my cards--opening page.JPG"), { status: "notForSale" }],
  ["acrylic", "Golden Horizon", A("Acrylics including semiabstracts/dark-quin-br.jpg"), {}],
  ["acrylic", "Orange Field, White Sky", A("Acrylics including semiabstracts/20220708_152203.jpg"), { year: "2022" }],
  ["acrylic", "Autumn Horizon", A("Acrylics including semiabstracts/20221016_114121.jpg"), { year: "2022" }],
  ["acrylic", "Pale Prairie", C("1 acrylic painting/Sold Art Walk 2017-07-07.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Yellow Field, Falling Sky", C("1 acrylic painting/Sold Art Walk 2017.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Trees and Field", A("Acrylics including semiabstracts/Sold art walk 2017 Ted Universal barbershop.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Misty Field", A("Given or sold away/Sold Art Walk 2017-07-09 Don Perkins.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Small Landscape", A("Given or sold away/Made 2017 Sold art walk 2017.JPG"), { year: "2017", status: "sold" }],
  ["acrylic", "Slapdash Autumn", A("Acrylics including semiabstracts/Slapdash autumny acryllic palette knife 2010-06-03 Patti has now.jpg"), { year: "2010", medium: "Acrylic, palette knife", series: "Slapdash", status: "privateCollection" }],
  ["acrylic", "Slapdash Sunset at the Lake", A("Acrylics including semiabstracts/Slapdash sunset at lake acryllic palette kn 2010-06-03.jpg"), { year: "2010", medium: "Acrylic, palette knife", series: "Slapdash" }],
  ["acrylic", "Slapdash Winter River", A("Acrylics including semiabstracts/Slapdash winter river acryllic palette knife 2010-06-03.jpg"), { year: "2010", medium: "Acrylic, palette knife", series: "Slapdash" }],
  ["acrylic", "Slapdash Landscape", A("Acrylics including semiabstracts/Slapdash landscape acryllics darkish photo 2010-06-03.jpg"), { year: "2010", medium: "Acrylic", series: "Slapdash" }],
  ["acrylic", "Clouds West of Lacombe", A("Water-soluble oils/Clouds west of Highway 2 near Lacombe last Friday 09-07-23 1.jpg"), { year: "2009", medium: "Water-soluble oil" }],
  ["acrylic", "Storm West of Wetaskiwin", A("Water-soluble oils/Storm west of wetaskiwin 09-07-22.jpg"), { year: "2009", medium: "Water-soluble oil" }],
  ["acrylic", "Fireweed", A("Water-soluble oils/Fireweed w-s oils.jpg"), { medium: "Water-soluble oil" }],
  ["acrylic", "Mountain at the Black Cat", A("Water-soluble oils/mountain at Black Cat w-s oils.jpg"), { medium: "Water-soluble oil" }],

  // Watercolours
  ["watercolour", "Self-Portrait with Peaches 2", A("Watercolours/Self-Portrait with Peaches 2 - Copy.jpg"), {}],
  ["watercolour", "Showcase at Ibon", C("2 watercolour painting/Showcase at Ibon 2016-17.JPG"), { year: "2016–17" }],
  ["watercolour", "Hoya at Joanne's", A("Watercolours/Hoya at Joanne's--2011-11.jpg"), { year: "2011" }],
  ["watercolour", "Winter Trees", A("Watercolours/Winter trees wc-scanned 2010-01-30.jpg"), { year: "2010" }],
  ["watercolour", "One Thing", A("Watercolours/one thing.jpg"), {}],
  ["watercolour", "Bold Blossom", A("Watercolours/Bold blossom 2010-06-04.jpg"), { year: "2010" }],
  ["watercolour", "Impressionist City: Chicago", A("Watercolours/Chicago Impressionist City w-c 2010-06-04.jpg"), { year: "2010", series: "Impressionist City" }],
  ["watercolour", "Impressionist City 2: New York", A("Watercolours/NYC Impressionist City 2 w-c 2010-06-06.jpg"), { year: "2010", series: "Impressionist City" }],
  ["watercolour", "New York at Riverside", A("Watercolours/NYC at Riverside smaller size.jpg"), {}],
  ["watercolour", "Crestamere Lake at Sunset", A("Watercolours/Crestamere Lake at sunset 2010-06-06.jpg"), { year: "2010" }],
  ["watercolour", "Hibiscus", A("Watercolours/Hibiscus.jpg"), { year: "2010" }],
  ["watercolour", "Tulips", A("Watercolours/Ink & wc tulips 2010-05.jpg"), { year: "2010", medium: "Ink and watercolour on paper" }],
  ["watercolour", "Mountains (sketch)", A("Watercolours/Mountains w-c sketch.jpg"), { year: "2010" }],
  ["watercolour", "Prairie (sketch)", A("Watercolours/More prairie w-c sketch 2010-06-06.jpg"), { year: "2010" }],
  ["watercolour", "Poppy", A("Watercolours/Poppy 2014.JPG"), { year: "2014" }],
  ["watercolour", "Roses (Not Formal, Not Boring)", A("Watercolours/Roses not formal not boring 2010-06-06 wc pencils crayons & paint.jpg"), { year: "2010", medium: "Watercolour pencils, crayons and paint on paper" }],
  ["watercolour", "Swans on a Great Lakes Shore", A("Watercolours/Swans on Great Lakes shore -- from 1978 Natl Geogr photo -- 09-06-06 watercolour on crappy wrinking paper.jpg"), { year: "2009", note: "After a 1978 National Geographic photograph." }],
  ["watercolour", "Ti's Mask", A("Watercolours/Ti's Mask 2010-05-13.jpg"), { year: "2010" }],
  ["watercolour", "City Street", A("Watercolours/City Street smaller size.jpg"), {}],
  ["watercolour", "Copper Water", A("Watercolours/Fan brush copper water- wc & gouache.jpg"), { medium: "Watercolour and gouache on paper" }],
  ["watercolour", "Watercolour and Ink Sketch", A("Watercolours/Wc and ink sketch 2010-05-09.jpg"), { year: "2010", medium: "Watercolour and ink on paper" }],
  ["watercolour", "Pink Poppy", A("Watercolours/Small watercolours/Janice McDonald has it.JPG"), { status: "privateCollection" }],

  // Drawings
  ["drawings", "Sparrow", D("Sparrow 2011-01-10 image-adjusted.jpg"), { year: "2011", medium: "Pencil crayon on paper", series: "Cats" }],
  ["drawings", "Sparrow (Minimalist)", D("Sparrow minimalist 2011-01-04.jpg"), { year: "2011", medium: "Pencil crayon on paper", series: "Cats" }],
  ["drawings", "Sparrow, Sketch", D("Sparrow 09-04-07 gamma-ed.jpg"), { year: "2009", series: "Cats" }],
  ["drawings", "Shine and Buffo", D("Shine and Buffo 2010-12=2011-01.jpg"), { year: "2010–11", medium: "Pencil crayon on paper", series: "Cats" }],
  ["drawings", "Shine and Buffo Sleeping", D("Shine and Buffo sleeping 2.jpg"), { year: "2010–11", medium: "Pencil crayon on paper", series: "Cats" }],
  ["drawings", "Buffo (Sepia)", D("sepia Buffo Dec 2014.jpg"), { year: "2014", medium: "Pencil with digital effects", series: "Cats" }],
  ["drawings", "Buffo (Black and White)", D("B&W heavy effects Buffo Dec 2014.jpg"), { year: "2014", medium: "Pencil with digital effects", series: "Cats" }],
  ["drawings", "Dextrose", D("Dextrose sketch by CJD.jpg"), { medium: "Pencil crayon on paper", series: "Cats" }],
  ["drawings", "Goodnight Dextrose (Goodnight Shine)", D("Goodnight Dextrose (Goodnight Shine) 09-06-24.jpg"), { year: "2009", series: "Cats" }],
  ["drawings", "Timothy Asleep", D("Timothy asleep -- reductive charcoal drawing 09-07-10.jpg"), { year: "2009", medium: "Reductive charcoal on paper" }],
  ["drawings", "Amber at the Black Cat", D("Amber at Black Cat 09-01-17 pencil sketch.jpg"), { year: "2009" }],
  ["drawings", "Billy St. Savard", D("Billy St Savard--down-on-his-luck artist--drawing 09-06-23.jpg"), { year: "2009" }],
  ["drawings", "Betty's Lanterns", D("Betty's lanterns 09-06-24 after front porch 1-minute art lesson from Billy St Savard.jpg"), { year: "2009", medium: "Pen on paper", note: "Drawn after a one-minute front-porch art lesson from Billy St. Savard." }],
  ["drawings", "California Poppies", D("California poppies 2014-07-09 second scan.jpg"), { year: "2014", medium: "Pencil crayon on paper" }],
  ["drawings", "Storm Blowing In, with Birds", D("Coloured pencils -- storm blowing in with birds -- sketch -- 09-07-12.jpg"), { year: "2009", medium: "Coloured pencil on paper" }],
  ["drawings", "Prairie Sky", D("Coloured pencils prairie sky09-07-12.jpg"), { year: "2009", medium: "Coloured pencil on paper" }],
  ["drawings", "Glooscap, Long Asleep", D("Glooscap long asleep 10-05-22.jpg"), { year: "2010", medium: "Coloured pencil on paper" }],
  ["drawings", "Morden Sunrise Rose", D("Morden sunrise rose Dec 2010 image adjusted.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "No-mah-ka-ta Spins the Wild Winds (a Catskills Witch)", D("No-mah-ka-ta spins the wild winds -- a Catskills witch 2011-01-04 sketch.jpg"), { year: "2011" }],
  ["drawings", "Poppy (Three Panels)", D("Poppy--3 panel--pencil crayon Dec 2010--to Ally.jpg"), { year: "2010", medium: "Pencil crayon on paper", status: "privateCollection" }],
  ["drawings", "Poppy (Half)", D("Poppy--half--pencil crayon Dec 2010 cropped.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "Two Landscapes", D("Stripe 2 landscapes 2010-12-30&31.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "The Season Must Have Its Blood", D("The season must have its blood--pencil crayon 2010-12-24to26.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "Night Trees and Moon", D("night trees & moon 2010-12 done at Black Cat.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "Tree Seasons", D("tree seasons original 2010-12 done at Black Cat.jpg"), { year: "2010", medium: "Pencil crayon on paper" }],
  ["drawings", "Poinsettia", D("poinsettia 2011-01-21.jpg"), { year: "2011", medium: "Pencil crayon on paper" }],
  ["drawings", "Seasonal Illustration", D("Seasonal illo.jpg"), { medium: "Coloured pencil and ink on paper" }],
  ["drawings", "Snow / Slash / Fence", D("snow-slash-fence 2011-01-22on/snow-slash-fence final composite w new 2011-01-24.jpg"), { year: "2011", medium: "Drawing with digital composite" }],

  // Word Salad (collages)
  ["wordSalad", "Incidental Ampersand", A("Collage and multimedia/Incidental Ampersand 2019-03-16.jpg"), { year: "2019" }],
  ["wordSalad", "Palimpsest", A("Collage and multimedia/Palimpsest 2019-03-16.jpg"), { year: "2019" }],
  ["wordSalad", "Surreptitiously (with the P Askew)", A("Collage and multimedia/Surreptitiously with the P askew 2019-03-16.jpg"), { year: "2019" }],
  ["wordSalad", "Incidental Redemption Event", A("Collage and multimedia/incidental-redemption-event.jpg"), {}],
  ["wordSalad", "FEH", A("Collage Words series/IMG_20200531_194905.jpg"), { year: "2020", series: "Collage Words" }],
  ["wordSalad", "Lanterns", A("Collage and multimedia/IMG_2818.JPG"), { year: "2017", medium: "Collage and mixed media", status: "sold" }],

  // Photographs
  ["photographs", "Leaves at the Window", C("5 photographs/2015-10-11 17.59.02 backwards.jpg"), { year: "2015" }],
  ["photographs", "Glasses on Placemat 1", C("5 photographs/P1010139.JPG"), {}],
  ["photographs", "Glasses on Placemat 2", C("5 photographs/P1010142.JPG"), {}],
  ["photographs", "Toy Horse in the Hoya", C("5 photographs/P1010171.JPG"), {}],
  ["photographs", "Farewell, Thou Good and Faithful Servant", A("Photographs/Flat/Farewell thou good and faithful servant.jpg"), { series: "The FLAT Project" }],

  // Other media
  ["otherMedia", "Cat and Keys", C("6 other media/DSCN1692.JPG"), { medium: "Gel transfer on acrylic" }],
  ["otherMedia", "Self-Portrait in Mirror and Soap 1", A("Weird media/Self portrait in mirror and soap 1.jpg"), { medium: "Soap on mirror, photographed", series: "Self-Portrait in Mirror and Soap" }],
  ["otherMedia", "Self-Portrait in Mirror and Soap 3", A("Weird media/Self-portrait in mirror and soap 3.jpg"), { medium: "Soap on mirror, photographed", series: "Self-Portrait in Mirror and Soap" }],
  ["otherMedia", "Self-Portrait in Mirror and Soap, with Digital Manipulation", A("Weird media/Self-portrait in mirror and soap and digital manipulation.jpg"), { medium: "Soap on mirror, photographed and digitally manipulated", series: "Self-Portrait in Mirror and Soap" }],

  // Pastels
  ["pastels", "Buffo", A("Pastels/Buffo 10-03-28 chalk pastels.JPG"), { year: "2010", series: "Cats" }],
  ["pastels", "Buffo and Poppy", A("Pastels/Buffo and poppy--pastels--exp2.JPG"), { series: "Cats" }],
  ["pastels", "Poppy", A("Pastels/poppy--pastels--Nov 2010.JPG"), { year: "2010" }],
  ["pastels", "Tina's Blue Poppies", A("Pastels/Tina's blue poppies 1.JPG"), {}],
  ["pastels", "Dolan (Art Class Volunteer)", A("Pastels/Dolan the art class volunteer -- sketch -- sienna and white conte on black paper 09-06-25.jpg"), { year: "2009", medium: "Sienna and white conté on black paper" }],
  ["pastels", "Road (Workshop Study)", A("Pastels/Workshop study from a photo by David Shklolny fall 2010.JPG"), { year: "2010", note: "Workshop study after a photograph by David Shkolny." }],
  ["pastels", "Hay Bales (Workshop Study)", A("Pastels/workshop study from D Shkolny photo nov 2010.JPG"), { year: "2010", note: "Workshop study after a photograph by David Shkolny." }],

  // Encaustics
  ["encaustics", "After O'Keeffe 1", A("Encaustics/Encaustic O'Keeffe 1.jpg"), {}],
  ["encaustics", "After O'Keeffe 2", A("Encaustics/Encaustic O'Keeffe 2.jpg"), {}],
  ["encaustics", "Frost", A("Encaustics/Encaustic frost.jpg"), {}],
  ["encaustics", "Prairie 1", A("Encaustics/Encaustic prairie.JPG"), {}],
  ["encaustics", "Prairie 2", A("Encaustics/Encaustic prairie 2.jpg"), {}],
  ["encaustics", "Prairie 3", A("Encaustics/Encaustic prairie 3.jpg"), {}],
  ["encaustics", "Magpie (Workshop)", A("Encaustics/magpie--encaustics wkshp exp 1.JPG"), {}],

  // Prints
  ["prints", "City Skyline (Orange)", A("Prints--lino, etc/DSCN1775.JPG"), {}],
  ["prints", "City Skyline (Magenta)", A("Prints--lino, etc/DSCN1864.JPG"), {}],
  ["prints", "Cat (Linocut, Blue and Black)", A("Prints--lino, etc/DSCN1801.JPG"), { medium: "Linocut" }],
  ["prints", "Monoprint I", A("Prints--lino, etc/DSCN1858.JPG"), {}],
  ["prints", "Blue Beast", A("Prints--lino, etc/DSCN1860.JPG"), {}],
]

const counters = {}
const usedSlugs = new Set()
for (const [cat, title, file, o] of artworks) {
  const c = categories[cat]
  let slug = slugify(title)
  if (usedSlugs.has(slug)) slug += `-${cat}`
  usedSlugs.add(slug)
  const order = (counters[cat] = (counters[cat] ?? -1) + 1)
  const medium = o.medium ?? c.medium
  const alt = `${title}${o.year ? ` (${o.year})` : ""}, ${medium.toLowerCase()} by ${ARTIST}`
  const doc = {
    _id: `artwork-${slug}`,
    _type: "artwork",
    title,
    slug: { _type: "slug", current: slug },
    category: { _type: "reference", _ref: c.id },
    image: img(file, { dir: "art", name: slug, alt, credit: ARTIST }),
    medium,
    status: o.status ?? "notForSale",
    watermarkImage: true,
    order,
  }
  if (o.year) doc.year = o.year
  if (o.dimensions) doc.dimensions = o.dimensions
  if (o.series) doc.series = o.series
  if (o.note) doc.description = [block(o.note)]
  docs.push(doc)
}

// ── 2. Gallery categories (re-emitted with descriptions; cover falls back to first artwork) ──
for (const c of Object.values(categories)) {
  const base = seedById[c.id]
  if (!base) throw new Error(`Category ${c.id} not in seed.ndjson`)
  docs.push({ ...base, description: c.description })
}

// ── 3. Headshots → press kit, about page, settings ────────────────────────
const headshots = [
  { file: join(MACEWAN, "22-09 CJD cropped credit Steven Stefaniuk.jpg"), credit: "Steven Stefaniuk", caption: "Candas Jane Dorsey, MacEwan University, 2022", max: 4000 },
  { file: join(MACEWAN, "2209_StaffFacultyPhotos-7782 Steven Stefaniuk.jpg"), credit: "Steven Stefaniuk", caption: "Candas Jane Dorsey, MacEwan University, 2022", max: 4000 },
  { file: join(PHOTOS, "Candas--artist with her work 2020-08-31--photo Janice MacDonald.jpg"), credit: "Janice MacDonald", caption: "Candas with her paintings, 2020", max: 4000 },
  { file: join(PHOTOS, "photo credit PJ Groeneveldt cropped.jpg"), credit: "PJ Groeneveldt", caption: "Candas Jane Dorsey", max: 4000 },
  { file: join(PHOTOS, "candas-palais wcon 2009 photo Christian Sauve.jpg"), credit: "Christian Sauvé", caption: "Worldcon, Montréal, 2009", max: 4000 },
  { file: join(MUGS, "most recent CJD ICFA 2002or 2003 -- credit Beth Gwinn.jpg"), credit: "Beth Gwinn", caption: "International Conference on the Fantastic in the Arts, c. 2002", max: 4000 },
]
const pressKit = {
  ...seedById.pressKit,
  headshots: headshots.map((h, i) => ({
    _key: key(),
    ...img(h.file, { dir: "photos", name: `headshot-${i + 1}-${slugify(h.credit)}`, alt: `Portrait of ${ARTIST}. Photo: ${h.credit}`, credit: h.credit, caption: h.caption, max: h.max, quality: 92 }),
  })),
}
docs.push(pressKit)

docs.push({
  ...seedById["page-about"],
  featuredImage: img(join(MACEWAN, "22-09 CJD cropped credit Steven Stefaniuk.jpg"), { dir: "photos", name: "about-candas-2022", alt: `${ARTIST}, 2022`, credit: "Steven Stefaniuk" }),
})
docs.push({
  ...seedById.siteSettings,
  ogImage: img(join(MACEWAN, "2209_StaffFacultyPhotos-7782 Steven Stefaniuk.jpg"), { dir: "photos", name: "og-default", alt: `${ARTIST}`, credit: "Steven Stefaniuk" }),
})
docs.push({
  ...seedById.flatProject,
  featuredImage: img(join(ART, "Photographs/Flat/Farewell thou good and faithful servant.jpg"), { dir: "photos", name: "flat-farewell", alt: "Farewell, Thou Good and Faithful Servant: flattened metal on pavement", credit: ARTIST, caption: "Farewell, Thou Good and Faithful Servant" }),
})

// ── 4. Book covers (Open Library scans, low-res placeholders until publisher files arrive) ──
const covers = ["whats-the-matter-with-mary-jane", "a-paradigm-of-earth", "black-wine", "ice-and-other-stories", "vanilla-and-other-stories", "dark-earth-dreams", "machine-sex-and-other-stories", "food-of-my-people", "land-space", "tesseracts-8", "tesseracts-3"]
for (const slug of covers) {
  const base = seedById[`book-${slug}`]
  if (!base) throw new Error(`book-${slug} not in seed`)
  const file = join(ASSETS, "covers", `${slug}.jpg`)
  if (!existsSync(file)) throw new Error(`Missing cover ${file}`)
  docs.push({
    ...base,
    coverImage: { _type: "image", _sanityAsset: `image@file://./seed-assets/covers/${slug}.jpg`, alt: `Cover of ${base.title}`, credit: base.publisher ? `Cover: ${base.publisher}` : undefined, caption: "Placeholder scan; replace with publisher artwork" },
  })
}

// ── 5. Other writing (from the résumé; Candas to expand) ─────────────────
const writing = [
  { title: "Sleeping in a Box", kind: "story", publishedIn: "Machine Sex and other stories (Tesseract Books)", year: "1988", excerpt: "Winner of the Canadian Science Fiction and Fantasy Award (Aurora), 1988." },
  { title: "(Learning About) Machine Sex", kind: "story", publishedIn: "Machine Sex and other stories; reprinted in The Norton Book of Science Fiction", year: "1988" },
]
writing.forEach((w, i) => {
  const slug = slugify(w.title)
  docs.push({ _id: `writing-${slug}`, _type: "writing", slug: { _type: "slug", current: slug }, order: i, ...w })
})

// ── write ndjson + process images ─────────────────────────────────────────
for (const d of docs) for (const k of Object.keys(d)) if (d[k] === undefined) delete d[k]
mkdirSync(join(ASSETS, "art"), { recursive: true })
mkdirSync(join(ASSETS, "photos"), { recursive: true })
writeFileSync(OUT_NDJSON, docs.map((d) => JSON.stringify(d)).join("\n") + "\n")
console.log(`wrote ${OUT_NDJSON}: ${docs.length} documents (${artworks.length} artworks)`)

let n = 0
for (const j of jobs) {
  if (existsSync(j.dest) && !process.env.FORCE) {
    assetBytes += statSync(j.dest).size
    continue
  }
  await sharp(j.src, { failOn: "none" }).rotate().resize(j.max, j.max, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: j.quality, mozjpeg: true }).toFile(j.dest)
  assetBytes += statSync(j.dest).size
  n++
}
console.log(`processed ${n} images (${jobs.length - n} already present), ${(assetBytes / 1e6).toFixed(1)} MB in seed-assets`)
