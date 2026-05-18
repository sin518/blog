import "dotenv/config";

import cors from "cors";
import express from "express";
import { PrismaClient, PostStatus } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const app = express();
const port = Number(process.env.BACKEND_PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

const postInputSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(3),
  imageUrl: z.string().min(3),
  categoryId: z.string().nullable().optional(),
  tags: z
    .array(
      z.union([
        z.string(),
        z.object({
          value: z.string(),
        }),
      ]),
    )
    .default([])
    .transform((tags) =>
      tags.map((tag) => (typeof tag === "string" ? tag : tag.value)),
    ),
  status: z.enum([PostStatus.published, PostStatus.draft]).default("draft"),
});

const categoryInputSchema = z.object({
  name: z.string().min(1),
});

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...valueParts] = cookie.split("=");
        return [name, valueParts.join("=")];
      }),
  );
}

async function authenticate(req, res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const rawSessionToken = cookies["better-auth.session_token"];

    if (!rawSessionToken) {
      return respondUnauthorized(req, res);
    }

    const token = decodeURIComponent(rawSessionToken).split(".")[0];
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt <= new Date()) {
      return respondUnauthorized(req, res);
    }

    req.session = session;
    req.user = session.user;
    return next();
  } catch (error) {
    return next(error);
  }
}

