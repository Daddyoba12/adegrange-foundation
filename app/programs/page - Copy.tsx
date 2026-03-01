"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const programs = [
  {
    slug: "full-life-nursery-2017",
    title: "2017 Partnership — Full Life Nursery & Primary School",
    blurb: "Supporting early childhood education through community partnership and engagement.",
    photosUrl: "https://drive.google.com/drive/folders/1YT5RSb4JG0c8KNX1iGMS8FtSjL-znTWH?usp=sharing",
  },
  {
    slug: "young-shapers-2018",
    title: "2018 Partnership — Young Shapers Club",
    blurb: "Empowering youth leadership and structured development through mentorship initiatives.",
    // Main folder (your link) + 2 PDF files (your links)
    folderUrl: "https://drive.google.com/drive/folders/1i6zRL7Acf5fKynvNKiGD7S0oCTgV2pN0?usp=sharing",
    pdf1Url: "https://drive.google.com/file/d/1D11SaSOwhCF6ozarFl-sOgX0fxc-L8gz/view?usp=sharing",
    pdf2Url: "https://drive.google.com/file/d/1ksHEby_U9JfHEu3AF-_YYc1nywC4YAQ5/view?usp=sharing",
  },
  {
    slug: "peer-to-peer-2017",
    title: "Summer 2017 — Peer-to-Peer Dialogue Program",
    blurb: "Promoting cross-community dialogue and youth participation in leadership development.",
    folderUrl: "https://drive.google.com/drive/folders/1ceTr8EqWlaaJHBl85sYdRkniyXKTrZ8Y?usp=sharing",
    day1Url: "https://drive.google.com/drive/folders/1_psaI_D8GsCO7D9CU2wHfR6qfbHP3bog?usp=drive_link",
    day2Url: "https://drive.google.com/drive/folders/1KjirgKnIW9-qyRt2pvHNOY0yDxxuf9-D?usp=drive_link",
    // If you have a YouTube link, place it here too:
    youtubeUrl: "https://www.youtube.com/watch?si=o4_oDkwkZWa3kRaB&v=7Xn_ZcZEfac&feature=youtu.be",
  },
  {
    slug: "girls-health-2019",
    title: "Summer 2019 — Girls Health Matter",
    blurb: "Advancing adolescent health awareness and educational support for girls.",
    folderUrl: "https://drive.google.com/drive/folders/1TAJBu-gCzUXXpFIdHS1Iz8E7qjXFXfy6?usp=drive_link",
    day1Url: "https://drive.google.com/drive/folders/1qRhYyWBFBVFtJkZkkyqPRR4Aj_M0iYBV?usp=drive_link",
    day2Url: "https://drive.google.com/drive/folders/1Xmkodei-Sb6YeXTf_MBlE6-LxS4dQDRm?usp=sharing",
    docUrl: "https://docs.google.com/document/d/1-vqFgpwt0B6DYPn9rLlOshXedqoLiguG/edit?usp=drive_link&ouid=100354097873620639976&rtpof=true&sd=true",
  },
  {
    slug: "feeding-project-2019",
    title: "2019 Feeding Project — Chicago, Illinois",
    blurb: "International outreach initiative supporting families through structured feeding and welfare services.",
    docUrl: "https://docs.google.com/document/d/13L_FarXMjbo3Cm3NuK_TL2mP7q20dyMA/edit?usp=drive_link&ouid=100354097873620639976&rtpof=true&sd=true",
  },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-white">
            Our Programs & Impact
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Explore our key partnerships and community projects. Each program page includes a short write-up and direct access to photos, reports, and media.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {programs.map((p) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-300">
                  {p.blurb}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/programs/${p.slug}`}
                    className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  >
                    View Program
                  </Link>

                  {/* Optional quick external access */}
                  {p.photosUrl || p.folderUrl ? (
                    <a
                      href={(p.photosUrl || p.folderUrl)!}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                    >
                      Open Gallery
                    </a>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}