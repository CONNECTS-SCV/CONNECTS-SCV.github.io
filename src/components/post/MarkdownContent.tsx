"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { processImageSyntax } from '@/lib/markdown';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Separate component for code blocks to handle hooks properly
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-6">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <SyntaxHighlighter
        language={language || 'plaintext'}
        style={vscDarkPlus}
        className="syntax-highlighter"
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
        showLineNumbers={false}
        wrapLines={false}
        wrapLongLines={false}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

// Custom components for react-markdown with enhanced styles
const markdownComponents: any = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold mt-20 mb-6 text-black leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-bold mt-12 mb-5 text-gray-900" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-800" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-relaxed text-gray-600 text-base break-keep" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-outside mb-6 space-y-3 text-gray-600 ml-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-outside mb-4 space-y-1 text-gray-700 ml-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-loose break-keep pl-2" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, className, ...props }: any) => {
    // Check if this is a special link with onclick in the href
    const isSpecialLink = href === '#';

    // Check if it's a file download link
    const isFileLink = href && (href.startsWith('/file/') || href.includes('.zip') || href.includes('.pdf') || href.includes('.csv'));

    const handleClick = (e: React.MouseEvent) => {
      // If it's a file link, let the browser handle the download
      if (isFileLink) {
        return;
      }

      e.preventDefault();

      // Extract text from complex children structure
      const extractText = (node: any): string => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (node?.props?.children) return extractText(node.props.children);
        return '';
      };

      const childText = extractText(children);

      // Map tool names to their URLs
      const toolUrls: { [key: string]: string } = {
        'Abdev': 'https://curie.kr/Analysis/abdev?from=blog',
        'ADMET-AI': 'https://curie.kr/Analysis/admet-ai?from=blog',
        'Antifold': 'https://curie.kr/Analysis/antifold?from=blog',
        'Bioemu': 'https://curie.kr/Analysis/bioemu?from=blog',
        'BioPhi': 'https://curie.kr/Analysis/biophi?from=blog',
        'Boltz-2': 'https://curie.kr/Analysis/boltz?from=blog',
        'Chai': 'https://curie.kr/Analysis/chai?from=blog',
        'DeepFRI': 'https://curie.kr/Analysis/deepfri?from=blog',
        'DeepEnzyme': 'https://curie.kr/Analysis/deepenzyme?from=blog',
        'DeepViscosity': 'https://curie.kr/Analysis/deepviscosity?from=blog',
        'Diffdock': 'https://curie.kr/Analysis/diffdock?from=blog',
        'DiliPred': 'https://curie.kr/Analysis/dilipred?from=blog',
        'DLKcat': 'https://curie.kr/Analysis/dlkcat?from=blog',
        'Dscript': 'https://curie.kr/Analysis/dscript?from=blog',
        'FixPDB': 'https://curie.kr/Analysis/fixpdb?from=blog',
        'GROMACS': 'https://curie.kr/Analysis/gromacs?from=blog',
        'Immunebuilder': 'https://curie.kr/Analysis/immunebuilder?from=blog',
        'LigandMPNN': 'https://curie.kr/Analysis/ligandmpnn?from=blog',
        'MHCflurry': 'https://curie.kr/Analysis/mhcflurry?from=blog',
        'NetsolP': 'https://curie.kr/Analysis/netsolp?from=blog',
        'PLIP': 'https://curie.kr/Analysis/plip?from=blog',
        'ToxinPred3': 'https://curie.kr/Analysis/toxinpred3?from=blog',
        'HEMOPI2': 'https://curie.kr/Analysis/hemopi?from=blog',
        'hERG': 'https://curie.kr/Analysis/herg?from=blog',
        'PIGNET2': 'https://curie.kr/Analysis/pignet2?from=blog',
        'PocketGen': 'https://curie.kr/Analysis/pocketgen?from=blog',
        'PRODIGY': 'https://curie.kr/Analysis/prodigy?from=blog',
        'ProteinMPNN': 'https://curie.kr/Analysis/proteinmpnn?from=blog',
        'RDKit': 'https://curie.kr/Analysis/rdkit?from=blog',
        'REINVENT4': 'https://curie.kr/Analysis/reinvent4?from=blog',
        'RFantibody': 'https://curie.kr/Analysis/rfantibody?from=blog',
        'RFdiffusion': 'https://curie.kr/Analysis/rfdiffusion-v2?from=blog',
        'StrucToxNet': 'https://curie.kr/Analysis/structoxnet?from=blog',
        'TemStaPro': 'https://curie.kr/Analysis/temstapro?from=blog',
        'ThermoMPNN ': 'https://curie.kr/Analysis/thermompnn?from=blog',
        'ToxinPred3.0': 'https://curie.kr/Analysis/toxinpred3?from=blog',
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

    // Style for file download links
    if (isFileLink) {
      return (
        <a
          href={href}
          download
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer underline"
          {...cleanProps}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {children}
        </a>
      );
    }

    return (
      <a
        href={href || '#'}
        className={className || "text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={isSpecialLink ? handleClick : undefined}
        {...cleanProps}
      >
        {children}
      </a>
    );
  },
  code: ({ children, inline, className, ...props }: any) => {
    // Check if it's inline code
    const isInline = inline !== undefined ? inline : !className;

    if (isInline) {
      return (
        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    // Block code - moved to separate component to handle hooks properly
    return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
  },
  pre: ({ children, ...props }: any) => {
    // If children contains code element, it's already handled by code component
    if (children?.props?.className?.startsWith('language-')) {
      return <>{children}</>;
    }

    // Fallback for pre without language
    return (
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700 shadow-lg mb-6" {...props}>
        {children}
      </pre>
    );
  },
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
  div: ({ className, children, ...props }: any) => {
    // Callout box 스타일 처리
    if (className && className.includes('bg-calloutbox')) {
      return (
        <div className="bg-calloutbox rounded-xl px-12 py-8 my-6" {...props}>
          {children}
        </div>
      );
    }
    return <div className={className} {...props}>{children}</div>;
  },
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-gray-800" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  img: ({ src, alt, ...props }: any) => {
    // Don't render img if src is empty or undefined
    if (!src) {
      return null;
    }

    return (
      <img
        src={src}
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg my-6 shadow-sm"
        loading="lazy"
        {...props}
      />
    );
  },
};

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  // Process custom image syntax first
  let processedContent = processImageSyntax(content);

  // Process custom syntax for nested lists with callout
  processedContent = processedContent.replace(
    /::list-callout\s*([\s\S]*?)\s*::\/list-callout/g,
    (match, listContent) => {
      // Convert nested list format to HTML
      const htmlList = listContent
        .trim()
        .split('\n')
        .map((line: string) => {
          // Main list item (starts with -)
          if (line.match(/^-\s+(.+)/)) {
            return `<li class="mb-3"><strong>${line.substring(2)}</strong>`;
          }
          // Nested list item (starts with spaces/tabs and -)
          else if (line.match(/^\s+-\s+(.+)/)) {
            return `<ul class="mt-2 ml-4"><li class="mb-1 text-gray-600">${line.trim().substring(2)}</li></ul></li>`;
          }
          return line;
        })
        .join('\n');

      return `<div class="bg-calloutbox rounded-xl p-6 my-6">\n<ul class="space-y-2">\n${htmlList}\n</ul>\n</div>`;
    }
  );

  // Process custom syntax for callout boxes
  processedContent = processedContent.replace(
    /::callout\s*([\s\S]*?)\s*::\/callout/g,
    (match, boxContent) => {
      return `<div class="bg-calloutbox rounded-xl p-6 my-6">\n\n${boxContent.trim()}\n\n</div>`;
    }
  );

  // Process custom syntax for tool buttons
  processedContent = processedContent.replace(
    /\[tool-button:([^\]]+)\]/g,
    (match, toolName) => {
      const toolUrls: { [key: string]: string } = {
        'AbDev': 'https://curie.kr/Analysis/abdev?from=blog',
        'ADMET-AI': 'https://curie.kr/Analysis/admet-ai?from=blog',
        'Antifold': 'https://curie.kr/Analysis/antifold?from=blog',
        'Bioemu': 'https://curie.kr/Analysis/biolemo?from=blog',
        'Boltz-2': 'https://curie.kr/Analysis/boltz?from=blog',
        'Chai': 'https://curie.kr/Analysis/chai-1?from=blog',
        'DeepFRI': 'https://curie.kr/Analysis/deepfri?from=blog',
        'DiffDock': 'https://curie.kr/Analysis/DiffDock?from=blog',
        'DLKcat': 'https://curie.kr/Analysis/dlkcat?from=blog',
        'D-SCRIPT': 'https://curie.kr/Analysis/dscript?from=blog',
        'FixPDB': 'https://curie.kr/Analysis/fixpdb?from=blog',
        'GROMACS': 'https://curie.kr/Analysis/gromacs?from=blog',
        'ImmuneBuilder': 'https://curie.kr/Analysis/immunebuilder?from=blog',
        'LigandMPNN': 'https://curie.kr/Analysis/ligandmpnn?from=blog',
        'MHCflurry': 'https://curie.kr/Analysis/mhcflurry2?from=blog',
        'NetSolP': 'https://curie.kr/Analysis/netsolp?from=blog',
        'PLIP': 'https://curie.kr/Analysis/plip?from=blog',
        'ToxinPred3': 'https://curie.kr/Analysis/toxinpred3?from=blog',
      };

      const url = toolUrls[toolName] || '#';

      return `
<div class="text-center mt-12 mb-8">
  <p class="text-base font-bold text-gray-800 mb-8">아래 버튼을 통해 직접 사용해보세요.</p>

  <a href="#" onclick="window.open('${url}', '_blank'); return false;" class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full mb-6 no-underline hover:opacity-80 transition-opacity" style="background-color: rgba(0, 0, 0, 0.15);">
    <div class="w-5 h-5" style="display: inline-block;"><svg enable-background="new 0 0 16 16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#000000"><path d="m12.432 8.948c-.368 0-.668.3-.668.668v1.575c0 .317-.258.575-.575.575h-6.379c-.317 0-.574-.258-.574-.575v-6.38c0-.317.257-.574.574-.574h1.574c.369 0 .669-.3.669-.668s-.301-.668-.669-.668h-1.574c-1.053 0-1.91.857-1.91 1.91v6.379c0 1.053.857 1.91 1.91 1.91h6.379c1.053 0 1.91-.856 1.91-1.91v-1.574c0-.368-.299-.668-.667-.668z"></path><path d="m12.903 3.085c-.136-.133-.316-.192-.494-.184h-3.807c-.369 0-.668.3-.668.669s.299.668.668.668h2.217l-3.192 3.191c-.125.124-.196.297-.196.472 0 .369.3.668.668.668v-.099.099c.179 0 .346-.069.472-.195l3.193-3.194v2.218c0 .369.3.668.668.668s.668-.3.668-.668v-3.815c.005-.18-.057-.362-.197-.498z"></path></g></svg></div>
    <span class="text-sm font-bold" style="color: black;">${toolName} 사용하러 가기</span>
  </a>
</div>`;
    }
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {processedContent}
    </ReactMarkdown>
  );
}