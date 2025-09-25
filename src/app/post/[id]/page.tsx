import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { getAuthor } from '@/data/authors';
import PostViewTracker from '@/components/analytics/PostViewTracker';

// Custom components for react-markdown with enhanced styles
const markdownComponents: any = {
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold mt-10 mb-5 pb-2 border-b border-gray-200 text-gray-900" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-800" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-[1.7] text-gray-700 text-base" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 pl-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 pl-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, ...props }: any) => {
    // Check if it's inline code (no className prop typically means inline)
    const isInline = !props.className;

    if (isInline) {
      return (
        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    // Block code
    return (
      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: any) => (
    <pre className="mb-6 overflow-hidden rounded-lg" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border-collapse border border-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-100" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props}>
      {children}
    </td>
  ),
  hr: ({ ...props }: any) => (
    <hr className="my-8 border-t border-gray-200" {...props} />
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  img: ({ src, alt, ...props }: any) => (
    <img
      src={src}
      alt={alt || ''}
      className="max-w-full h-auto rounded-lg my-6 shadow-sm"
      loading="lazy"
      {...props}
    />
  ),
};

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.metadata.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const author = getAuthor(post.metadata.author);

  return {
    title: `${post.metadata.title} | CONNECTS`,
    description: post.metadata.description || post.excerpt,
    keywords: post.metadata.tags?.join(', '),
    authors: [{ name: author?.name || 'CONNECTS Team' }],
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description || post.excerpt,
      type: 'article',
      publishedTime: post.metadata.date,
      authors: [author?.name || 'CONNECTS Team'],
      tags: post.metadata.tags,
      siteName: 'CONNECTS Blog',
      locale: 'ko_KR',
      images: [
        {
          url: '/image/curie_tech.webp',
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description || post.excerpt,
      images: ['/image/curie_tech.webp'],
    },
    alternates: {
      canonical: `/post/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// For Next.js 15, params are now a Promise
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    notFound();
  }

  const author = getAuthor(post.metadata.author);

  return (
    <>
      <PostViewTracker
        slug={id}
        title={post.metadata.title}
        author={author?.name || 'CONNECTS Team'}
      />
      <div className="w-[80%] mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-bold text-3xl mb-4 text-gray-900" itemProp="headline">
          {String(post.metadata.title || '')}
        </h1>
        <meta itemProp="datePublished" content={post.metadata.date} />
        <meta itemProp="author" content={author?.name || 'Unknown'} />

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <span>{String(author?.name || 'Unknown')}</span>
          <span>·</span>
          <span>{String(post.metadata.date || '')}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(post.metadata.categories) && post.metadata.categories.map((category: string) => (
            <span
              key={String(category)}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {String(category)}
            </span>
          ))}
        </div>

        <p className="text-gray-600">
          {String(post.metadata.description || '')}
        </p>
      </header>

      <hr className="border-t border-gray-200 mb-10" />

      {/* Content with structured data */}
      <article itemScope itemType="http://schema.org/BlogPosting">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {String(post.content || '')}
        </ReactMarkdown>
      </article>

      {/* Tags */}
      {Array.isArray(post.metadata.tags) && post.metadata.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag: string) => (
              <span
                key={String(tag)}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
              >
                #{String(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <a
          href="/"
          className="text-blue-600 hover:text-blue-800"
        >
          ← 목록으로 돌아가기
        </a>
      </div>
      </div>
    </>
  );
}