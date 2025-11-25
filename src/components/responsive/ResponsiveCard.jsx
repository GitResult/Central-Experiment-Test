/**
 * ResponsiveCard Component
 *
 * A unified card component that adapts to different screen sizes:
 * - Desktop: Standard card with hover effects
 * - Mobile: Touch-optimized card with larger tap targets
 * - Maintains consistent appearance across all modes
 *
 * Features:
 * - Touch-friendly sizing (minimum 44px height)
 * - Responsive padding and spacing
 * - Icon support with color theming
 * - Badge/label support
 * - Click/tap handlers
 * - Hover states (desktop) / Active states (mobile)
 * - Optional description and metadata
 *
 * @component
 */

import React from 'react';

const ResponsiveCard = ({
  icon: Icon,
  iconColor = 'blue',
  title,
  description,
  badge,
  metadata,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  children,
  variant = 'default', // 'default', 'compact', 'detailed'
  showChevron = false,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    cyan: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    slate: 'bg-slate-50 text-slate-600 hover:bg-slate-100',
  };

  const variantClasses = {
    default: 'p-4 sm:p-6',
    compact: 'p-3 sm:p-4',
    detailed: 'p-6 sm:p-8',
  };

  const baseClasses = `
    bg-white rounded-xl border border-gray-200
    transition-all duration-200
    ${onClick && !disabled ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-98' : ''}
    ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : 'shadow-sm'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${variantClasses[variant]}
    ${className}
  `;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyPress = (e) => {
    if (!disabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={baseClasses}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {/* Compact Variant */}
      {variant === 'compact' && (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${colorClasses[iconColor]}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{title}</h4>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">{description}</p>
            )}
          </div>
          {badge && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded flex-shrink-0">
              {badge}
            </span>
          )}
          {showChevron && (
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      )}

      {/* Default Variant */}
      {variant === 'default' && (
        <>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            {Icon && (
              <div className={`p-2 sm:p-3 rounded-lg transition-colors ${colorClasses[iconColor]}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
            )}
            {badge && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {badge}
              </span>
            )}
          </div>

          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{title}</h4>

          {description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}

          {metadata && (
            <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
              {metadata}
            </div>
          )}

          {children}
        </>
      )}

      {/* Detailed Variant */}
      {variant === 'detailed' && (
        <>
          <div className="flex items-start gap-4 mb-4">
            {Icon && (
              <div className={`p-3 sm:p-4 rounded-xl transition-colors ${colorClasses[iconColor]}`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">{title}</h4>
                {badge && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
              )}
            </div>
          </div>

          {metadata && (
            <div className="text-xs sm:text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              {metadata}
            </div>
          )}

          {children}
        </>
      )}
    </div>
  );
};

export default ResponsiveCard;
