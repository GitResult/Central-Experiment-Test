import React from 'react';
import PropTypes from 'prop-types';

/**
 * ImageElement Component
 *
 * Displays an image with optional caption.
 * Supports different sizing and object-fit options.
 *
 * @param {Object} data - Element data
 * @param {string} data.src - Image URL
 * @param {string} data.alt - Alt text
 * @param {string} data.caption - Optional caption
 * @param {Object} settings - Element settings
 * @param {string} settings.width - Width (auto, full, 1/2, 1/3, 2/3)
 * @param {string} settings.objectFit - Object fit (cover, contain, fill)
 * @param {string} settings.height - Height in pixels or auto
 * @param {Function} onUpdate - Callback for updates
 */
const ImageElement = ({ data = {}, settings = {}, onUpdate }) => {
  const { src, alt = 'Image', caption } = data;

  // Width mapping
  const widthClasses = {
    'auto': 'w-auto',
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3'
  };

  const width = widthClasses[settings.width || 'full'];
  const objectFit = settings.objectFit || 'cover';
  const height = settings.height || '300px';

  if (!src) {
    return (
      <div className={`image-element-placeholder ${width} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50`}
           style={{ height }}>
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="text-sm">No image set</div>
        </div>
      </div>
    );
  }

  return (
    <figure className={`image-element ${width} mx-auto`}>
      <img
        src={src}
        alt={alt}
        className={`rounded-lg shadow-sm object-${objectFit}`}
        style={{ height, width: '100%' }}
      />
      {caption && (
        <figcaption className="text-sm text-gray-500 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

ImageElement.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string
  }),
  settings: PropTypes.shape({
    width: PropTypes.oneOf(['auto', 'full', '1/2', '1/3', '2/3']),
    objectFit: PropTypes.oneOf(['cover', 'contain', 'fill']),
    height: PropTypes.string
  }),
  onUpdate: PropTypes.func
};

export default ImageElement;
