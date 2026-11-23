# BHsquare Frontend — Blog Module Context

> This README is the single source of truth for any AI/developer continuing the
> blog work. Read it fully before changing code.

## 1. Project at a glance

- **App:** BHsquare Solar — public marketing site + internal CRM.
- **Stack:** React 19 + Vite 7 + Tailwind CSS 4 + React Router 7, plain JavaScript
  (`.jsx`, no TypeScript), Axios, react-toastify, lucide-react, framer-motion.
- **Repo root:** `/home/talha9847/VSCODE/BhSquareFrontend`
- **Backend repo:** `/home/talha9847/VSCODE/BhSquareBackend` (Express + Sequelize + PostgreSQL)
- **Backend deployed at:** `https://bhsquarebackend.onrender.com`
- **Local API proxy:** Vite proxies `/api` → `http://localhost:3000` (see `vite.config.js`).
- **Production proxy:** `vercel.json` rewrites `/api/:path*` to the Render backend.
- **Auth:** JWT stored in an **httpOnly cookie** named `token`. Admin API calls must
  use `withCredentials: true`. Do **not** try to read the token from JS.

### Run

```bash
npm install
npm run dev      # http://localhost:5173 (needs backend on :3000)
npm run build
npm run lint
```

## 2. Relevant files

| File | Purpose |
| --- | --- |
| `src/components/frontweb/Blog.jsx` | Public journal page (`/blogs`), reader modal, search/filter UI. |
| `src/components/frontweb/blogData.js` | Static content + phone/WhatsApp constants. Used as **offline fallback** only. |
| `src/lib/blogApi.js` | API client + normalizers shared by public blog and CRM. |
| `src/components/crm/BlogManager.jsx` | Admin CRUD screen (`/admin/blogs`). |
| `src/components/crm/Sidebar.jsx` | CRM menu definition. Blog lives under the **Website** group. |
| `src/App.jsx` | Route table. Admin route: `/admin/blogs` behind `ProtectedRoute allowedRoles=["admin"]`. |
| `src/components/ui/*` | `Modal`, `Button`, `Input`, `Select`, `Textarea`, `ConfirmDialog` primitives. |
| `src/styles/crm.css` | CRM styling (`crm-shell`, `crm-surface`, `crm-form-stack`, `crm-modal`, etc.). |

## 3. Blog API contract (already implemented on the backend)

Base URL: `/api/blogs`. Backend files:
`routes/blogRoutes.js`, `controllers/blogController.js`, `services/blogService.js`,
`models/blog*Model.js`.

### Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/blogs` | Public | List posts. Query: `status`, `categoryId`, `tagId`, `search`, `limit`, `offset`. **Default limit is 10.** |
| GET | `/api/blogs/categories` | Public | All categories. |
| GET | `/api/blogs/tags` | Public | All tags. |
| GET | `/api/blogs/:identifier` | Public | Full post by numeric **id** or **slug**. Includes sections, contents, takeaways, quote, tags. |
| POST | `/api/blogs` | `admin` | Create post. |
| PUT | `/api/blogs/:id` | `admin` | Update post (replaces child rows when arrays are sent). |
| DELETE | `/api/blogs/:id` | `admin` | Delete post (cascades children). |

Every response is JSON shaped like:

```json
{ "success": true, "data": { ... } }
```

List response:

```json
{
  "success": true,
  "data": {
    "total": 12,
    "limit": 10,
    "offset": 0,
    "posts": [ { "id": 1, "title": "...", "slug": "...", "category": { "id": 1, "name": "Solar Tech", "slug": "solar-tech" }, "tags": [ { "id": 1, "name": "Subsidy", "slug": "subsidy" } ], "quote": null, "takeaways": [ { "content": "..." } ] } ]
  }
}
```

Detail response `data` is a single post with:

```json
{
  "id": 1,
  "title": "...",
  "slug": "...",
  "category_id": 2,
  "category": { "id": 2, "name": "Solar Tech", "slug": "solar-tech" },
  "author_name": "...",
  "author_role": "...",
  "author_initials": "BE",
  "excerpt": "...",
  "intro": "...",
  "featured_image": "https://...",
  "image_alt": "...",
  "read_time": 8,
  "is_featured": true,
  "is_recommended": false,
  "status": "published",
  "published_at": "2026-11-12T00:00:00.000Z",
  "created_at": "...",
  "sections": [
    {
      "id": 1,
      "heading": "Section heading",
      "sort_order": 0,
      "contents": [
        { "id": 1, "content": "Normal paragraph", "sort_order": 0 },
        { "id": 2, "content": "• Bullet point", "sort_order": 1 }
      ]
    }
  ],
  "takeaways": [ { "id": 1, "content": "Takeaway text", "sort_order": 0 } ],
  "quote": { "quote_text": "...", "quote_author": "..." },
  "tags": [ { "id": 1, "name": "Subsidy", "slug": "subsidy" } ]
}
```

### Create / update payload

