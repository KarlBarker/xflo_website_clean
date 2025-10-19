import React from 'react';
import Image from 'next/image';
import { LexicalContent, LexicalNode, LexicalTextNode, LexicalParagraphNode, LexicalHeadingNode, LexicalListNode, LexicalListItemNode, LexicalLinkNode, LexicalQuoteNode } from '@/types/lexical';

interface LexicalRendererProps {
  content: LexicalContent;
  className?: string;
}

export function LexicalRenderer({ content, className = '' }: LexicalRendererProps) {
  if (!content?.root?.children) {
    return null;
  }

  return (
    <div className={`lexical-content ${className}`}>
      {content.root.children.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: LexicalNode }): JSX.Element | null {
  switch (node.type) {
    case 'paragraph':
      return <RenderParagraph node={node as LexicalParagraphNode} />;
    case 'heading':
      return <RenderHeading node={node as LexicalHeadingNode} />;
    case 'list':
      return <RenderList node={node as LexicalListNode} />;
    case 'listitem':
      return <RenderListItem node={node as LexicalListItemNode} />;
    case 'quote':
      return <RenderQuote node={node as LexicalQuoteNode} />;
    case 'text':
      return <RenderText node={node as LexicalTextNode} />;
    case 'linebreak':
      return <br />;
    case 'link':
      return <RenderLink node={node as LexicalLinkNode} />;
    case 'upload':
    case 'image':
      return <RenderImage node={node} />;
    default:
      console.warn('Unknown node type:', node.type);
      return null;
  }
}

function RenderParagraph({ node }: { node: LexicalParagraphNode }) {
  if (!node.children || node.children.length === 0) {
    return <p className="mb-4">&nbsp;</p>;
  }

  return (
    <p className="mb-4 text-base leading-relaxed text-content-primary">
      {node.children.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </p>
  );
}

function RenderHeading({ node }: { node: LexicalHeadingNode }) {
  const tag = node.tag || 'h2';
  const className = {
    h1: 'title-6xl font-featured mb-6 text-content-primary',
    h2: 'title-5xl font-featured mb-5 text-content-primary',
    h3: 'title-4xl font-semibold mb-4 text-content-primary',
    h4: 'title-3xl font-semibold mb-3 text-content-primary',
    h5: 'title-2xl font-semibold mb-3 text-content-primary',
    h6: 'text-navigation font-featured mb-2 text-content-primary',
  }[tag];

  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ));

  return React.createElement(tag, { className }, children);
}

function RenderList({ node }: { node: LexicalListNode }) {
  const Tag = node.tag || 'ul';
  const className = Tag === 'ul'
    ? 'list-disc list-outside ml-6 mb-4 space-y-2'
    : 'list-decimal list-outside ml-6 mb-4 space-y-2';

  return (
    <Tag className={className}>
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </Tag>
  );
}

function RenderListItem({ node }: { node: LexicalListItemNode }) {
  return (
    <li className="text-base text-content-primary">
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </li>
  );
}

function RenderLink({ node }: { node: LexicalLinkNode }) {
  return (
    <a
      href={node.url}
      target={node.target || '_self'}
      rel={node.rel || (node.target === '_blank' ? 'noopener noreferrer' : undefined)}
      className="text-content-brand hover:underline"
    >
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </a>
  );
}

function RenderQuote({ node }: { node: LexicalQuoteNode }) {
  return (
    <blockquote className="border-l-4 border-content-brand pl-4 py-2 my-6 italic text-content-secondary">
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </blockquote>
  );
}

function RenderImage({ node }: { node: any }) {
  const value = node.value || node;
  const imageUrl = value?.url || value?.src;
  const alt = value?.alt || value?.altText || 'Blog image';
  const width = value?.width || 1200;
  const height = value?.height || 600;

  if (!imageUrl) return null;

  return (
    <div className="my-8">
      <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 784px"
        />
      </div>
      {alt && alt !== 'Blog image' && (
        <p className="text-sm text-content-muted mt-2 text-center italic">{alt}</p>
      )}
    </div>
  );
}

function RenderText({ node }: { node: LexicalTextNode }) {
  let text: React.ReactNode = node.text;

  // Apply formatting based on format bit flags
  // Format is a bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, etc.
  const format = node.format || 0;

  if (format & 1) { // Bold
    text = <strong>{text}</strong>;
  }
  if (format & 2) { // Italic
    text = <em>{text}</em>;
  }
  if (format & 8) { // Underline
    text = <u>{text}</u>;
  }
  if (format & 4) { // Strikethrough
    text = <s>{text}</s>;
  }
  if (format & 16) { // Code
    text = <code className="bg-surface-tertiary px-1 py-0.5 rounded text-sm">{text}</code>;
  }

  return <>{text}</>;
}
