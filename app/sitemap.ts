import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { BLOG_POSTS, getAllCategories, categorySlug } from "@/lib/content/blog/posts";
import { AUTHORS } from "@/lib/content/blog/authors";
import { HELP_ARTICLES } from "@/lib/content/help/articles";
import { RESOURCE_ITEMS } from "@/lib/content/resources/items";
import { TOOLS } from "@/config/tools";
import { COUNTRY_GUIDES } from "@/lib/content/countries/guides";
import { LANDING_PAGES } from "@/lib/content/landing/pages";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/help", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/resources", priority: 0.7, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/invoice-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" },
  { path: "/register", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const landingEntries: MetadataRoute.Sitemap = Object.values(LANDING_PAGES).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const countryEntries: MetadataRoute.Sitemap = COUNTRY_GUIDES.map((c) => ({
    url: absoluteUrl(`/invoice-generator/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogCategoryEntries: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: absoluteUrl(`/blog/category/${categorySlug(category)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const blogAuthorEntries: MetadataRoute.Sitemap = AUTHORS.map((author) => ({
    url: absoluteUrl(`/blog/author/${author.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const helpEntries: MetadataRoute.Sitemap = HELP_ARTICLES.map((article) => ({
    url: absoluteUrl(`/help/${article.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.55,
  }));

  const resourceEntries: MetadataRoute.Sitemap = RESOURCE_ITEMS.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    ...staticEntries,
    ...landingEntries,
    ...countryEntries,
    ...blogEntries,
    ...blogCategoryEntries,
    ...blogAuthorEntries,
    ...helpEntries,
    ...resourceEntries,
    ...toolEntries,
  ];
}
