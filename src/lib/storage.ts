import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content/produtos");
const isVercel = process.env.VERCEL === "1";

const REPO   = process.env.GITHUB_REPO   ?? "";   // "Eduardomfdias/craftlab"
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN  = process.env.GITHUB_TOKEN  ?? "";

function ghHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function ghUrl(filePath: string) {
  return `https://api.github.com/repos/${REPO}/contents/${filePath}`;
}

/* ── READ ────────────────────────────────────────────────── */

export async function listProdutos(): Promise<{ slug: string; [k: string]: unknown }[]> {
  if (!isVercel) {
    if (!fs.existsSync(DIR)) return [];
    return fs.readdirSync(DIR)
      .filter(f => f.endsWith(".json"))
      .map(f => ({ slug: f.replace(".json", ""), ...JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) }));
  }

  const res = await fetch(ghUrl(`content/produtos`), { headers: ghHeaders(), next: { revalidate: 0 } });
  if (!res.ok) return [];
  const files: { name: string }[] = await res.json();
  const results = await Promise.all(
    files.filter(f => f.name.endsWith(".json")).map(async f => {
      const r = await fetch(ghUrl(`content/produtos/${f.name}`), { headers: ghHeaders(), next: { revalidate: 0 } });
      const d = await r.json();
      const content = JSON.parse(Buffer.from(d.content, "base64").toString("utf-8"));
      return { slug: f.name.replace(".json", ""), ...content };
    })
  );
  return results;
}

export async function getProdutoStorage(slug: string): Promise<{ slug: string; sha?: string; [k: string]: unknown } | null> {
  if (!isVercel) {
    const file = path.join(DIR, `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return { slug, ...JSON.parse(fs.readFileSync(file, "utf-8")) };
  }

  const res = await fetch(ghUrl(`content/produtos/${slug}.json`), { headers: ghHeaders(), next: { revalidate: 0 } });
  if (!res.ok) return null;
  const d = await res.json();
  const content = JSON.parse(Buffer.from(d.content, "base64").toString("utf-8"));
  return { slug, sha: d.sha, ...content };
}

/* ── WRITE ───────────────────────────────────────────────── */

export async function writeProduto(slug: string, data: Record<string, unknown>, sha?: string): Promise<void> {
  const clean = { ...data };
  delete clean.slug;
  delete clean.sha;

  if (!isVercel) {
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path.join(DIR, `${slug}.json`), JSON.stringify(clean, null, 2));
    return;
  }

  const content = Buffer.from(JSON.stringify(clean, null, 2)).toString("base64");
  const res = await fetch(ghUrl(`content/produtos/${slug}.json`), {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({
      message: sha ? `update: ${slug}` : `feat: add ${slug}`,
      content,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `GitHub API error ${res.status}`);
  }
}

export async function deleteProduto(slug: string, sha: string): Promise<void> {
  if (!isVercel) {
    const file = path.join(DIR, `${slug}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    return;
  }

  await fetch(ghUrl(`content/produtos/${slug}.json`), {
    method: "DELETE",
    headers: ghHeaders(),
    body: JSON.stringify({ message: `delete: ${slug}`, sha, branch: BRANCH }),
  });
}
