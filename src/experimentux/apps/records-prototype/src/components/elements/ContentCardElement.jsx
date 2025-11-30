import React from 'react';
import PropTypes from 'prop-types';

/**
 * ContentCardElement Component
 *
 * A versatile card component for displaying content with different variants.
 * Supports video, info, feature, and CTA card types.
 *
 * @param {Object} data - Element data
 * @param {string} data.title - Card title
 * @param {string} data.description - Card description
 * @param {Object} data.media - Media object (type, src)
 * @param {Object} data.cta - Call to action (text, url)
 * @param {Object} settings - Element settings
 * @param {string} settings.variant - Card variant (video, info, feature, cta)
 * @param {string} settings.background - Background style (light, dark)
 * @param {Function} onUpdate - Callback for updates
 */
const ContentCardElement = ({ data = {}, settings = {}, onUpdate }) => {
  const {
    title = 'Card Title',
    description = 'Card description goes here...',
    media,
    cta
  } = data;

  const variant = settings.variant || 'info';
  const background = settings.background || 'light';

  // Background styles
  const bgStyles = {
    'light': 'bg-white border border-gray-200',
    'dark': 'bg-gray-900 text-white'
  };

  const bgClass = bgStyles[background];

  return (
    <div className={`content-card-element ${bgClass} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}>
      {/* Media Section */}
      {media && media.type === 'image' && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={media.src || 'https://via.placeholder.com/600x400?text=Image'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {media && media.type === 'video' && (
        <div className="aspect-video bg-gray-800 flex items-center justify-center">
          <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className={`text-xl font-semibold mb-3 ${background === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`mb-4 leading-relaxed ${background === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>

        {/* CTA Button */}
        {cta && (
          <a
            href={cta.url || '#'}
            className={`inline-flex items-center font-medium ${
              background === 'dark'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
            onClick={(e) => {
              if (!cta.url || cta.url === '#') {
                e.preventDefault();
              }
            }}
          >
            {cta.text || 'Learn more'}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>

      {/* Variant-specific styling indicator */}
      {variant === 'feature' && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Featured
        </div>
      )}
    </div>
  );
};

ContentCardElement.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    media: PropTypes.shape({
      type: PropTypes.oneOf(['image', 'video']),
      src: PropTypes.string
    }),
    cta: PropTypes.shape({
      text: PropTypes.string,
      url: PropTypes.string
    })
  }),
  settings: PropTypes.shape({
    variant: PropTypes.oneOf(['video', 'info', 'feature', 'cta']),
    background: PropTypes.oneOf(['light', 'dark'])
  }),
  onUpdate: PropTypes.func
};

export default ContentCardElement;
