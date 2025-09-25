import fs from 'fs';
import path from 'path';
import { parseMarkdownFrontmatter, extractExcerpt, BlogPost } from './markdown';
import { getAuthor } from '../data/authors';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export async function getAllPosts(): Promise<BlogPost[]> {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // Get all markdown files from the posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'));

  const posts: BlogPost[] = [];

  for (const fileName of markdownFiles) {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { metadata, content } = parseMarkdownFrontmatter(fileContent);
      
      // Generate slug from filename if not provided
      if (!metadata.slug) {
        metadata.slug = fileName.replace(/\.md$/, '');
      }
      
      // Extract excerpt from content
      const excerpt = metadata.description || extractExcerpt(content);
      
      posts.push({
        metadata,
        content,
        excerpt
      });
    } catch (error) {
      console.error(`Error parsing ${fileName}:`, error);
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) =>
    new Date(b.metadata.date || '').getTime() - new Date(a.metadata.date || '').getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.metadata.slug === slug) || null;
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.metadata.categories.includes(category));
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.metadata.tags.includes(tag));
}

export async function getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.metadata.author === authorId);
}

// Utility function to get post with author details
export async function getPostWithAuthor(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const author = getAuthor(post.metadata.author);
  return {
    ...post,
    author
  };
}

export async function getAllPostsWithAuthors() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    ...post,
    author: getAuthor(post.metadata.author)
  }));
}
