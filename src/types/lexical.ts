// TypeScript interfaces for Lexical rich text content

export interface LexicalContent {
  root: {
    children: LexicalNode[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    type: 'root';
    version: number;
  };
}

export interface LexicalNode {
  type: 'paragraph' | 'heading' | 'list' | 'listitem' | 'text' | 'linebreak' | 'link' | 'quote';
  version: number;
  [key: string]: unknown;
}

export interface LexicalTextNode extends LexicalNode {
  type: 'text';
  detail: number;
  format: number;
  mode: 'normal' | 'token' | 'segmented';
  style: string;
  text: string;
}

export interface LexicalElementNode extends LexicalNode {
  children: LexicalNode[];
  direction: 'ltr' | 'rtl' | null;
  format: string;
  indent: number;
}

export interface LexicalParagraphNode extends LexicalElementNode {
  type: 'paragraph';
}

export interface LexicalHeadingNode extends LexicalElementNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface LexicalListNode extends LexicalElementNode {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  start: number;
  tag: 'ul' | 'ol';
}

export interface LexicalListItemNode extends LexicalElementNode {
  type: 'listitem';
  checked?: boolean;
  value: number;
}

export interface LexicalLinkNode extends LexicalElementNode {
  type: 'link';
  url: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export interface LexicalQuoteNode extends LexicalElementNode {
  type: 'quote';
}

export interface LexicalLineBreakNode extends LexicalNode {
  type: 'linebreak';
}