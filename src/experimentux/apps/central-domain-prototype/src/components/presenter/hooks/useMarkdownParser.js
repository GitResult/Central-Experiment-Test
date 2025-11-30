/**
 * useMarkdownParser Hook
 * Parses markdown content into slides with frontmatter and speaker notes
 */

import { useMemo } from 'react';

/**
 * Parse markdown content into presentation slides
 * @param {string} markdown - Raw markdown content
 * @returns {Object} Parsed presentation data
 */
export function useMarkdownParser(markdown = '') {
  const parsed = useMemo(() => {
    if (!markdown || markdown.trim() === '') {
      return {
        frontmatter: {},
        slides: [],
        totalSlides: 0
      };
    }

    try {
      // Extract frontmatter
      const frontmatter = extractFrontmatter(markdown);

      // Split content by slide separators (---)
      const withoutFrontmatter = removeFrontmatter(markdown);
      const slideContents = splitIntoSlides(withoutFrontmatter);

      // Parse each slide
      const slides = slideContents.map((content, index) => {
        const { mainContent, speakerNotes, layout } = parseSlideContent(content);

        return {
          index,
          content: mainContent,
          html: markdownToHtml(mainContent),
          speakerNotes,
          layout: layout || 'default'
        };
      });

      return {
        frontmatter,
        slides,
        totalSlides: slides.length
      };
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return {
        frontmatter: {},
        slides: [],
        totalSlides: 0,
        error: error.message
      };
    }
  }, [markdown]);

  return parsed;
}

/**
 * Extract frontmatter from markdown
 */
function extractFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = markdown.match(frontmatterRegex);

  if (!match) return {};

  const frontmatterText = match[1];
  const frontmatter = {};

  // Simple YAML parsing (key: value)
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  return frontmatter;
}

/**
 * Remove frontmatter from markdown
 */
function removeFrontmatter(markdown) {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n*/;
  return markdown.replace(frontmatterRegex, '');
}

/**
 * Split markdown into individual slides
 */
function splitIntoSlides(markdown) {
  // Split on horizontal rules (---) that are on their own line
  const slides = markdown.split(/\n---\n/);
  return slides.map(slide => slide.trim()).filter(slide => slide !== '');
}

/**
 * Parse a single slide's content
 */
function parseSlideContent(content) {
  // Extract speaker notes (<!-- ... -->)
  const notesRegex = /<!--\s*([\s\S]*?)\s*-->/g;
  let speakerNotes = '';
  const notesMatches = [...content.matchAll(notesRegex)];

  if (notesMatches.length > 0) {
    speakerNotes = notesMatches.map(match => match[1].trim()).join('\n\n');
  }

  // Remove speaker notes from main content
  let mainContent = content.replace(notesRegex, '').trim();

  // Extract layout directive (layout: name)
  let layout = 'default';
  const layoutRegex = /^layout:\s*(\w+)\s*\n/;
  const layoutMatch = mainContent.match(layoutRegex);

  if (layoutMatch) {
    layout = layoutMatch[1];
    mainContent = mainContent.replace(layoutRegex, '').trim();
  }

  // Detect layout from content patterns
  if (!layoutMatch) {
    layout = detectLayout(mainContent);
  }

  return {
    mainContent,
    speakerNotes,
    layout
  };
}

/**
 * Auto-detect slide layout from content
 */
function detectLayout(content) {
  const lines = content.split('\n').filter(l => l.trim() !== '');

  if (lines.length === 0) return 'default';

  // Title slide: starts with # and has 1-2 lines total
  if (lines.length <= 2 && lines[0].startsWith('# ')) {
    return 'title';
  }

  // Quote slide: starts with >
  if (lines[0].startsWith('>')) {
    return 'quote';
  }

  // Code slide: mostly code blocks
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  if (codeBlockCount >= 1 && content.length / (codeBlockCount * 100) < 5) {
    return 'code';
  }

  // Two-column: contains ::right:: or ::left::
  if (content.includes('::right::') || content.includes('::left::')) {
    return 'two-cols';
  }

  // Section divider: single # heading, short
  if (lines.length === 1 && lines[0].startsWith('# ') && lines[0].length < 50) {
    return 'section';
  }

  // End slide: contains "thank you" or "questions"
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('thank you') || lowerContent.includes('questions')) {
    return 'end';
  }

  return 'default';
}

/**
 * Convert markdown to HTML
 */
function markdownToHtml(markdown) {
  try {
    // Handle two-column layout special syntax
    if (markdown.includes('::right::')) {
      const [left, right] = markdown.split('::right::');
      return `
        <div style="display: flex; gap: 2rem;">
          <div style="flex: 1;">${processMarkdown(left.trim())}</div>
          <div style="flex: 1;">${processMarkdown(right.trim())}</div>
        </div>
      `;
    }

    return processMarkdown(markdown);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return `<pre>${markdown}</pre>`;
  }
}

/**
 * Process markdown with remark
 */
function processMarkdown(markdown) {
  // Simple markdown-to-HTML conversion
  // (In a real implementation, we'd use remark-html, but for simplicity we'll do basic replacements)

  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export default useMarkdownParser;
