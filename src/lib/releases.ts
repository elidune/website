import { marked } from 'marked';

export type Release = {
  tag: string;
  name: string;
  html: string;
  url: string;
  publishedAt: string | null;
  prerelease: boolean;
};

export type ReleaseFeed = {
  ok: boolean;
  releases: Release[];
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function fetchReleases(): Promise<ReleaseFeed> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'elidune-website',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch('https://api.github.com/repos/elidune/elidune/releases?per_page=30', { headers });
    if (!response.ok) return { ok: false, releases: [] };
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return { ok: false, releases: [] };
    const releases: Release[] = [];
    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      const row = item as Record<string, unknown>;
      if (row.draft) continue;
      const tag = typeof row.tag_name === 'string' ? row.tag_name : '';
      if (!tag) continue;
      const body = typeof row.body === 'string' ? row.body : '';
      const parsed = await marked.parse(escapeHtml(body), { async: true, gfm: true });
      releases.push({
        tag,
        name: typeof row.name === 'string' && row.name ? row.name : tag,
        html: parsed,
        url: typeof row.html_url === 'string' ? row.html_url : 'https://github.com/elidune/elidune/releases',
        publishedAt: typeof row.published_at === 'string' ? row.published_at : null,
        prerelease: Boolean(row.prerelease),
      });
    }
    return { ok: true, releases };
  } catch {
    return { ok: false, releases: [] };
  }
}
