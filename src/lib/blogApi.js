import axios from "axios";

/**
 * Shared blog API client + data normalizers.
 *
 * Backend contract (see README.md):
 * - GET    /api/blogs?status=published&limit=200
 * - GET    /api/blogs/:idOrSlug
 * - GET    /api/blogs/categories
 * - GET    /api/blogs/tags
 * - POST   /api/blogs                (admin cookie)
 * - PUT    /api/blogs/:id            (admin cookie)
 * - DELETE /api/blogs/:id            (admin cookie)
 */

export const BLOG_API = "/api/blogs";

export const FALLBACK_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=82";

const REQUEST_CONFIG = { withCredentials: true };

const text = (value) => (typeof value === "string" ? value.trim() : "");

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function initialsFromName(name = "") {
  const initials = String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return initials || "BS";
}

export function formatBlogDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** Split textarea content into one entry per non-empty line. */
export function splitLines(value = "") {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function emptyBlogSection() {
  return { heading: "", paragraphsText: "", bulletsText: "" };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => (typeof tag === "string" ? tag : tag?.name))
    .map((tag) => text(tag))
    .filter(Boolean);
}

function normalizeTakeaways(takeaways) {
  if (!Array.isArray(takeaways)) return [];
  return takeaways
    .map((item) => (typeof item === "string" ? item : item?.content))
    .map((item) => text(item))
    .filter(Boolean);
}

function normalizeSectionParts(section = {}) {
  const paragraphs = Array.isArray(section.paragraphs)
    ? section.paragraphs.map(text).filter(Boolean)
    : [];
  const bullets = Array.isArray(section.bullets)
    ? section.bullets.map(text).filter(Boolean)
    : [];

  if (paragraphs.length || bullets.length) {
    return { paragraphs, bullets };
  }

  const contents = Array.isArray(section.contents)
    ? [...section.contents].sort(
        (a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0),
      )
    : [];

  contents.forEach((item) => {
    const content = text(typeof item === "string" ? item : item?.content);
    if (!content) return;
    if (content.startsWith("•")) {
      const bullet = content.replace(/^•\s*/, "").trim();
      if (bullet) bullets.push(bullet);
    } else {
      paragraphs.push(content);
    }
  });

  return { paragraphs, bullets };
}

function normalizeSections(sections) {
  if (!Array.isArray(sections)) return [];
  return [...sections]
    .sort((a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0))
    .map((section) => ({
      heading: text(section?.heading),
      ...normalizeSectionParts(section),
    }))
    .filter((section) => section.heading);
}

/**
 * Convert a backend blog record (or a static fallback post) into the single
 * UI shape consumed by `Blog.jsx` and `BlogManager.jsx`.
 */
export function normalizePost(raw = {}) {
  const category =
    typeof raw.category === "string"
      ? raw.category
      : text(raw.category?.name) || text(raw.category_name) || "Solar";

  const categoryId =
    raw.category_id ?? raw.categoryId ?? raw.category?.id ?? null;

  const publishedAt = raw.published_at || raw.created_at || raw.date || null;

  const readMinutes =
    Number(raw.read_time ?? raw.readMinutes) ||
    Number.parseInt(raw.readTime, 10) ||
    5;

  const readTime =
    typeof raw.readTime === "string" && /min/i.test(raw.readTime)
      ? raw.readTime
      : `${readMinutes} min read`;

  const quoteSource = raw.quote;
  const quoteText =
    typeof quoteSource === "string"
      ? quoteSource
      : text(quoteSource?.quote_text) || text(quoteSource?.text);
  const quoteBy = text(quoteSource?.quote_author) || text(quoteSource?.by);

  const author = text(raw.author_name) || text(raw.author) || "BHsquare Journal";

  return {
    id: raw.id,
    slug: text(raw.slug) || slugify(raw.title) || `post-${raw.id ?? Date.now()}`,
    title: text(raw.title) || "Untitled story",
    category,
    categoryId,
    date: formatBlogDate(publishedAt),
    publishedAt,
    readMinutes,
    readTime,
    author,
    authorRole:
      text(raw.author_role) || text(raw.authorRole) || "BHsquare Engineering Desk",
    initials:
      text(raw.author_initials) ||
      text(raw.initials) ||
      initialsFromName(author),
    image: text(raw.featured_image) || text(raw.image) || FALLBACK_BLOG_IMAGE,
    imageAlt: text(raw.image_alt) || text(raw.imageAlt) || text(raw.title),
    excerpt: text(raw.excerpt),
    intro: text(raw.intro) || text(raw.excerpt),
    takeaways: normalizeTakeaways(raw.takeaways),
    sections: normalizeSections(raw.sections),
    quote: quoteText ? { text: quoteText, by: quoteBy } : null,
    tags: normalizeTags(raw.tags),
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured),
    isRecommended: Boolean(raw.is_recommended ?? raw.isRecommended),
    status: text(raw.status) || "draft",
    raw,
  };
}

export async function fetchPublishedPosts({ limit = 200, search } = {}) {
  const { data } = await axios.get(BLOG_API, {
    ...REQUEST_CONFIG,
    params: {
      status: "published",
      limit,
      ...(search ? { search } : {}),
    },
  });
  const posts = data?.data?.posts ?? [];
  return posts.map(normalizePost);
}

