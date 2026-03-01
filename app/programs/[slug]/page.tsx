import Link from "next/link"

const data: Record<string, any> = {
  "full-life-nursery-2017": {
    title: "2017 Partnership — Full Life Nursery & Primary School",
    intro:
      "This partnership supported early learning, improved classroom experiences, and strengthened home–school collaboration.",
    photosUrl:
      "https://drive.google.com/drive/folders/1YT5RSb4JG0c8KNX1iGMS8FtSjL-znTWH?usp=sharing",
  },

  "young-shapers-2018": {
    title: "2018 Partnership — Young Shapers Club",
    intro:
      "Youth mentorship and leadership development through structured sessions and community support.",
    folderUrl:
      "https://drive.google.com/drive/folders/1i6zRL7Acf5fKynvNKiGD7S0oCTgV2pN0?usp=sharing",
    pdfs: [
      {
        label: "Financing IDP Children’s Education (PDF)",
        url: "https://drive.google.com/file/d/1D11SaSOwhCF6ozarFl-sOgX0fxc-L8gz/view?usp=sharing",
      },
      {
        label: "Young Shapers Progress Report (PDF)",
        url: "https://drive.google.com/file/d/1ksHEby_U9JfHEu3AF-_YYc1nywC4YAQ5/view?usp=sharing",
      },
    ],
  },

  "peer-to-peer-2017": {
    title: "Summer 2017 — Peer-to-Peer Dialogue Program",
    intro:
      "A cross-community dialogue initiative building empathy, leadership, and peer learning.",
    dayFolders: [
      {
        label: "Day 1 Photo Gallery",
        url: "https://drive.google.com/drive/folders/1_psaI_D8GsCO7D9CU2wHfR6qfbHP3bog?usp=drive_link",
      },
      {
        label: "Day 2 Photo Gallery",
        url: "https://drive.google.com/drive/folders/1KjirgKnIW9-qyRt2pvHNOY0yDxxuf9-D?usp=drive_link",
      },
    ],
    youtubeUrl:
      "https://www.youtube.com/watch?si=o4_oDkwkZWa3kRaB&v=7Xn_ZcZEfac&feature=youtu.be",
  },

  "girls-health-2019": {
    title: "Summer 2019 — Girls Health Matter",
    intro:
      "Supporting adolescent girls through health education, awareness, and school-based engagement.",
    dayFolders: [
      {
        label: "Day 1 Gallery — Kubwa",
        url: "https://drive.google.com/drive/folders/1qRhYyWBFBVFtJkZkkyqPRR4Aj_M0iYBV?usp=drive_link",
      },
      {
        label: "Day 2 Gallery — Byazin",
        url: "https://drive.google.com/drive/folders/1Xmkodei-Sb6YeXTf_MBlE6-LxS4dQDRm?usp=sharing",
      },
    ],
    docUrl:
      "https://docs.google.com/document/d/1-vqFgpwt0B6DYPn9rLlOshXedqoLiguG/edit?usp=drive_link&ouid=100354097873620639976&rtpof=true&sd=true",
  },

  "feeding-project-2019": {
    title: "2019 Feeding Project — Chicago, Illinois",
    intro:
      "An outreach initiative providing support and structured feeding interventions for families.",
    docUrl:
      "https://docs.google.com/document/d/13L_FarXMjbo3Cm3NuK_TL2mP7q20dyMA/edit?usp=drive_link&ouid=100354097873620639976&rtpof=true&sd=true",
  },
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = data[slug]

  if (!p) {
    return (
      <div className="min-h-screen p-10">
        <p>Program not found.</p>
        <Link href="/programs" className="underline">
          Back to programs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/programs" className="text-sm underline text-zinc-600 dark:text-zinc-400">
          ← Back to Programs
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white">
          {p.title}
        </h1>

        <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {p.intro}
        </p>

        <div className="mt-10 grid gap-4">
          {p.photosUrl || p.folderUrl ? (
            <a
              href={p.photosUrl || p.folderUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-white">View Photo Gallery</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Opens the shared Google Drive folder in a new tab.
              </div>
            </a>
          ) : null}

          {Array.isArray(p.dayFolders) &&
            p.dayFolders.map((x: any) => (
              <a
                key={x.url}
                href={x.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="font-medium text-zinc-900 dark:text-white">{x.label}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Open gallery</div>
              </a>
            ))}

          {Array.isArray(p.pdfs) &&
            p.pdfs.map((x: any) => (
              <a
                key={x.url}
                href={x.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="font-medium text-zinc-900 dark:text-white">{x.label}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Open PDF</div>
              </a>
            ))}

          {p.docUrl ? (
            <a
              href={p.docUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-white">Open Report Document</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Opens the Google Doc in a new tab.
              </div>
            </a>
          ) : null}

          {p.youtubeUrl ? (
            <a
              href={p.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-white">Watch Video</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Opens YouTube video in a new tab.
              </div>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}