function respondUnauthorized(req, res) {
  if (req.path.startsWith("/api")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.redirect(`${frontendOrigin}/sign-in`);
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAdminDashboard({ user, stats, posts, categories }) {
  const categoryOptions = categories
    .map(
      (category) =>
        `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`,
    )
    .join("");
  const postsRows = posts
    .map(
      (post) => `
        <tr data-post-id="${escapeHtml(post.id)}">
          <td>
            <button class="link-button" type="button" data-edit="${escapeHtml(post.id)}">
              ${escapeHtml(post.title)}
            </button>
            <div class="muted">${escapeHtml(post.slug)}</div>
          </td>
          <td><span class="status ${post.status}">${escapeHtml(post.status)}</span></td>
          <td>${escapeHtml(post.category?.name ?? "未分类")}</td>
          <td>${post.views}</td>
          <td class="actions">
            <button type="button" data-publish="${escapeHtml(post.id)}">发布</button>
            <button type="button" data-draft="${escapeHtml(post.id)}">草稿</button>
            <button type="button" data-delete="${escapeHtml(post.id)}" class="danger">删除</button>
          </td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog Admin</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0a0a0a;
        --panel: #171717;
        --panel-2: #202020;
        --border: #303030;
        --text: #f4f4f5;
        --muted: #a1a1aa;
        --accent: #60a5fa;
        --danger: #f87171;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      a { color: inherit; }
      .shell {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        min-height: 100vh;
      }
      aside {
        border-right: 1px solid var(--border);
        background: #121212;
        padding: 20px;
      }
      main {
        min-width: 0;
        padding: 28px;
      }
      .brand { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
      nav { display: grid; gap: 8px; }
      nav a {
        border-radius: 8px;
        color: var(--text);
        padding: 10px 12px;
        text-decoration: none;
      }
      nav a:hover, nav a.active { background: var(--panel-2); }
      .topbar {
        align-items: center;
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
      }
      h1 { font-size: 28px; line-height: 1.2; margin: 0; }
      h2 { font-size: 18px; margin: 0 0 16px; }
      .muted { color: var(--muted); font-size: 13px; }
      .stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 22px;
      }
      .card, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 8px;
      }
      .card { padding: 20px; }
      .card strong { display: block; font-size: 32px; margin-top: 8px; }
      .grid {
        display: grid;
        grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
        gap: 18px;
      }
      .panel { min-width: 0; padding: 18px; }
      form { display: grid; gap: 12px; }
      label { color: var(--muted); display: grid; font-size: 13px; gap: 6px; }
      input, select, textarea {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: #0f0f0f;
        color: var(--text);
        font: inherit;
        padding: 10px 12px;
      }
      textarea { min-height: 180px; resize: vertical; }
      .form-actions, .actions { display: flex; flex-wrap: wrap; gap: 8px; }
      button, .button {
        align-items: center;
        background: #f4f4f5;
        border: 0;
        border-radius: 8px;
        color: #09090b;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 14px;
        height: 36px;
        justify-content: center;
        padding: 0 12px;
        text-decoration: none;
      }
      button.secondary { background: var(--panel-2); color: var(--text); }
      button.danger { background: #3b1518; color: var(--danger); }
      .link-button {
        background: transparent;
        color: var(--accent);
        height: auto;
        justify-content: flex-start;
        padding: 0;
      }
      table { border-collapse: collapse; width: 100%; }
      th, td {
        border-bottom: 1px solid var(--border);
        padding: 12px 8px;
        text-align: left;
        vertical-align: top;
      }
      th { color: var(--muted); font-size: 13px; font-weight: 500; }
      .status {
        border-radius: 999px;
        display: inline-flex;
        font-size: 12px;
        padding: 4px 8px;
      }
      .status.published { background: #052e1c; color: #86efac; }
      .status.draft { background: #2f2612; color: #fde68a; }
      #notice { min-height: 20px; color: var(--accent); font-size: 13px; }
      @media (max-width: 900px) {
        .shell { grid-template-columns: 1fr; }
        aside { position: sticky; top: 0; z-index: 2; }
        nav { grid-template-columns: repeat(2, max-content); overflow-x: auto; }
        main { padding: 18px; }
        .stats, .grid { grid-template-columns: 1fr; }
        .topbar { align-items: flex-start; flex-direction: column; }
        table { min-width: 760px; }
        .table-wrap { overflow-x: auto; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <aside>
        <div class="brand">Blog Admin</div>
        <nav>
          <a class="active" href="/dashboard">后台</a>
          <a href="${frontendOrigin}/">展示页</a>
        </nav>
      </aside>
      <main>
        <div class="topbar">
          <div>
            <h1>内容管理</h1>
            <div class="muted">Hi, ${escapeHtml(user.name ?? user.email)}</div>
          </div>
          <a class="button" href="${frontendOrigin}/">查看展示页</a>
        </div>

        <section class="stats">
          <div class="card"><span class="muted">分类数</span><strong>${stats.totalCategories}</strong></div>
          <div class="card"><span class="muted">文章数</span><strong>${stats.totalPosts}</strong></div>
          <div class="card"><span class="muted">浏览量</span><strong>${stats.totalViews}</strong></div>
        </section>

        <section class="grid">
          <div class="panel">
            <h2 id="form-title">创建文章</h2>
            <form id="post-form">
              <input type="hidden" id="post-id" />
              <label>标题<input id="title" required minlength="3" /></label>
              <label>Slug<input id="slug" required minlength="3" /></label>
              <label>封面图 URL<input id="imageUrl" required minlength="3" /></label>
              <label>分类<select id="categoryId"><option value="">未分类</option>${categoryOptions}</select></label>
              <label>标签<input id="tags" placeholder="用英文逗号分隔" /></label>
              <label>状态<select id="status"><option value="draft">draft</option><option value="published">published</option></select></label>
              <label>内容<textarea id="content" required minlength="3"></textarea></label>
              <div id="notice"></div>
              <div class="form-actions">
                <button type="submit">保存文章</button>
                <button class="secondary" type="button" id="reset-form">新建</button>
              </div>
            </form>
          </div>
          <div class="panel">
            <h2>文章列表</h2>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>文章</th><th>状态</th><th>分类</th><th>浏览量</th><th>操作</th></tr>
                </thead>
                <tbody>${postsRows || `<tr><td colspan="5" class="muted">暂无文章</td></tr>`}</tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
    <script>
      const form = document.querySelector("#post-form");
      const notice = document.querySelector("#notice");
      const fields = ["post-id", "title", "slug", "imageUrl", "categoryId", "tags", "status", "content"]
        .reduce((acc, id) => ({ ...acc, [id]: document.getElementById(id) }), {});

      function setNotice(message) {
        notice.textContent = message;
      }

      function resetForm() {
        form.reset();
        fields["post-id"].value = "";
        fields.status.value = "draft";
        document.querySelector("#form-title").textContent = "创建文章";
        setNotice("");
      }

      function payloadFromForm() {
        return {
          title: fields.title.value.trim(),
          slug: fields.slug.value.trim(),
          imageUrl: fields.imageUrl.value.trim(),
          categoryId: fields.categoryId.value || null,
          tags: fields.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
          status: fields.status.value,
          content: fields.content.value.trim(),
        };
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = fields["post-id"].value;
        const res = await fetch(id ? "/api/posts/" + id : "/api/posts", {
          method: id ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payloadFromForm()),
        });
        if (!res.ok) {
          setNotice("保存失败");
          return;
        }
        setNotice("已保存，正在刷新...");
        location.reload();
      });

      document.querySelector("#reset-form").addEventListener("click", resetForm);

      document.addEventListener("click", async (event) => {
        const editId = event.target.dataset.edit;
        const publishId = event.target.dataset.publish;
        const draftId = event.target.dataset.draft;
        const deleteId = event.target.dataset.delete;

        if (editId) {
          const res = await fetch("/api/posts/" + editId);
          if (!res.ok) return setNotice("读取文章失败");
          const { post } = await res.json();
          fields["post-id"].value = post.id;
          fields.title.value = post.title;
          fields.slug.value = post.slug;
          fields.imageUrl.value = post.imageUrl;
          fields.categoryId.value = post.categoryId || "";
          fields.tags.value = post.tags.join(", ");
          fields.status.value = post.status;
          fields.content.value = post.content;
          document.querySelector("#form-title").textContent = "编辑文章";
          setNotice("正在编辑：" + post.title);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (publishId || draftId) {
          const id = publishId || draftId;
          const action = publishId ? "publish" : "draft";
          const res = await fetch("/api/posts/" + id + "/" + action, { method: "PATCH" });
          if (!res.ok) return setNotice("状态更新失败");
          location.reload();
        }

        if (deleteId && confirm("确认删除这篇文章？")) {
          const res = await fetch("/api/posts/" + deleteId, { method: "DELETE" });
          if (!res.ok) return setNotice("删除失败");
          location.reload();
        }
      });
    </script>
  </body>
</html>`;
}

async function getOwnedPostOr404(req, res) {
  const post = await prisma.post.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: {
      category: true,
    },
  });

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return null;
  }

  return post;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blog-backend" });
});

