import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {getPostBySlug, getAllPosts} from '@/lib/posts';
import {getAuthor} from '@/data/authors';
import MarkdownContent from '@/components/post/MarkdownContent';
import CommentSectionOnline from '@/components/post/CommentSectionOnline';
import BackToListButton from '@/components/post/BackToListButton';
import PostMetadata from '@/components/post/PostMetadata';

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
                    <h1 className="font-bold text-3xl mb-4 text-gray-900" itemProp="headline">
                        {String(post.metadata.title || '')}
                    </h1>
                    <meta itemProp="datePublished" content={post.metadata.date}/>
                    <meta itemProp="author" content={author?.name || 'Unknown'}/>

                    <PostMetadata
                        categories={post.metadata.categories}
                        tags={post.metadata.tags}
                        date={String(post.metadata.date || '')}
                        authorName={String(author?.name || 'Unknown')}
                    />
                </header>

                <hr className="border-t border-gray-200 mb-10"/>

                {/* Content with structured data */}
                <article itemScope itemType="http://schema.org/BlogPosting">
                    <MarkdownContent content={String(post.content || '')}/>
                </article>

                {/* Comment Section */}
                <CommentSectionOnline postId={id} />

                {/* Navigation */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <BackToListButton />
                </div>
            </div>
        </>
    );
}