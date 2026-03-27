'use client'

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Clock, Tag, ChevronRight, BookOpen } from "lucide-react"
import { blogPosts, categories, formatDate, monthlyHeroImages, type BlogCategory, type BlogPost } from "@/lib/blog-data"
import { supabase } from '@/lib/supabase'

const categoryColours: Record<BlogCategory, string> = {
  "Health & Tips":      "bg-emerald-100 text-emerald-700 badge-health",
  "Program Stories":    "bg-pink-100   text-pink-700   badge-program",
  "Thought Leadership": "bg-violet-100 text-violet-700 badge-thought",
}

function PostCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="blog-card group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Fix 2 — stronger gradient in dark mode so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent dark:from-black/70 dark:via-black/20" />
        {/* Fix 3 — badge moved to bottom-right with frosted glass */}
        <span className={`absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryColours[post.category]}`}>
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        <div className="blog-card-meta flex items-center gap-3 text-xs text-gray-500">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readTime} min read
          </span>
        </div>

        {/* Fix 1 — explicit inline colour so global .dark overrides can't hide it */}
        <h3
          className="blog-card-title text-sm sm:text-base font-bold leading-snug group-hover:text-pink-500 transition-colors line-clamp-2"
          style={{ color: "var(--card-title-color, #111827)" }}
        >
          {post.title}
        </h3>

        <p
          className="blog-card-excerpt text-xs sm:text-sm line-clamp-3 flex-1"
          style={{ color: "var(--card-body-color, #4b5563)" }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="blog-card-tag text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center gap-1"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="blog-card-link mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400 hover:gap-2 transition-all"
        >
          Read article <ChevronRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All")
  const [search, setSearch] = useState("")
  const [dynamicPosts, setDynamicPosts] = useState<BlogPost[]>([])

  // Fetch any admin-published posts from Supabase
  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (!data) return
        setDynamicPosts(
          data.map((p: any) => ({
            slug:       p.slug,
            title:      p.title,
            excerpt:    p.excerpt,
            content:    p.content ?? "",
            category:   p.category as BlogCategory,
            author:     p.author,
            authorRole: p.author_role ?? "",
            date:       p.date,
            readTime:   p.read_time ?? 5,
            image:      p.image_url ?? "/images/blob/MainBlobpicture.jpg",
            featured:   p.featured ?? false,
            tags:       p.tags ?? [],
          }))
        )
      })
  }, [])

  // Merge dynamic (Supabase) posts first, then static fallback
  const allPosts = useMemo(() => {
    const staticSlugs = new Set(blogPosts.map(p => p.slug))
    const newOnly = dynamicPosts.filter(p => !staticSlugs.has(p.slug))
    return [...newOnly, ...blogPosts]
  }, [dynamicPosts])

  const month = new Date().getMonth()

  // ── Always use the fixed main blog picture as the hero ──
  const featuredImage = "/images/blob/MainBlobpicture.jpg"
  const featuredPost = allPosts[month % allPosts.length]

  const rotatedPosts = useMemo(() => {
    const offset = (month + 1) % allPosts.length
    return [...allPosts.slice(offset), ...allPosts.slice(0, offset)]
  }, [month, allPosts])

  const filtered = useMemo(() => {
    return rotatedPosts
      .filter((p) => p.slug !== featuredPost.slug || activeCategory !== "All" || search)
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .filter((p) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
  }, [rotatedPosts, featuredPost.slug, activeCategory, search])

  const showFeatured = !search && activeCategory === "All"

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3">
            <BookOpen size={15} />
            Our Blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            Insights &amp; Stories
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Health education, programme impact, and advocacy perspectives from the AdeGrange Child Foundation team.
          </p>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-xl mx-auto mb-6 sm:mb-8"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles, topics or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base rounded-xl border
                       border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </motion.div>

        {/* ── Category Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12"
        >
          {(["All", ...categories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as BlogCategory | "All")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Featured Post ── */}
        {showFeatured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 sm:mb-14"
          >
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[240px] sm:h-[380px] md:h-[480px]">
                <Image
                  src={featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center center" }}
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Featured badge */}
                <span className="absolute top-4 sm:top-6 left-4 sm:left-6 text-xs font-bold px-3 py-1.5 rounded-full bg-pink-600 text-white tracking-wide uppercase">
                  Featured
                </span>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10 text-white">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 sm:mb-3 inline-block ${categoryColours[featuredPost.category]}`}>
                    {featuredPost.category}
                  </span>
                  <h2 className="text-lg sm:text-2xl md:text-4xl font-bold leading-tight mb-2 sm:mb-3 group-hover:text-pink-300 transition-colors line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-200 text-xs sm:text-sm max-w-2xl line-clamp-2 mb-2 sm:mb-4 hidden sm:block">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                    <span>{featuredPost.author}</span>
                    <span>·</span>
                    <span>{formatDate(featuredPost.date)}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Clock size={12} />
                      {featuredPost.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 text-gray-500 dark:text-gray-400">
            <Search size={36} className="mx-auto mb-4 opacity-40" />
            <p className="text-base sm:text-lg font-medium">No articles found</p>
            <p className="text-xs sm:text-sm mt-1">Try a different search term or category.</p>
          </div>
        )}

      </div>
    </main>
  )
}