```json
{
  "title": "Required",
  "slug": "required-kebab-case",
  "category_id": 2,
  "category_name": "Optional — finds or creates the category if category_id is missing",
  "author_name": "Required",
  "author_role": "Optional",
  "author_initials": "Optional",
  "excerpt": "Optional",
  "intro": "Optional",
  "featured_image": "Optional URL",
  "image_alt": "Optional",
  "read_time": 8,
  "is_featured": false,
  "is_recommended": false,
  "status": "draft | published | archived",
  "takeaways": ["Array of strings"],
  "sections": [
    {
      "heading": "Section heading",
      "sort_order": 0,
      "paragraphs": ["Plain paragraph"],
      "bullets": ["Bullet point"]
    }
  ],
  "quote": { "quote_text": "Optional", "quote_author": "Optional" },
  "tags": ["Array of tag names — created automatically"]
}
```

### Important backend behaviours / gotchas

- `GET /api/blogs` returns **all statuses** unless `status=published` is passed.
  The public site must request `status=published`.
- Default page size is **10**; the UI requests a larger `limit` (200) explicitly.
- Bullets are stored in `blog_section_contents` as text prefixed with `"• "`.
  When reading back a section, split `contents` into paragraphs vs bullets by that prefix.
- `updatePost` deletes and recreates `takeaways`, `sections`, `quote`, and tag links
  whenever those fields are present in the payload. Always send complete arrays from admin.
- `published_at` is set automatically the first time status becomes `published`.
- Categories/tags are created automatically via `category_name` and `tags`.
  There are **no** category/tag create/update/delete endpoints.
- Delete cascades sections, contents, takeaways, quote and tag links.
- Validation: `title`, `slug`, `author_name` are required on create.
- Admin auth cookie is required for POST/PUT/DELETE; use `withCredentials: true`.

## 4. Data mapping contract (backend → UI)

`src/lib/blogApi.js` converts API records into the shape used by `Blog.jsx`:

```js
{
  id, slug, title, category, categoryId,
  date, publishedAt, readMinutes, readTime,     // readTime = "8 min read"
  author, authorRole, initials,
  image, imageAlt, excerpt, intro,
  takeaways: ["..."],
  sections: [{ heading, paragraphs: ["..."], bullets: ["..."] }],
  quote: { text, by } | null,
  tags: ["..."],
  isFeatured, isRecommended, status,
  raw                                          // original API record
}
```

- Static `blogData.js` posts already follow this shape closely and remain the
  fallback if the API is unavailable or empty.
- Keep `normalizePost` and `buildPostPayload` as the only translation layer.

## 5. Current implementation status

- [x] Backend blog API (done by backend team, do not rebuild).
- [x] `src/lib/blogApi.js` — endpoints, normalizers, payload builder, helpers.
- [x] `src/components/crm/BlogManager.jsx` — list, search, status filter, create,
      edit (loads full detail), delete, preview, featured/recommended flags,
      section builder, takeaways, quote, tags.
- [x] CRM route `/admin/blogs` + sidebar entry under **Website**.
- [x] Public `/blogs` page fetches published posts dynamically, with static fallback.
- [x] Reader fetches full post detail on open and supports `?post=<slug>` deep links.
- [ ] Optional: pagination for >200 posts (currently single large request).
- [ ] Optional: image upload/CDN (API accepts only a URL string today).
- [ ] Optional: duplicate/slug conflict messaging is surfaced from backend error.
- [ ] Optional: seed `blogData.js` posts into the DB with a one-off backend script.

## 6. Conventions to follow

- Plain JSX + Tailwind utility classes; reuse `crm-*` CSS classes and `src/components/ui`.
- Admin pages follow the `BrandManager.jsx` layout pattern:
  `crm-shell` → `Sidebar` → `crm-workspace` → `Navbar` → `crm-main`.
- Use `toast.success` / `toast.error` from react-toastify for feedback.
- Use `Modal`, `Button`, `Input`, `Select`, `Textarea`, `ConfirmDialog`.
- All Axios calls use a relative `/api/...` path and `withCredentials: true`.
- Do not put hard-coded blog content in components; content must come from the API.
  `blogData.js` is fallback + contact constants only.
- Keep `Blog.jsx` design intact; it is a carefully styled public-facing page.

## 7. Manual test checklist

1. Log in as `admin`, open **Website → Blog Manager** (`/admin/blogs`).
2. Create a draft with a new category, 2 sections (paragraphs + bullets), takeaways,
   a quote and tags. Confirm it appears in the CRM list.
3. Edit it: verify all sections/takeaways reload correctly (bullets without `"• "` prefix).
4. Publish it, open `Preview` (`/blogs?post=<slug>`).
5. Verify it appears on `/blogs`, category filter works, search finds it, reader
   shows intro, takeaways, sections, quote, tags and "up next".
6. Mark it featured/recommended and verify the featured card / recommended strip.
7. Archive it and confirm it disappears from the public page.
8. Delete it and confirm it disappears from both CRM and public page.
9. Stop the backend and reload `/blogs`: static fallback posts must still render.
10. `npm run lint` and `npm run build` must pass.

## 8. Quick troubleshooting

- **401/403 on save/delete:** cookie missing/expired or user role is not `admin`.
- **Only 10 posts returned:** missing explicit `limit` param.
- **Drafts visible publicly:** request is not sending `status=published`.
- **Sections empty after save:** payload used `contents` only; send `paragraphs`/`bullets`.
- **Bullets duplicated after edit:** reader normalizer did not strip the `"• "` prefix.
- **CORS errors locally:** backend must allow `http://localhost:5173` and the Vite
  proxy must be running; use relative `/api` URLs, never the Render URL directly.



image will be stored in the VSCODE/BHSQUAREBACKEND REPO... and contiue                                       