app.get(
  "/dashboard",
  authenticate,
  asyncRoute(async (req, res) => {
    const userId = req.user.id;
    const [posts, totalPosts, views, totalCategories, categories] =
      await Promise.all([
        prisma.post.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: { category: true },
        }),
        prisma.post.count({ where: { userId } }),
        prisma.post.aggregate({
          where: { userId },
          _sum: { views: true },
        }),
        prisma.category.count({ where: { userId } }),
        prisma.category.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    res.send(
      renderAdminDashboard({
        user: req.user,
        stats: {
          totalPosts,
          totalCategories,
          totalViews: views._sum.views ?? 0,
        },
        posts,
        categories,
      }),
    );
  }),
);

app.use("/api", authenticate);

app.get("/api/me", (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    image: req.user.image,
  });
});

app.get(
  "/api/dashboard",
  asyncRoute(async (req, res) => {
    const userId = req.user.id;
    const [posts, totalPosts, views, totalCategories, categories] =
      await Promise.all([
        prisma.post.findMany({
          take: 10,
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.post.count({ where: { userId } }),
        prisma.post.aggregate({
          where: { userId },
          _sum: { views: true },
        }),
        prisma.category.count({ where: { userId } }),
        prisma.category.findMany({
          take: 10,
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: { user: true },
        }),
      ]);

    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
      },
      stats: {
        totalPosts,
        totalCategories,
        totalViews: views._sum.views ?? 0,
      },
      posts,
      categories,
    });
  }),
);

app.get(
  "/api/posts",
  asyncRoute(async (req, res) => {
    const posts = await prisma.post.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    res.json({ posts });
  }),
);

app.post(
  "/api/posts",
  asyncRoute(async (req, res) => {
    const data = postInputSchema.parse(req.body);
    const post = await prisma.post.create({
      data: {
        ...data,
        categoryId: data.categoryId || null,
        userId: req.user.id,
      },
    });

    res.status(201).json({ post });
  }),
);

app.get(
  "/api/posts/:id",
  asyncRoute(async (req, res) => {
    const post = await getOwnedPostOr404(req, res);
    if (!post) return;
    res.json({ post });
  }),
);

app.put(
  "/api/posts/:id",
  asyncRoute(async (req, res) => {
    const data = postInputSchema.parse(req.body);
    const result = await prisma.post.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        ...data,
        categoryId: data.categoryId || null,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    return res.json({ post });
  }),
);

app.patch(
  "/api/posts/:id/publish",
  asyncRoute(async (req, res) => {
    const result = await prisma.post.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { status: PostStatus.published },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    return res.json({ post });
  }),
);

app.patch(
  "/api/posts/:id/draft",
  asyncRoute(async (req, res) => {
    const result = await prisma.post.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { status: PostStatus.draft },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    return res.json({ post });
  }),
);

app.delete(
  "/api/posts/:id",
  asyncRoute(async (req, res) => {
    const result = await prisma.post.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(204).send();
  }),
);

app.get(
  "/api/categories",
  asyncRoute(async (req, res) => {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ categories });
  }),
);

app.post(
  "/api/categories",
  asyncRoute(async (req, res) => {
    const data = categoryInputSchema.parse(req.body);
    const category = await prisma.category.create({
      data: {
        name: data.name,
        userId: req.user.id,
      },
    });

    res.status(201).json({ category });
  }),
);

app.use((error, _req, res, _next) => {
  void _next;

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: "Invalid request body",
      issues: error.issues,
    });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
