import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownPosts } from '@/data/posts';

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
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  code: ({ inline, children, ...props }: any) => {
    return inline ? (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className="block text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline" 
      target="_blank" 
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: ({ ...props }: any) => (
    <hr className="border-t border-gray-200 my-8" {...props} />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody className="divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: any) => (
    <tr className="hover:bg-gray-50" {...props}>
      {children}
    </tr>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props}>
      {children}
    </td>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left text-gray-900" {...props}>
      {children}
    </th>
  ),
  img: ({ src, alt, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto rounded-lg my-6" 
      {...props} 
    />
  ),
};

// Generate static params for all posts
export async function generateStaticParams() {
  return Object.keys(markdownPosts).map((id) => ({
    id: id,
  }));
}

// For Next.js 15, params are now a Promise
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = markdownPosts[id];
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="max-w-[700px] mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-bold text-3xl mb-4 text-gray-900">
          {String(post.metadata.title || '')}
        </h1>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <span>{String(post.author?.name || 'Unknown')}</span>
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
      
      {/* Content */}
      <article>
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
  );
}