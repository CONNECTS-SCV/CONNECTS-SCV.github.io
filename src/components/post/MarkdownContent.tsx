"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
  a: ({ href, children, ...props }: any) => {
    // Check if this is a special link with onclick in the href
    const isSpecialLink = href === '#';

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();

      // Check children for the URL pattern (e.g., "ADMET-AI 사용하러 가기")
      const childText = children?.toString() || '';

      // Map tool names to their URLs
      const toolUrls: { [key: string]: string } = {
        'ADMET-AI': 'https://curie.kr:444/Analysis/admet-ai?from=blog',
        'Antifold': 'https://curie.kr:444/Analysis/antifold?from=blog',
        'Bioemu': 'https://curie.kr:444/Analysis/biolemo?from=blog',
        'Boltz-2': 'https://curie.kr:444/Analysis/boltz?from=blog',
        'Chai': 'https://curie.kr:444/Analysis/chai-1?from=blog',
        'DeepFRI': 'https://curie.kr:444/Analysis/deepfri?from=blog',
        'DiffDock': 'https://curie.kr:444/Analysis/DiffDock?from=blog',
        'DLKcat': 'https://curie.kr:444/Analysis/dlkcat?from=blog',
        'D-SCRIPT': 'https://curie.kr:444/Analysis/dscript?from=blog',
        'FixPDB': 'https://curie.kr:444/Analysis/fixpdb?from=blog',
        'GROMACS': 'https://curie.kr:444/Analysis/gromacs?from=blog',
        'ImmuneBuilder': 'https://curie.kr:444/Analysis/immunebuilder?from=blog',
        'LigandMPNN': 'https://curie.kr:444/Analysis/ligandmpnn?from=blog',
        'MHCflurry': 'https://curie.kr:444/Analysis/mhcflurry2?from=blog',
        'NetSolP': 'https://curie.kr:444/Analysis/netsolp?from=blog',
        'PLIP': 'https://curie.kr:444/Analysis/plip?from=blog',
        'ToxinPred3': 'https://curie.kr:444/Analysis/toxinpred3?from=blog',
      };

      // Find matching tool
      for (const [tool, url] of Object.entries(toolUrls)) {
        if (childText.includes(tool)) {
          window.open(url, '_blank');
          return;
        }
      }

      // Fallback to href if it's a valid URL
      if (href && href !== '#') {
        window.open(href, '_blank');
      }
    };

    // Filter out onClick string from props
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => key.toLowerCase() !== 'onclick')
    );

    return (
      <a
        href={href || '#'}
        className="text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={isSpecialLink ? handleClick : undefined}
        {...cleanProps}
      >
        {children}
      </a>
    );
  },
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

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}