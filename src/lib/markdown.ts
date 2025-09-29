export interface PostMetadata {
  layout: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  author: string;
  date?: string;
  slug: string;
  thumbnail?: string;
}

export interface BlogPost {
  metadata: PostMetadata;
  content: string;
  excerpt: string;
}

export function parseMarkdownFrontmatter(markdown: string): { metadata: PostMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format: missing frontmatter');
  }
  
  const [, frontmatterStr, content] = match;
  const metadata = parseFrontmatter(frontmatterStr);
  
  return { metadata, content };
}

function parseFrontmatter(frontmatterStr: string): PostMetadata {
  const lines = frontmatterStr.split('\n');
  const result: any = {};
  
  let currentKey = '';
  let isArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Handle array items
    if (trimmed.startsWith('-') && isArray) {
      const value = trimmed.substring(1).trim();
      result[currentKey].push(value);
      continue;
    }
    
    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    
    currentKey = key;
    
    // Check if it's an array
    if (!value && lines[lines.indexOf(line) + 1]?.trim().startsWith('-')) {
      result[key] = [];
      isArray = true;
      continue;
    }
    
    isArray = false;
    
    // Parse different value types
    if (value.startsWith('"') && value.endsWith('"')) {
      result[key] = value.slice(1, -1); // Remove quotes
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Parse array in bracket format [item1, item2, item3]
      const arrayContent = value.slice(1, -1);
      result[key] = arrayContent.split(',').map(item => item.trim());
    } else if (value.startsWith('>')) {
      // Multi-line description
      let description = value.substring(1).trim();
      let nextLineIndex = lines.indexOf(line) + 1;
      while (nextLineIndex < lines.length && lines[nextLineIndex].trim() && !lines[nextLineIndex].includes(':')) {
        description += ' ' + lines[nextLineIndex].trim();
        nextLineIndex++;
      }
      result[key] = description;
    } else {
      result[key] = value;
    }
  }
  
  return result as PostMetadata;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown syntax for excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
}

// 간단한 이미지 문법을 HTML로 변환
export function processImageSyntax(content: string): string {
  // ![설명](경로){정렬:너비} 형식을 파싱
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\{([^:}]+):([^}]+)\})?/g;

  return content.replace(imageRegex, (match, alt, src, align = 'center', width = '600') => {
    const widthStyle = width === 'full' ? '100%' : `${width}px`;
    return `<div class="image-container ${align}" style="max-width: ${widthStyle};">
  <img src="${src}" alt="${alt}" class="rounded-image" />
</div>`;
  });
}