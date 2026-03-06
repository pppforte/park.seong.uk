import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "글을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
