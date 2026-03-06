import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await getAllPosts();
    blogEntries = posts.map((post) => ({
      url: `https://park.seong.uk/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // MongoDB unavailable during build
  }

  return [
    {
      url: "https://park.seong.uk",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://park.seong.uk/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
