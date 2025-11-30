import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * CoverImageElement
 *
 * Full-width cover image with drag-to-reposition support.
 * Similar to Notion's cover image functionality.
 */
const CoverImageElement = ({ data, settings, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [imagePosition, setImagePosition] = useState(data.position || 50); // 0-100 percentage
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!data.url) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const delta = e.clientY - dragStartY;
    const imageHeight = imageRef.current?.offsetHeight || 300;
    const deltaPercentage = (delta / imageHeight) * 100;

    let newPosition = imagePosition - deltaPercentage;
    newPosition = Math.max(0, Math.min(100, newPosition));

    setImagePosition(newPosition);
    setDragStartY(e.clientY);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onUpdate({ data: { ...data, position: imagePosition } });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ data: { ...data, url: event.target?.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onUpdate({ data: { ...data, url: '', position: 50 } });
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStartY, imagePosition]);

  const height = settings.height || '300px';

  if (!data.url) {
    return (
      <div
        className="cover-image-empty relative bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group"
        style={{ height }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Click to upload cover image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cover-image-element relative group" style={{ height }}>
      <div
        ref={imageRef}
        className={`absolute inset-0 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        <img
          src={data.url}
          alt={data.alt || 'Cover image'}
          className="w-full h-full object-cover select-none"
          style={{
            objectPosition: `50% ${imagePosition}%`
          }}
          draggable={false}
        />
      </div>

      {/* Hover controls */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <label className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-md text-sm font-medium text-gray-700 hover:bg-white cursor-pointer shadow-sm border border-gray-200">
          Change
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handleRemove}
          className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-md text-sm font-medium text-red-600 hover:bg-white shadow-sm border border-gray-200"
        >
          Remove
        </button>
      </div>

      {/* Drag hint */}
      {!isDragging && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
            Drag to reposition
          </div>
        </div>
      )}
    </div>
  );
};

CoverImageElement.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
    position: PropTypes.number
  }),
  settings: PropTypes.shape({
    height: PropTypes.string
  }),
  onUpdate: PropTypes.func.isRequired
};

CoverImageElement.defaultProps = {
  data: {
    url: '',
    alt: '',
    position: 50
  },
  settings: {
    height: '300px'
  }
};

export default CoverImageElement;
