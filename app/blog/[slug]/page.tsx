"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, Tag, ArrowLeft, ChevronRight, BookOpen, User } from "lucide-react"
import { getPostBySlug, getRelatedPosts, formatDate, type BlogCategory } from "@/lib/blog-data"

// ── Category badge colours + dark-mode override classes ───────────────────────
const categoryColours: Record<BlogCategory, string> = {
  "Health & Tips":      "bg-emerald-100 text-emerald-700 badge-health",
  "Program Stories":    "bg-pink-100   text-pink-700   badge-program",
  "Thought Leadership": "bg-violet-100 text-violet-700 badge-thought",
}

// ── Simple Markdown-to-JSX renderer ──────────────────────────────────────────
function renderContent(content: string) {
  const lines = content.trim().split("\n")
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("**") && line.endsWith("**") && line.includes("**", 2)) {
      // Bold-only line → treat as a sub-heading
      const text = line.replace(/\*\*/g, "")
      elements.push(
        <p key={key++} className="font-bold text-gray-900 dark:text-white mt-6 mb-1">
          {text}
        </p>
      )
    } else if (line.startsWith("- ")) {
      // Collect consecutive list items
      const listItems: string[] = [line.slice(2)]
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
        i++
        listItems.push(lines[i].slice(2))
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1.5 my-4 text-gray-700 dark:text-gray-300">
          {listItems.map((item, idx) => {
            // Handle **bold** within list items
            const parts = item.split(/\*\*(.*?)\*\*/)
            return (
              <li key={idx}>
                {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white">{part}</strong> : part
                )}
              </li>
            )
          })}
        </ul>
      )
    } else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      // Italic blockquote
      elements.push(
        <blockquote key={key++} className="border-l-4 border-pink-400 pl-4 my-6 italic text-gray-600 dark:text-gray-300">
          {line.replace(/\*/g, "")}
        </blockquote>
      )
    } else if (line.trim() === "") {
      // Skip blank lines (used as spacers between elements)
    } else {
      // Regular paragraph — handle inline **bold**
      const parts = line.split(/\*\*(.*?)\*\*/)
      elements.push(
        <p key={key++} className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white font-semibold">{part}</strong> : part
          )}
        </p>
      )
    }
  }

  return elements
}

// ── Related Post Card ─────────────────────────────────────────────────────────
function RelatedCard({ post }: { post: ReturnType<typeof getRelatedPosts>[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColours[post.category]}`}>
          {post.category}
        </span>
        <h4 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Clock size={10} /> {post.readTime} min
        </p>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPostPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0]
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) return notFound()

  const related = getRelatedPosts(post, 3)

  return (
    <main className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Back Link ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">

          {/* ── Article ── */}
          <article>
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative h-64 sm:h-80 md:h-[420px] rounded-3xl overflow-hidden mb-8"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColours[post.category]}`}>
                {post.category}
              </span>
            </motion.div>

            {/* Title & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                    <User size={14} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{post.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.authorRole}</p>
                  </div>
                </div>
                <span className="text-gray-300 dark:text-gray-600 hidden sm:block">|</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</span>
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={13} />
                  {post.readTime} min read
                </span>
              </div>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-8 leading-relaxed border-l-4 border-pink-400 pl-4">
                {post.excerpt}
              </p>
            </motion.div>

            {/* Body content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose-content"
            >
              {renderContent(post.content)}
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700">
                  <Tag size={11} />
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 sm:p-8 bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 rounded-2xl text-center"
            >
              <BookOpen size={28} className="mx-auto text-pink-600 dark:text-pink-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Support Our Mission
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 max-w-md mx-auto">
                AdeGrange Child Foundation works to protect the health and futures of mothers and children across Africa. Join us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/donate"
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Donate
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 border border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-600 hover:text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </motion.div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-8">

            {/* Related Posts */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-5">
                  Related Articles
                </h3>
                <div className="space-y-5">
                  {related.map((r) => (
                    <RelatedCard key={r.slug} post={r} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Browse by category */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Browse by Category
              </h3>
              <div className="space-y-2">
                {["Health & Tips", "Program Stories", "Thought Leadership"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog?category=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors py-1.5"
                  >
                    {cat}
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </motion.div>

          </aside>
        </div>

      </div>
    </main>
  )
}
