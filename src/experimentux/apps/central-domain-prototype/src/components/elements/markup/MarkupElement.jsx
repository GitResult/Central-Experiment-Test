/**
 * MarkupElement Component
 * Renders markup elements with full schema support (13 types, 4 edit modes, 5 setting groups)
 */

import { useTheme } from '../../theme/ThemeProvider';
import { validateMarkupElement } from '../../../schemas/markupElementSchema';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

export function MarkupElement({ data, settings, onChange, isEditMode = false }) {
  const { resolveToken, resolveAllTokens } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const [errors, setErrors] = useState([]);
  const contentRef = useRef(null);

  // Resolve theme tokens in settings
  const resolvedSettings = resolveAllTokens(settings);

  // Extract markup-specific settings
  const {
    markupType = 'paragraph',
    editMode = 'click',
    placeholder = '',
    level = 2,
    iconName = 'star',
    iconSize = 24,
    linkUrl = '#',
    linkTarget = '_self',
    codeLanguage = 'javascript',
  } = settings.markup || {};

  // Extract base settings (Layout, Appearance, Typography, Business Rules)
  const {
    layout = {},
    appearance = {},
    typography = {},
    businessRules = {},
  } = resolvedSettings;

  // Validate on mount and when settings change
  useEffect(() => {
    const element = { type: 'markup', data, settings };
    const validation = validateMarkupElement(element);
    if (!validation.valid) {
      setErrors(validation.errors);
    }
  }, [data, settings]);

  // Handle content editing
  const handleEdit = () => {
    if (editMode === 'readonly') return;

    if (editMode === 'always') {
      return; // Always editable
    }

    if (editMode === 'click' || editMode === 'double-click') {
      setIsEditing(true);
      setTimeout(() => contentRef.current?.focus(), 0);
    }
  };

  const handleBlur = () => {
    if (editMode !== 'always') {
      setIsEditing(false);
    }
    if (onChange && content !== data.content) {
      onChange({ content });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(data.content || '');
    }
    if (e.key === 'Enter' && !e.shiftKey && markupType !== 'paragraph') {
      e.preventDefault();
      handleBlur();
    }
  };

  // Apply business rules (visibility)
  if (businessRules.visibility?.hidden) {
    return null;
  }

  // Container style with Layout + Appearance settings
  const containerStyle = {
    width: layout.width || 'auto',
    marginTop: layout.spacing?.margin?.top || 0,
    marginBottom: layout.spacing?.margin?.bottom || resolveToken('{{theme.spacing.md}}'),
    marginLeft: layout.spacing?.margin?.left || 0,
    marginRight: layout.spacing?.margin?.right || 0,
    paddingTop: layout.spacing?.padding?.top || 0,
    paddingBottom: layout.spacing?.padding?.bottom || 0,
    paddingLeft: layout.spacing?.padding?.left || 0,
    paddingRight: layout.spacing?.padding?.right || 0,
    background: appearance.background || 'transparent',
    border: appearance.border?.width
      ? `${appearance.border.width} ${appearance.border.style} ${appearance.border.color}`
      : 'none',
    borderRadius: appearance.borderRadius || 0,
    boxShadow: appearance.shadow || 'none',
    opacity: appearance.opacity !== undefined ? appearance.opacity : 1,
  };

  // Base text style with Typography settings
  const textStyle = {
    ...containerStyle,
    fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.base}}'),
    fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.normal}}'),
    lineHeight: typography.lineHeight || resolveToken('{{theme.typography.lineHeight.normal}}'),
    color: typography.color || resolveToken('{{theme.colors.text.primary}}'),
    fontFamily: typography.fontFamily || 'inherit',
    letterSpacing: typography.letterSpacing || 'normal',
  };

  // Render editable content
  const renderEditableContent = (defaultStyle, Tag = 'div') => {
    const isEditable = isEditMode && editMode !== 'readonly';
    const showEditing = isEditable && (editMode === 'always' || isEditing);

    if (showEditing) {
      return (
        <Tag
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={(e) => setContent(e.target.textContent)}
          onKeyDown={handleKeyDown}
          style={{
            ...defaultStyle,
            outline: editMode === 'always'
              ? `1px dashed ${resolveToken('{{theme.colors.border.default}}')}`
              : `2px solid ${resolveToken('{{theme.colors.primary.500}}')}`,
            minHeight: '1em',
          }}
        >
          {content || placeholder}
        </Tag>
      );
    }

    return (
      <Tag
        onClick={isEditable ? handleEdit : undefined}
        onDoubleClick={isEditable && editMode === 'double-click' ? handleEdit : undefined}
        style={{
          ...defaultStyle,
          cursor: isEditable && editMode !== 'readonly' ? 'text' : 'default',
        }}
      >
        {content || placeholder}
      </Tag>
    );
  };

  // Render different markup types
  const renderMarkup = () => {
    switch (markupType) {
      case 'title':
        return renderEditableContent({
          ...textStyle,
          fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.4xl}}'),
          fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.bold}}'),
        }, 'h1');

      case 'heading':
        const HeadingTag = `h${Math.max(1, Math.min(6, level || 2))}`;
        const headingSizes = {
          1: '{{theme.typography.fontSize.3xl}}',
          2: '{{theme.typography.fontSize.2xl}}',
          3: '{{theme.typography.fontSize.xl}}',
          4: '{{theme.typography.fontSize.lg}}',
          5: '{{theme.typography.fontSize.base}}',
          6: '{{theme.typography.fontSize.sm}}',
        };
        return renderEditableContent({
          ...textStyle,
          fontSize: typography.fontSize || resolveToken(headingSizes[level || 2]),
          fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.semibold}}'),
        }, HeadingTag);

      case 'paragraph':
        return renderEditableContent(textStyle, 'p');

      case 'subtitle':
        return renderEditableContent({
          ...textStyle,
          fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.lg}}'),
          color: typography.color || resolveToken('{{theme.colors.text.secondary}}'),
        }, 'h2');

      case 'label':
        return renderEditableContent({
          ...textStyle,
          fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.sm}}'),
          fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.medium}}'),
        }, 'label');

      case 'quote':
        return (
          <blockquote
            style={{
              ...textStyle,
              paddingLeft: resolveToken('{{theme.spacing.4}}'),
              borderLeft: `4px solid ${resolveToken('{{theme.colors.border.default}}')}`,
              fontStyle: 'italic',
              color: typography.color || resolveToken('{{theme.colors.text.secondary}}'),
            }}
          >
            {renderEditableContent(textStyle, 'p')}
          </blockquote>
        );

      case 'code':
        return (
          <pre
            style={{
              ...containerStyle,
              padding: resolveToken('{{theme.spacing.4}}'),
              background: appearance.background || resolveToken('{{theme.colors.background.secondary}}'),
              borderRadius: appearance.borderRadius || resolveToken('{{theme.borderRadius.md}}'),
              overflow: 'auto',
            }}
          >
            <code
              style={{
                fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.sm}}'),
                fontFamily: 'monospace',
                color: typography.color || resolveToken('{{theme.colors.text.primary}}'),
              }}
            >
              {content}
            </code>
          </pre>
        );

      case 'button':
        return (
          <button
            style={{
              ...containerStyle,
              padding: `${resolveToken('{{theme.spacing.2}}')} ${resolveToken('{{theme.spacing.6}}')}`,
              background: appearance.background || resolveToken('{{theme.colors.primary.500}}'),
              color: typography.color || resolveToken('{{theme.colors.text.inverse}}'),
              fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.base}}'),
              fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.medium}}'),
              border: 'none',
              borderRadius: appearance.borderRadius || resolveToken('{{theme.borderRadius.md}}'),
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {content || 'Button'}
          </button>
        );

      case 'link':
        return (
          <a
            href={linkUrl}
            target={linkTarget}
            rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
            style={{
              ...textStyle,
              color: typography.color || resolveToken('{{theme.colors.primary.500}}'),
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {content || 'Link'}
          </a>
        );

      case 'icon':
        return (
          <div style={containerStyle}>
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={typography.color || resolveToken('{{theme.colors.text.primary}}')}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Simple star icon as default */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        );

      case 'divider':
        return (
          <hr
            style={{
              ...containerStyle,
              border: 'none',
              borderTop: appearance.border?.width
                ? `${appearance.border.width} ${appearance.border.style} ${appearance.border.color}`
                : `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
            }}
          />
        );

      case 'spacer':
        return (
          <div
            style={{
              height: layout.height || resolveToken('{{theme.spacing.8}}'),
              width: '100%',
            }}
          />
        );

      case 'html':
        // Render raw HTML content (for combos/templates)
        return (
          <div
            style={containerStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );

      default:
        return renderEditableContent(textStyle, 'div');
    }
  };

  return (
    <div>
      {renderMarkup()}
      {errors.length > 0 && (
        <div
          style={{
            color: resolveToken('{{theme.colors.error.500}}'),
            fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
            marginTop: resolveToken('{{theme.spacing.xs}}'),
          }}
        >
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
}

MarkupElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
  settings: PropTypes.shape({
    markup: PropTypes.object,
    layout: PropTypes.object,
    appearance: PropTypes.object,
    typography: PropTypes.object,
    businessRules: PropTypes.object,
  }).isRequired,
  onChange: PropTypes.func,
  isEditMode: PropTypes.bool,
};
