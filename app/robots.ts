import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/invoices",
          "/quotes",
          "/clients",
          "/products",
          "/expenses",
          "/reports",
          "/ai-assistant",
          "/settings",
          "/profile",
          "/verify-email",
          "/forgot-password",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
