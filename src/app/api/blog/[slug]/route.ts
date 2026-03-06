import { NextResponse } from "next/server";
import { getPostBySlug, incrementViews } from "@/lib/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Fire-and-forget view increment
    incrementViews(slug).catch(() => {});

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "글을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
