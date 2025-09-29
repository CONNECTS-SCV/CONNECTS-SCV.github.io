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
    // Return empty metadata for files without frontmatter
    return {
      metadata: {
        layout: 'post',
        title: 'Untitled',
        description: '',
        categories: [],
        tags: [],
        author: 'author6',
        slug: '',
        date: new Date().toISOString().split('T')[0]
      },
      content: markdown
    };
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
  // 이미지 문법 정규식
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\{([^:}]+):([^}]+)\})?(?:\[([^\]]+)\])?/g;

  // 줄 단위로 처리하여 연속된 이미지 감지
  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // 현재 줄이 이미지로 시작하는지 확인
    if (lines[i].match(/^!\[/)) {
      const imageLines: string[] = [];

      // 연속된 이미지 줄들을 수집
      while (i < lines.length && lines[i].match(/^!\[/)) {
        imageLines.push(lines[i]);
        i++;
      }

      // 연속된 이미지가 여러 개인 경우
      if (imageLines.length > 1) {
        const images: string[] = [];

        imageLines.forEach(line => {
          const match = imageRegex.exec(line);
          imageRegex.lastIndex = 0; // 정규식 리셋

          if (match) {
            const [, alt, src, align = 'center', width = '600', caption] = match;
            const widthStyle = width === 'full' ? '100%' : `${width}px`;
            const captionHtml = caption ? `<p class="image-caption">${caption}</p>` : '';

            images.push(`<div class="image-item" style="max-width: ${widthStyle};">
    <img src="${src}" alt="${alt}" class="rounded-image" />
    ${captionHtml}
  </div>`);
          }
        });

        result.push(`<div class="image-row">
  ${images.join('\n  ')}
</div>`);
        result.push(''); // 빈 줄 추가

      } else if (imageLines.length === 1) {
        // 단일 이미지는 기존 방식 유지
        const processedLine = imageLines[0].replace(imageRegex, (match, alt, src, align = 'center', width = '600', caption) => {
          const widthStyle = width === 'full' ? '100%' : `${width}px`;
          const captionHtml = caption ? `<p class="image-caption">${caption}</p>` : '';

          return `<div class="image-container ${align}" style="max-width: ${widthStyle};">
  <img src="${src}" alt="${alt}" class="rounded-image" />
  ${captionHtml}
</div>`;
        });

        result.push(processedLine);
        result.push(''); // 빈 줄 추가
      }
    } else {
      // 이미지가 아닌 경우 그대로 유지
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}