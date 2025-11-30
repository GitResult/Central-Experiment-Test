/**
 * Markdown Parser Utilities
 *
 * Parse markdown into slides and handle slide-specific features.
 */

/**
 * Split markdown into individual slides
 * Slides are separated by '---' on its own line
 *
 * @param {string} markdown - Raw markdown content
 * @returns {Array} Array of slide objects
 */
export function parseMarkdownToSlides(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return [{
      content: '# Welcome to Your Presentation\n\nStart editing to create your slides...',
      notes: '',
      metadata: {}
    }];
  }

  // Split on slide separator: ---
  // Must be on its own line (surrounded by newlines)
  const slideContents = markdown.split(/\n---\n/);

  return slideContents.map((content, index) => {
    const slide = {
      id: `slide-${index}`,
      content: content.trim(),
      notes: '',
      metadata: {}
    };

    // Extract speaker notes if present
    // Format: <!--notes: speaker notes here -->
    const notesMatch = content.match(/<!--\s*notes:\s*([\s\S]*?)\s*-->/);
    if (notesMatch) {
      slide.notes = notesMatch[1].trim();
      // Remove notes from content
      slide.content = content.replace(/<!--\s*notes:[\s\S]*?-->/, '').trim();
    }

    // Extract metadata if present (frontmatter-style)
    // Format: layout: two-column
    const metadataMatch = content.match(/^(\w+):\s*(.+)$/m);
    if (metadataMatch) {
      const [, key, value] = metadataMatch;
      slide.metadata[key] = value.trim();
    }

    return slide;
  });
}

/**
 * Convert slides back to markdown
 *
 * @param {Array} slides - Array of slide objects
 * @returns {string} Markdown string
 */
export function slidesToMarkdown(slides) {
  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return '';
  }

  return slides.map(slide => {
    let content = slide.content;

    // Add speaker notes if present
    if (slide.notes) {
      content += `\n\n<!--notes: ${slide.notes} -->`;
    }

    return content;
  }).join('\n\n---\n\n');
}

/**
 * Get slide count from markdown
 *
 * @param {string} markdown - Raw markdown content
 * @returns {number} Number of slides
 */
export function getSlideCount(markdown) {
  if (!markdown) return 0;
  return parseMarkdownToSlides(markdown).length;
}

/**
 * Extract first heading from markdown (for slide title)
 *
 * @param {string} markdown - Slide markdown content
 * @returns {string} First heading or empty string
 */
export function extractSlideTitle(markdown) {
  if (!markdown) return 'Untitled';

  const headingMatch = markdown.match(/^#+\s+(.+)$/m);
  return headingMatch ? headingMatch[1] : 'Untitled';
}

/**
 * Create a default presentation template
 *
 * @param {string} templateName - Template name
 * @returns {string} Markdown template
 */
export function createTemplate(templateName = 'blank') {
  const templates = {
    blank: `# Welcome to Your Presentation

Start typing to create your first slide...

---

## Slide 2

Add your content here

---

## Slide 3

Use **markdown** for *formatting*`,

    'pitch-deck': `# Company Name

Your tagline here

---

## Problem

What problem are you solving?

- Pain point 1
- Pain point 2
- Pain point 3

---

## Solution

How does your product solve it?

---

## Market Opportunity

- Total Addressable Market
- Target segment
- Growth potential

---

## Business Model

How will you make money?

---

## Team

Who's building this?

---

## Ask

What do you need?`,

    'technical': `# Technical Presentation

Presenter Name

---

## Agenda

1. Introduction
2. Architecture Overview
3. Implementation Details
4. Demo
5. Q&A

---

## Code Example

\`\`\`javascript
const presentation = {
  elegant: true,
  simple: true,
  powerful: true
};
\`\`\`

---

## Thank You

Questions?`
  };

  return templates[templateName] || templates.blank;
}
