export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt?: string;
}
