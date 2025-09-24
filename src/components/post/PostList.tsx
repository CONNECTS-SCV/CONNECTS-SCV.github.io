import Link from "next/link";
import { getAllPostsWithAuthors } from "@/lib/posts";

interface Post {
  metadata: {
    title: string;
    description: string;
    author: string;
    date: string;
    slug: string;
    tags: string[];
    categories: string[];
  };
  excerpt: string;
  author: {
    name: string;
    title: string;
    department: string;
  } | null;
}

function getCategoryColor(categories: string[] | undefined): string {
  const colorMap: Record<string, string> = {
    'product': '4F46E5', // blue
    'analysis': '7C3AED', // purple
    'algorithm': '059669', // green
    'partnership': 'DC2626', // red
    'research': '2563EB', // blue
    'update': '7C2D12', // orange
    'beta': 'EA580C', // orange
    'structure': '065F46', // emerald
    'docking': '7338AC', // violet
  };

  if (!Array.isArray(categories) || categories.length === 0) {
    return '6B7280'; // default gray
  }

  const primaryCategory = categories[0] || 'default';
  return colorMap[primaryCategory] || '6B7280'; // default gray
}

function getCategoryText(categories: string[] | undefined): string {
  const textMap: Record<string, string> = {
    'product': 'Product',
    'analysis': 'Analysis',
    'algorithm': 'Algorithm',
    'partnership': 'Partnership',
    'research': 'Research',
    'update': 'Update',
    'beta': 'Beta',
    'structure': 'Structure',
    'docking': 'Docking',
  };

  if (!Array.isArray(categories) || categories.length === 0) {
    return 'News';
  }

  const primaryCategory = categories[0] || 'default';
  return textMap[primaryCategory] || 'News';
}

export async function PostList() {
  const posts = await getAllPostsWithAuthors();

  return (
      <div className="flex flex-row gap-2">
        <div className="max-w-[750px] mx-auto w-full h-full">
          {posts.map((post) => {
            const color = getCategoryColor(post.metadata.categories);
            const categoryText = getCategoryText(post.metadata.categories);
            const thumbnailURL = `https://via.placeholder.com/130x90/${color}/ffffff?text=${categoryText}`;

            return (
                <Link
                    key={post.metadata.slug}
                    href={`/post/${post.metadata.slug}`}
                    className="flex justify-between items-start gap-5 py-6 cursor-pointer hover:opacity-80"
                >
                  <div className="flex flex-col">
                    <h4 className="text-lg font-bold mb-[6px]">{String(post.metadata.title || 'Untitled')}</h4>
                    <p className="text-sm text-gray-500 mb-[18px]">
                      {String(post.excerpt || '')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{String(post.author?.name || 'Unknown')}</span>
                      <span>·</span>
                      <span>{String(post.metadata.date || 'No date')}</span>
                      <span>·</span>
                      <div className="flex gap-1">
                        {Array.isArray(post.metadata.tags) && post.metadata.tags.slice(0, 2).map(tag => (
                            <span key={String(tag)} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        #{String(tag)}
                      </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <img
                      src={thumbnailURL}
                      alt={String(post.metadata.title || 'Post') + " thumbnail"}
                      className="w-[130px] h-[90px] rounded-lg"
                  />
                </Link>
            );
          })}
        </div>

        <div className="max-w-[250px] mx-auto w-full h-full bg-red/20">

        </div>
      </div>
  );
}
