"use client";

import React from 'react';
import type { LexicalContent, LexicalNode } from '@/types/lexical';

interface RichTextRendererProps {
  content: LexicalContent | LexicalNode[] | string | undefined; // Lexical content from Payload CMS
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  // Handle string content
  if (typeof content === 'string') {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Handle Lexical content structure
  if (content && typeof content === 'object' && 'root' in content && content.root?.children) {
    return (
      <div className={className}>
        {renderLexicalContent(content.root.children)}
      </div>
    );
  }

  // Handle array of content
  if (Array.isArray(content)) {
    return (
      <div className={className}>
        {content.map((item, index) => (
          <div key={index}>{renderNode(item)}</div>
        ))}
      </div>
    );
  }

  // Fallback
  return <div className={className}>No content available</div>;
}

function renderLexicalContent(nodes: LexicalNode[]): React.ReactNode[] {
  return nodes.map((node, index) => (
    <React.Fragment key={index}>
      {renderNode(node)}
    </React.Fragment>
  ));
}

function renderNode(node: LexicalNode): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case 'paragraph':
      return (
        <p className="mb-4 text-body-adaptive">
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </p>
      );

    case 'heading':
      // node.tag is already 'h1', 'h2', etc. - don't add 'h' prefix
      const HeadingTag = node.tag as keyof React.JSX.IntrinsicElements;
      const headingClasses: Record<string, string> = {
        h1: 'title-5xl font-featured mb-6',
        h2: 'title-4xl font-featured mb-4',
        h3: 'title-3xl font-featured mb-3',
        h4: 'title-2xl font-featured mb-3',
        h5: 'text-xl font-semibold mb-2',
        h6: 'text-lg font-semibold mb-2',
      };
      const className = `${headingClasses[node.tag as string] || ''}`;
      const style = { color: 'var(--text-adaptive)' };
      const Component = HeadingTag as keyof React.JSX.IntrinsicElements;
      return (
        <Component className={className} style={style}>
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </Component>
      );

    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      const listClass = node.listType === 'number' 
        ? 'list-decimal list-inside mb-4 space-y-2' 
        : 'list-disc list-inside mb-4 space-y-2';
      return (
        <ListTag className={listClass}>
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </ListTag>
      );

    case 'listitem':
      return (
        <li>
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </li>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-secondary pl-4 italic mb-4">
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </blockquote>
      );

    case 'link':
      const fields = node.fields as Record<string, unknown>;
      return (
        <a
          href={(fields?.url as string) || '#'}
          className="text-secondary hover:underline"
          target={fields?.newTab ? '_blank' : undefined}
          rel={fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {node.children ? renderLexicalContent(node.children as LexicalNode[]) : null}
        </a>
      );

    case 'text':
      let textElement: React.ReactNode = (node as Record<string, unknown>).text as React.ReactNode;
      const format = (node as Record<string, unknown>).format as number;

      if (format & 1) { // bold
        textElement = <strong>{textElement}</strong>;
      }
      if (format & 2) { // italic
        textElement = <em>{textElement}</em>;
      }
      if (format & 8) { // underline
        textElement = <u>{textElement}</u>;
      }
      if (format & 16) { // strikethrough
        textElement = <s>{textElement}</s>;
      }
      if (format & 32) { // code
        textElement = <code className="bg-surface-tertiary px-1 rounded">{textElement}</code>;
      }
      
      return textElement;

    case 'linebreak':
      return <br />;

    default:
      // Log unknown types for debugging
      console.warn('Unknown node type:', node.type, node);
      return null;
  }
}