import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Edit3,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Layers,
  ListChecks,
  Loader2,
  Plus,
  Quote,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Star,
  Tags,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {
  Button,
  ConfirmDialog,
  Input,
  Modal,
  ModalSection,
  Select,
  Textarea,
} from "../ui";
import {
  buildPostPayload,
  createBlogPost,
  deleteBlogPost,
  emptyBlogSection,
  fetchAdminPosts,
  fetchBlogCategories,
  fetchBlogPost,
  formFromPost,
  getApiErrorMessage,
  slugify,
  updateBlogPost,
} from "../../lib/blogApi";

const STATUS_META = {
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

const STATUS_FILTERS = ["all", "draft", "published", "archived"];

function createEmptyForm() {
  return {
    title: "",
    slug: "",
    category_id: "",
    category_name: "",
    author_name: "BHsquare Engineering Desk",
    author_role: "Solar design, subsidy & installation",
    author_initials: "BE",
    excerpt: "",
    intro: "",
    featured_image: "",
    image_alt: "",
    read_time: 5,
    is_featured: false,
    is_recommended: false,
    status: "draft",
    takeawaysText: "",
    tagsText: "",
    quote_text: "",
    quote_author: "",
    sections: [emptyBlogSection()],
  };
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function ToggleCard({ checked, onChange, icon: Icon, title, description }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#f39200]"
      />
      <span className="flex items-start gap-2.5">
        {Icon && (
          <Icon
            size={16}
            className={checked ? "text-[#f39200]" : "text-slate-400"}
          />
        )}
        <span>
          <span className="block text-xs font-black uppercase tracking-wider">
            {title}
          </span>
          <span
            className={`mt-0.5 block text-[11px] font-medium leading-relaxed ${
              checked ? "text-white/55" : "text-slate-400"
            }`}
          >
            {description}
          </span>
        </span>
      </span>
    </label>
  );
}

const BlogManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [result, categoryList] = await Promise.all([
        fetchAdminPosts({ limit: 200 }),
        fetchBlogCategories().catch(() => []),
      ]);
      setPosts(result.posts);
      setCategories(categoryList);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load blog posts"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
      featured: posts.filter((post) => post.isFeatured).length,
    }),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return [
        post.title,
        post.slug,
        post.category,
        post.author,
        ...(post.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [posts, search, statusFilter]);

  const setField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleTitleChange = (value) => {
    setForm((previous) => {
      const shouldSync = !previous.slug || previous.slug === slugify(previous.title);
      return {
        ...previous,
        title: value,
        slug: shouldSync ? slugify(value) : previous.slug,
      };
    });
  };

  const setSectionField = (index, key, value) => {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [key]: value } : section,
      ),
    }));
  };

  const addSection = () => {
    setForm((previous) => ({
      ...previous,
      sections: [...previous.sections, emptyBlogSection()],
    }));
  };

  const removeSection = (index) => {
    setForm((previous) => ({
      ...previous,
      sections:
        previous.sections.length > 1
          ? previous.sections.filter((_, sectionIndex) => sectionIndex !== index)
          : previous.sections,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setDetailLoading(false);
    setModalOpen(true);
  };

  const openEdit = async (post) => {
    setEditingId(post.id);
    setForm(formFromPost(post));
    setModalOpen(true);
    setDetailLoading(true);

    try {
      const detail = await fetchBlogPost(post.id);
      setForm(formFromPost(detail));
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to load the full post content"),
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setDetailLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!form.author_name.trim()) {
      toast.error("Author name is required");
      return;
    }
    if (form.category_id === "new" && !form.category_name.trim()) {
      toast.error("Enter a name for the new category");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPostPayload(form);
      if (editingId) {
        await updateBlogPost(editingId, payload);
        toast.success("Blog post updated");
      } else {
        await createBlogPost(payload);
        toast.success(
          payload.status === "published"
            ? "Blog post published"
            : "Blog post created",
        );
      }
      setModalOpen(false);
      await loadData({ silent: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save the blog post"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      toast.success("Blog post deleted");
      setDeleteTarget(null);
      await loadData({ silent: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete the blog post"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="crm-shell flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className="crm-workspace flex min-w-0 flex-1 flex-col lg:ml-64">
        <Navbar toggleSidebar={() => setSidebarOpen((open) => !open)} />

        <main className="crm-main p-4 lg:p-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                <BookOpen size={13} /> Website · Content
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 lg:text-4xl">
                Blog Manager
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
                Publish and edit the stories shown on the public Solar Journal
                at{" "}
                <a
                  href="/blogs"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-[#f39200]"
                >
                  /blogs
                </a>
                .
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={RefreshCw}
                loading={refreshing}
                onClick={() => loadData({ silent: true })}
              >
                Refresh
              </Button>
              <Button variant="primary" icon={Plus} onClick={openCreate}>
                New post
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Total posts", value: counts.total, icon: FileText },
              {
                label: "Published",
                value: counts.published,
                icon: Sparkles,
              },
              { label: "Drafts", value: counts.draft, icon: Edit3 },
              { label: "Featured", value: counts.featured, icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className="crm-surface rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </span>
                  <stat.icon size={15} className="text-slate-300" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="crm-surface mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, slug, author, category or tag…"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {STATUS_FILTERS.map((status) => {
                  const isActive = statusFilter === status;
                  const label =
                    status === "all"
                      ? "All"
                      : STATUS_META[status]?.label || status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="crm-surface relative min-h-[380px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80">
                <Loader2 className="animate-spin text-slate-800" size={36} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Loading stories
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-slate-50/70">
                    <tr>
                      {[
                        "Story",
                        "Category",
                        "Status",
                        "Author",
                        "Published",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 ${
                            heading === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <tr
                          key={post.id}
                          className="align-top transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4">
                            <div className="flex min-w-[260px] items-start gap-3">
                              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                <img
                                  src={post.image}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="line-clamp-2 max-w-sm text-sm font-black leading-snug text-slate-900">
                                  {post.title}
                                </p>
                                <p className="mt-1 truncate text-[10px] font-bold text-slate-400">
                                  /{post.slug}
                                </p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  {post.isFeatured && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f39200]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#b86d00]">
                                      <Star size={9} /> Featured
                                    </span>
                                  )}
                                  {post.isRecommended && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                      <Sparkles size={9} /> Recommended
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                                    {post.readTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                              <Tags size={10} className="text-slate-400" />
                              {post.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={post.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#FFD54A] to-[#FF8A00] text-[10px] font-black text-slate-900">
                                {post.initials}
                              </span>
                              <div className="min-w-0">
                                <p className="max-w-[150px] truncate text-xs font-bold text-slate-700">
                                  {post.author}
                                </p>
                                <p className="max-w-[150px] truncate text-[10px] text-slate-400">
                                  {post.authorRole}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <CalendarDays size={12} className="text-slate-300" />
                              {post.date || "—"}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <a
                                href={`/blogs?post=${encodeURIComponent(post.slug)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Preview on the public site"
                                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 transition-colors hover:text-emerald-600"
                              >
                                <ExternalLink size={15} />
                              </a>
                              <button
                                type="button"
                                onClick={() => openEdit(post)}
                                title="Edit post"
                                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 transition-colors hover:text-blue-600"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(post)}
                                title="Delete post"
                                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 transition-colors hover:text-red-600"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-20 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400"
                        >
                          No blog posts match this view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-4 text-[11px] font-medium text-slate-400">
            Showing {filteredPosts.length} of {posts.length} posts. Public
            visitors only see <strong>published</strong> posts.
          </p>
        </main>
      </div>

      <Modal
        as="form"
        onSubmit={handleSubmit}
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit blog post" : "New blog post"}
        subtitle={
          editingId
            ? "Update the story, content blocks and publishing state."
            : "Draft a new story for the public Solar Journal."
        }
        eyebrow="Blog manager"
        icon={BookOpen}
        tone={editingId ? "warning" : "primary"}
        size="2xl"
        preventClose={saving}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={saving || detailLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={Save}
              loading={saving}
              disabled={detailLoading}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update post" : "Create post"}
            </Button>
          </>
        }
      >
        {detailLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="animate-spin text-slate-700" size={30} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Loading full post
            </span>
          </div>
        ) : (
          <div className="crm-form-stack gap-5">
            <ModalSection
              icon={FileText}
              title="Essentials"
              description="Title, URL slug and category."
            >
              <div className="crm-form-stack">
                <Input
                  label="Title"
                  placeholder="PM Surya Ghar in Gujarat: The Complete 2026 Guide"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  required
                />

                <div className="crm-form-grid crm-form-grid--2">
                  <Input
                    label="Slug"
                    placeholder="pm-surya-ghar-gujarat-complete-guide-2026"
                    hint="Used in the public URL: /blogs?post=<slug>"
                    value={form.slug}
                    onChange={(event) =>
                      setField("slug", slugify(event.target.value))
                    }
                    required
                  />

                  <Select
                    label="Category"
                    value={form.category_id}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm((previous) => ({
                        ...previous,
                        category_id: value,
                        category_name:
                          value === "new" ? previous.category_name : "",
                      }));
                    }}
                  >
                    <option value="">Uncategorised</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="new">+ Create new category…</option>
                  </Select>
                </div>

                {form.category_id === "new" && (
                  <Input
                    label="New category name"
                    placeholder="e.g. Government Subsidy"
                    hint="The category is created automatically when you save."
                    value={form.category_name}
                    onChange={(event) =>
                      setField("category_name", event.target.value)
                    }
                    required
                  />
                )}
              </div>
            </ModalSection>

            <ModalSection
              icon={User}
              title="Author"
              description="Shown on cards, the reader header and the article footer."
            >
              <div className="crm-form-grid crm-form-grid--3">
                <Input
                  label="Author name"
                  placeholder="BHsquare Engineering Desk"
                  value={form.author_name}
                  onChange={(event) => setField("author_name", event.target.value)}
                  required
                />
                <Input
                  label="Author role"
                  placeholder="Lead solar architect"
                  value={form.author_role}
                  onChange={(event) => setField("author_role", event.target.value)}
                />
                <Input
                  label="Initials"
                  placeholder="BE"
                  maxLength={4}
                  hint="Leave blank to derive from the name."
                  value={form.author_initials}
                  onChange={(event) =>
                    setField("author_initials", event.target.value.toUpperCase())
                  }
                />
              </div>
            </ModalSection>

            <ModalSection
              icon={ImageIcon}
              title="Story & media"
              description="Short summary, opening paragraph and cover image."
            >
              <div className="crm-form-stack">
                <Textarea
                  label="Excerpt"
                  rows={3}
                  placeholder="One or two sentences shown on the blog cards."
                  value={form.excerpt}
                  onChange={(event) => setField("excerpt", event.target.value)}
                />
                <Textarea
                  label="Intro"
                  rows={4}
                  placeholder="The opening paragraph shown at the top of the article."
                  value={form.intro}
                  onChange={(event) => setField("intro", event.target.value)}
                />

                <div className="crm-form-grid crm-form-grid--2">
                  <Input
                    label="Cover image URL"
                    icon={ImageIcon}
                    placeholder="https://images.unsplash.com/..."
                    value={form.featured_image}
                    onChange={(event) =>
                      setField("featured_image", event.target.value)
                    }
                  />
                  <Input
                    label="Image alt text"
                    placeholder="Aerial view of a rooftop solar installation"
                    value={form.image_alt}
                    onChange={(event) => setField("image_alt", event.target.value)}
                  />
                </div>

                {form.featured_image && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={form.featured_image}
                      alt={form.image_alt || "Cover preview"}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </ModalSection>

            <ModalSection
              icon={ListChecks}
              title="Key takeaways"
              description="One takeaway per line. Rendered in the highlighted box in the reader."
            >
              <Textarea
                rows={4}
                placeholder={
                  "A 3 kW system can receive up to ₹78,000 in central assistance.\nThe subsidy is credited after net-meter commissioning."
                }
                value={form.takeawaysText}
                onChange={(event) =>
                  setField("takeawaysText", event.target.value)
                }
              />
            </ModalSection>

            <ModalSection
              icon={Layers}
              title="Content sections"
              description="Each section becomes a numbered heading with paragraphs and bullet lists."
            >
              <div className="crm-form-stack">
                {form.sections.map((section, index) => (
                  <div
                    key={`section-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                        Section {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        disabled={form.sections.length === 1}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Remove section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="crm-form-stack">
                      <Input
                        label="Heading"
                        placeholder="What PM Surya Ghar actually pays for"
                        value={section.heading}
                        onChange={(event) =>
                          setSectionField(index, "heading", event.target.value)
                        }
                      />

                      <div className="crm-form-grid crm-form-grid--2">
                        <Textarea
                          label="Paragraphs"
                          rows={5}
                          hint="One paragraph per line."
                          placeholder="The scheme provides direct central financial assistance…"
                          value={section.paragraphsText}
                          onChange={(event) =>
                            setSectionField(
                              index,
                              "paragraphsText",
                              event.target.value,
                            )
                          }
                        />
                        <Textarea
                          label="Bullets"
                          rows={5}
                          hint="One bullet per line."
                          placeholder="1 kW system — ₹30,000 assistance"
                          value={section.bulletsText}
                          onChange={(event) =>
                            setSectionField(
                              index,
                              "bulletsText",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  icon={Plus}
                  onClick={addSection}
                  className="self-start"
                >
                  Add section
                </Button>
              </div>
            </ModalSection>

            <ModalSection
              icon={Quote}
              title="Pull quote (optional)"
              description="Displayed after the second content section."
            >
              <div className="crm-form-stack">
                <Textarea
                  rows={2}
                  placeholder="The subsidy is only one line in the payback math."
                  value={form.quote_text}
                  onChange={(event) => setField("quote_text", event.target.value)}
                />
                <Input
                  label="Quote author"
                  placeholder="BHsquare Engineering Desk"
                  value={form.quote_author}
                  onChange={(event) =>
                    setField("quote_author", event.target.value)
                  }
                />
              </div>
            </ModalSection>

            <ModalSection
              icon={Tags}
              title="Tags & publishing"
              description="Tags are created automatically. Only published posts appear publicly."
            >
              <div className="crm-form-stack">
                <Input
                  label="Tags"
                  placeholder="PM Surya Ghar, Gujarat, Subsidy, Net Metering"
                  hint="Comma separated."
                  value={form.tagsText}
                  onChange={(event) => setField("tagsText", event.target.value)}
                />

                <div className="crm-form-grid crm-form-grid--3">
                  <Select
                    label="Status"
                    value={form.status}
                    onChange={(event) => setField("status", event.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                  <Input
                    label="Read time (minutes)"
                    type="number"
                    min={1}
                    max={120}
                    value={form.read_time}
                    onChange={(event) =>
                      setField("read_time", event.target.value)
                    }
                  />
                  <div className="flex items-end pb-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500">
                      <CalendarDays size={12} />
                      Auto-dated on publish
                    </span>
                  </div>
                </div>

                <div className="crm-form-grid crm-form-grid--2">
                  <ToggleCard
                    checked={form.is_featured}
                    onChange={(checked) => setField("is_featured", checked)}
                    icon={Star}
                    title="Featured story"
                    description="Shows in the large editor's pick card at the top of /blogs."
                  />
                  <ToggleCard
                    checked={form.is_recommended}
                    onChange={(checked) => setField("is_recommended", checked)}
                    icon={Sparkles}
                    title="Recommended"
                    description="Eligible for the 'Recommended next' strip below the archive."
                  />
                </div>
              </div>
            </ModalSection>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!deleteLoading) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Delete blog post?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be removed from the CRM and the public journal. This action cannot be undone.`
            : ""
        }
        eyebrow="Delete content"
        confirmLabel="Delete post"
        loading={deleteLoading}
        icon={Trash2}
      />
    </div>
  );
};

export default BlogManager;
