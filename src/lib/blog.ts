import { getDb } from "./mongodb";
import type { BlogPost } from "@/types/blog";

export async function getAllPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  const posts = await db
    .collection("posts")
    .find({}, { projection: { content: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toString() ?? new Date().toISOString(),
  })) as unknown as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  const post = await db.collection("posts").findOne({ slug });

  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toString() ?? new Date().toISOString(),
  } as unknown as BlogPost;
}

export async function incrementViews(slug: string): Promise<void> {
  const db = await getDb();
  await db.collection("posts").updateOne({ slug }, { $inc: { views: 1 } });
}
