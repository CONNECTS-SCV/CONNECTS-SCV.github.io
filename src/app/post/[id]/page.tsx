import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {getPostBySlug, getAllPosts} from '@/lib/posts';
import {getAuthor} from '@/data/authors';
import {getCategoryLabel} from '@/lib/categoryMapping';
import MarkdownContent from '@/components/post/MarkdownContent';

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        id: post.metadata.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({params}: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const {id} = await params;
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
        authors: [{name: author?.name || 'CONNECTS Team'}],
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
export default async function PostPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const post = await getPostBySlug(id);

    if (!post) {
        notFound();
    }

    const author = getAuthor(post.metadata.author);

    return (
        <>
            <div className="w-[80%] mx-auto px-4 pt-10 pb-20">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-bold text-3xl mb-1 text-gray-900" itemProp="headline">
                        {String(post.metadata.title || '')}
                    </h1>
                    <meta itemProp="datePublished" content={post.metadata.date}/>
                    <meta itemProp="author" content={author?.name || 'Unknown'}/>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(post.metadata.categories) && post.metadata.categories.map((category: string) => (
                            <span
                                key={String(category)}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                            >
              #{getCategoryLabel(String(category))}
            </span>
                        ))}
                        {Array.isArray(post.metadata.tags) && post.metadata.tags.length > 0 &&
                            post.metadata.tags.map((tag: string) => (
                                <span
                                    key={String(tag)}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                                >
                #{String(tag)}
              </span>
                            ))
                        }
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{String(post.metadata.date || '')}</span>
                        <span>·</span>
                        <span>{String(author?.name || 'Unknown')}</span>
                    </div>

                    {/*<p className="text-gray-600">*/}
                    {/*  {String(post.metadata.description || '')}*/}
                    {/*</p>*/}
                </header>

                <hr className="border-t border-gray-200 mb-10"/>

                {post.metadata.thumbnail && (
                    <div className="w-full h-60 relative mb-10">
                        <img
                            src={post.metadata.thumbnail}
                            alt={String(post.metadata.title || 'Post') + " thumbnail"}
                            className="w-full h-60 object-cover rounded-xl"
                        />
                    </div>
                )}

                {/* Content with structured data */}
                <article itemScope itemType="http://schema.org/BlogPosting">
                    <MarkdownContent content={String(post.content || '')}/>
                </article>


                {/* Navigation */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 hover:text-gray-900 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        목록으로 돌아가기
                    </a>
                </div>
            </div>
        </>
    );
}