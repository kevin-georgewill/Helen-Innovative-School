
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/student/",
        "/tutor/",
        "/dashboard/",
      ],
    },
    sitemap:
      "https://www.heleninnovativeschool.name.ng/sitemap.xml",
  };
}
