import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * SlideRenderer Component
 *
 * Renders a single slide from markdown content.
 * Supports code highlighting, images, and rich formatting.
 */
const SlideRenderer = ({ slide, theme, isActive = false, className = '' }) => {
  if (!slide) {
    return (
      <div className={`slide-renderer ${className}`}>
        <p className="text-gray-400">No slide content</p>
      </div>
    );
  }

  // Apply theme styles
  const slideStyles = {
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
    padding: theme.spacing.slidePadding,
    backgroundColor: theme.colors.background,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  // Custom components for markdown rendering
  const components = {
    // Headings
    h1: ({ children }) => (
      <h1
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: theme.typeScale.title.fontSize,
          fontWeight: theme.typeScale.title.fontWeight,
          lineHeight: theme.typeScale.title.lineHeight,
          letterSpacing: theme.typeScale.title.letterSpacing,
          color: theme.colors.heading,
          marginBottom: theme.spacing.headingMargin
        }}
      >
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: theme.typeScale.heading1.fontSize,
          fontWeight: theme.typeScale.heading1.fontWeight,
          lineHeight: theme.typeScale.heading1.lineHeight,
          letterSpacing: theme.typeScale.heading1.letterSpacing,
          color: theme.colors.heading,
          marginBottom: theme.spacing.headingMargin
        }}
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: theme.typeScale.heading2.fontSize,
          fontWeight: theme.typeScale.heading2.fontWeight,
          lineHeight: theme.typeScale.heading2.lineHeight,
          letterSpacing: theme.typeScale.heading2.letterSpacing,
          color: theme.colors.heading,
          marginBottom: theme.spacing.headingMargin
        }}
      >
        {children}
      </h3>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p
        style={{
          fontSize: theme.typeScale.body.fontSize,
          lineHeight: theme.typeScale.body.lineHeight,
          marginBottom: theme.spacing.paragraphMargin,
          color: theme.colors.text
        }}
      >
        {children}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul
        style={{
          fontSize: theme.typeScale.body.fontSize,
          lineHeight: theme.typeScale.body.lineHeight,
          marginBottom: theme.spacing.paragraphMargin,
          paddingLeft: '32px'
        }}
      >
        {children}
      </ul>
    ),

    li: ({ children }) => (
      <li style={{ marginBottom: theme.spacing.listItemMargin }}>
        {children}
      </li>
    ),

    // Code blocks
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return !inline ? (
        <div style={{ marginBottom: theme.spacing.paragraphMargin }}>
          <SyntaxHighlighter
            style={tomorrow}
            language={language}
            PreTag="div"
            customStyle={{
              borderRadius: '8px',
              fontSize: theme.typeScale.code.fontSize,
              fontFamily: theme.fonts.code,
              padding: '24px'
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          style={{
            backgroundColor: theme.colors.code.background,
            color: theme.colors.code.text,
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: theme.fonts.code,
            fontSize: '0.9em'
          }}
          {...props}
        >
          {children}
        </code>
      );
    },

    // Images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: theme.spacing.paragraphMargin
        }}
      />
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        style={{
          color: theme.colors.accent,
          textDecoration: 'none'
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Strong/Bold
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),

    // Emphasis/Italic
    em: ({ children }) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    )
  };

  return (
    <div
      className={`slide-renderer ${className} ${isActive ? 'active' : ''}`}
      style={slideStyles}
    >
      <div className="slide-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {slide.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default SlideRenderer;