export async function fetchAdminPosts({ status, limit = 200, search } = {}) {
  const { data } = await axios.get(BLOG_API, {
    ...REQUEST_CONFIG,
    params: {
      limit,
      ...(status && status !== "all" ? { status } : {}),
      ...(search ? { search } : {}),
    },
  });
  return {
    posts: (data?.data?.posts ?? []).map(normalizePost),
    total: data?.data?.total ?? 0,
  };
}

export async function fetchBlogPost(identifier) {
  if (identifier === undefined || identifier === null || identifier === "") {
    throw new Error("A post id or slug is required");
  }
  const { data } = await axios.get(
    `${BLOG_API}/${encodeURIComponent(identifier)}`,
    REQUEST_CONFIG,
  );
  if (!data?.data) throw new Error(data?.message || "Blog post not found");
  return normalizePost(data.data);
}

export async function fetchBlogCategories() {
  const { data } = await axios.get(`${BLOG_API}/categories`, REQUEST_CONFIG);
  return (data?.data ?? []).map((category) => ({
    id: category.id,
    name: text(category.name),
    slug: text(category.slug) || slugify(category.name),
  }));
}

export async function fetchBlogTags() {
  const { data } = await axios.get(`${BLOG_API}/tags`, REQUEST_CONFIG);
  return (data?.data ?? []).map((tag) => ({
    id: tag.id,
    name: text(tag.name),
    slug: text(tag.slug) || slugify(tag.name),
  }));
}

export async function createBlogPost(payload) {
  const { data } = await axios.post(BLOG_API, payload, REQUEST_CONFIG);
  return normalizePost(data?.data);
}

export async function updateBlogPost(id, payload) {
  const { data } = await axios.put(`${BLOG_API}/${id}`, payload, REQUEST_CONFIG);
  return normalizePost(data?.data);
}

export async function deleteBlogPost(id) {
  const { data } = await axios.delete(`${BLOG_API}/${id}`, REQUEST_CONFIG);
  return data;
}

/** Build the exact snake_case payload the backend expects. */
export function buildPostPayload(form = {}) {
  const title = text(form.title);
  const categoryId =
    form.category_id && form.category_id !== "new"
      ? Number(form.category_id)
      : undefined;
  const categoryName = text(form.category_name);

  const sections = (Array.isArray(form.sections) ? form.sections : [])
    .filter((section) => text(section?.heading))
    .map((section, index) => ({
      heading: text(section.heading),
      sort_order: index,
      paragraphs: splitLines(section.paragraphsText),
      bullets: splitLines(section.bulletsText),
    }));

  const quoteText = text(form.quote_text);
  const authorName = text(form.author_name);

  return {
    title,
    slug: text(form.slug) || slugify(title),
    ...(categoryId ? { category_id: categoryId } : {}),
    ...(!categoryId && categoryName ? { category_name: categoryName } : {}),
    author_name: authorName,
    author_role: text(form.author_role),
    author_initials:
      text(form.author_initials).toUpperCase() ||
      initialsFromName(authorName),
    excerpt: text(form.excerpt),
    intro: text(form.intro),
    featured_image: text(form.featured_image),
    image_alt: text(form.image_alt),
    read_time: Number(form.read_time) || 5,
    is_featured: Boolean(form.is_featured),
    is_recommended: Boolean(form.is_recommended),
    status: ["draft", "published", "archived"].includes(form.status)
      ? form.status
      : "draft",
    takeaways: splitLines(form.takeawaysText),
    sections,
    quote: quoteText
      ? {
          quote_text: quoteText,
          quote_author: text(form.quote_author),
        }
      : null,
    tags: String(form.tagsText || "")
      .split(/[,\n]/)
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

/** Convert a post (normalized or raw) into editable form state. */
export function formFromPost(post = {}) {
  const normalized = post?.raw ? normalizePost(post.raw) : normalizePost(post);
  const raw = post?.raw || post || {};

  return {
    title: text(raw.title) || normalized.title,
    slug: text(raw.slug) || normalized.slug,
    category_id:
      normalized.categoryId !== null && normalized.categoryId !== undefined
        ? String(normalized.categoryId)
        : "",
    category_name: "",
    author_name: text(raw.author_name) || normalized.author,
    author_role: text(raw.author_role) || normalized.authorRole,
    author_initials: text(raw.author_initials) || normalized.initials,
    excerpt: text(raw.excerpt) || normalized.excerpt,
    intro: text(raw.intro) || normalized.intro,
    featured_image: text(raw.featured_image) || normalized.image,
    image_alt: text(raw.image_alt) || normalized.imageAlt,
    read_time: normalized.readMinutes,
    is_featured: normalized.isFeatured,
    is_recommended: normalized.isRecommended,
    status: normalized.status || "draft",
    takeawaysText: normalized.takeaways.join("\n"),
    tagsText: normalized.tags.join(", "),
    quote_text: normalized.quote?.text || "",
    quote_author: normalized.quote?.by || "",
    sections: normalized.sections.length
      ? normalized.sections.map((section) => ({
          heading: section.heading,
          paragraphsText: section.paragraphs.join("\n"),
          bulletsText: section.bullets.join("\n"),
        }))
      : [emptyBlogSection()],
  };
}

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
