import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "./site";

export type Post = CollectionEntry<"blog">;

let cached: Post[] | null = null;
async function loadAll(): Promise<Post[]> {
  if (cached) return cached;
  const all = await getCollection("blog", ({ data }) => !data.draft);
  cached = all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return cached;
}

export async function getAllPosts(): Promise<Post[]> {
  return loadAll();
}

export async function getRecentPosts(n = 6): Promise<Post[]> {
  const all = await loadAll();
  return all.slice(0, n);
}

export async function getPostsByCategory(categoryName: string): Promise<Post[]> {
  const all = await loadAll();
  return all.filter((p) => p.data.categories.includes(categoryName));
}

export async function getRelatedPosts(current: Post, n = 6): Promise<Post[]> {
  const all = await loadAll();
  const sameCategory = all.filter(
    (p) =>
      p.id !== current.id &&
      p.data.categories.some((c) => current.data.categories.includes(c)),
  );
  // If category has enough siblings, use those; otherwise top up with most-recent overall.
  const filler = all.filter(
    (p) => p.id !== current.id && !sameCategory.includes(p),
  );
  return [...sameCategory, ...filler].slice(0, n);
}

export function readingMinutes(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function categoryFromSlug(slug: string): string | null {
  return SITE.categories.find((c) => c.slug === slug)?.name ?? null;
}

export function postUrl(post: Post): string {
  return `/blog/${post.id}/`;
}

export function formatDateNL(date: Date): string {
  return date.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Identify posts that are technically migrated (kept in /blog/<slug>/) but
 * not on-brand for prominent surfaces like the homepage, blog index hero,
 * or related-posts widget. They include:
 *   - Dutch phone-number lookup posts ("Wie belt +31 ..." pattern)
 *   - Celebrity gossip posts (slug suffixes -vermogen, -leeftijd, -vriend(in), etc.)
 *   - Off-topic legacy posts (gymnastics tricks, hair color stats, etc.)
 *   - The cleaning featured-image post (visually off-brand for a hero card)
 * Spam URLs still resolve so we don't lose SEO equity, but homepage curation
 * deliberately skips them.
 */
export function isHomepageSafe(post: Post): boolean {
  const slug = post.id;
  // Reverse-phone-lookup posts
  if (/^31\d{8,12}-?\d?$/.test(slug)) return false;
  if (/^0\d{6,11}-?\d?$/.test(slug)) return false;
  if (/^31-\d/.test(slug)) return false;
  // Celebrity slug suffix patterns
  if (/-vermogen(-\d+)?$/.test(slug)) return false;
  if (/-leeftijd$/.test(slug)) return false;
  if (/-vriend(in)?$/.test(slug)) return false;
  if (/-vriendin-/.test(slug)) return false;
  if (/-vriend-/.test(slug)) return false;
  if (/-getrouwd(-met-[a-z]+)?$/.test(slug)) return false;
  if (/-gescheiden$/.test(slug)) return false;
  if (/-kinderen$/.test(slug)) return false;
  if (/-kind$/.test(slug)) return false;
  if (/-relatie$/.test(slug)) return false;
  if (/-moeder/.test(slug)) return false;
  if (/-afkomst/.test(slug)) return false;
  if (/-ouders$/.test(slug)) return false;
  if (/-zoon/.test(slug) || /^zoon-/.test(slug)) return false;
  if (/-zwanger$/.test(slug)) return false;
  if (/-dochter/.test(slug)) return false;
  if (/-vader/.test(slug)) return false;
  if (/-vermogen-familie$/.test(slug)) return false;
  // Question-style celebrity prefixes
  if (/^vriend(in)?-/.test(slug)) return false;
  if (/^met-wie-is-/.test(slug)) return false;
  if (/^is-[a-z][a-z-]+-(getrouwd|gescheiden)$/.test(slug)) return false;
  if (/^heeft-[a-z][a-z-]+-een-/.test(slug)) return false;
  if (/^wie-is-de-vriend(in)?-van-/.test(slug)) return false;
  if (/^hoeveel-kinderen-heeft-/.test(slug)) return false;
  if (/^het-vermogen-van-/.test(slug)) return false;
  if (/^alles-over-de-kinderen-van-/.test(slug)) return false;
  // Bekende namen category = explicitly celebrity content
  if (post.data.categories.includes("Bekende namen")) return false;
  return true;
}

export async function getHomepageSafePosts(): Promise<Post[]> {
  const all = await loadAll();
  return all.filter(isHomepageSafe);
}
