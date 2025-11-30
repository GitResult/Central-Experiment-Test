/**
 * Telemetry Events for Slide Decks Feature
 *
 * All telemetry events follow the pattern: feature_action_context
 * Example: deck_created, slide_added, widget_inserted
 */

export const SLIDE_DECK_EVENTS = {
  // Deck lifecycle
  DECK_LIST_VIEWED: 'deck_list_viewed',
  DECK_CREATED: 'deck_created',
  DECK_OPENED: 'deck_opened',
  DECK_DELETED: 'deck_deleted',
  DECK_SEARCHED: 'deck_searched',
  CREATE_DECK_CLICKED: 'create_deck_clicked',
  DELETE_FAILED: 'delete_failed',

  // Template usage
  TEMPLATE_GALLERY_OPENED: 'template_gallery_opened',
  TEMPLATE_SELECTED: 'template_selected',
  TEMPLATE_PREVIEWED: 'template_previewed',
  BLANK_DECK_CREATED: 'blank_deck_created',

  // Content editing
  SLIDE_ADDED: 'slide_added',
  SLIDE_DELETED: 'slide_deleted',
  SLIDE_REORDERED: 'slide_reordered',
  TEXT_EDITED: 'text_edited',
  LAYOUT_CHANGED: 'layout_changed',

  // Widget operations
  WIDGET_INSERT_INITIATED: 'widget_insert_initiated',
  WIDGET_INSERTED: 'widget_inserted',
  WIDGET_CONFIGURED: 'widget_configured',
  WIDGET_DELETED: 'widget_deleted',
  DATA_SOURCE_CHANGED: 'data_source_changed',
  DATA_PILL_CLICKED: 'data_pill_clicked',
  DATA_PILL_DELETED: 'data_pill_deleted',

  // Data source picker
  DATA_SOURCE_PICKER_OPENED: 'data_source_picker_opened',
  DATA_SOURCE_SELECTED: 'data_source_selected',
  DATA_SOURCE_CONFIGURED: 'data_source_configured',
  CHART_TYPE_CHANGED: 'chart_type_changed',
  METRIC_FUNCTION_CHANGED: 'metric_function_changed',

  // Visual positioning
  ELEMENT_DRAGGED: 'element_dragged',
  ELEMENT_RESIZED: 'element_resized',
  ALIGNMENT_GUIDE_USED: 'alignment_guide_used',
  ALIGNMENT_GUIDE_SHOWN: 'alignment_guide_shown',
  ALIGNMENT_SNAPPED: 'alignment_snapped',
  RESIZE_STARTED: 'resize_started',
  RESIZE_COMPLETED: 'resize_completed',
  ASPECT_RATIO_LOCKED: 'aspect_ratio_locked',
  PROPERTY_CHANGED: 'property_changed',
  POSITION_UPDATED: 'position_updated',
  SIZE_UPDATED: 'size_updated',

  // Quick insert menu
  QUICK_INSERT_OPENED: 'quick_insert_opened',

  // Presentation
  PRESENTER_MODE_STARTED: 'presenter_mode_started',
  PRESENTER_MODE_EXITED: 'presenter_mode_exited',
  SLIDE_NAVIGATED: 'slide_navigated',
  WIDGET_INTERACTED: 'widget_interacted',
  WIDGET_RENDERED: 'widget_rendered',
  WIDGET_DATA_FETCHED: 'widget_data_fetched',
  WIDGET_LOAD_FAILED: 'widget_load_failed',
  CHART_RENDERED: 'chart_rendered',
  CHART_INTERACTED: 'chart_interacted',
  DRILL_DOWN_OPENED: 'drill_down_opened',
  TABLE_RENDERED: 'table_rendered',
  TABLE_FILTERED: 'table_filtered',
  TABLE_SORTED: 'table_sorted',
  METRIC_RENDERED: 'metric_rendered',
  METRIC_VALUE_UPDATED: 'metric_value_updated',
  FORMULA_CHANGED: 'formula_changed',
  TOOLBAR_ACTION_CLICKED: 'toolbar_action_clicked',
  JUMP_TO_SLIDE: 'jump_to_slide',
  EXIT_CLICKED: 'exit_clicked',

  // Collaboration
  DECK_SHARED: 'deck_shared',
  PERMISSION_CHANGED: 'permission_changed',
  USER_ADDED: 'user_added',
  COMMENT_ADDED: 'comment_added',
  COMMENT_RESOLVED: 'comment_resolved',
  MENTION_SENT: 'mention_sent',
  VERSION_HISTORY_VIEWED: 'version_history_viewed',
  VERSION_RESTORED: 'version_restored',

  // Theme & styling
  THEME_APPLIED: 'theme_applied',
  THEME_CUSTOMIZED: 'theme_customized',

  // Export (P1)
  EXPORT_STARTED: 'export_started',
  EXPORT_COMPLETED: 'export_completed',
  EXPORT_FAILED: 'export_failed',

  // Auto-save
  AUTOSAVE_TRIGGERED: 'autosave_triggered',
  AUTOSAVE_COMPLETED: 'autosave_completed',
  AUTOSAVE_FAILED: 'autosave_failed',

  // Mobile
  TAB_SWITCHED: 'tab_switched',
  SWIPE_DETECTED: 'swipe_detected',

  // Component palette
  COMPONENT_DRAGGED: 'component_dragged',
  COMPONENT_DROPPED: 'component_dropped',

  // Drag-drop
  DRAG_STARTED: 'drag_started',
  DRAG_ENDED: 'drag_ended',
  COLLISION_DETECTED: 'collision_detected',

  // Errors
  SAVE_FAILED: 'save_failed',
  PERMISSION_DENIED: 'permission_denied'
};

/**
 * Track a telemetry event
 *
 * @param {string} eventName - Event name from SLIDE_DECK_EVENTS
 * @param {Object} properties - Event properties (optional)
 * @returns {void}
 */
export function trackEvent(eventName, properties = {}) {
  // In production, this would send to analytics service
  // For now, we'll use console.log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry]', eventName, properties);
  }

  // Future: Send to analytics service
  // window.analytics?.track(eventName, {
  //   ...properties,
  //   feature: 'slide-decks',
  //   timestamp: new Date().toISOString(),
  //   sessionId: getSessionId(),
  //   userId: getCurrentUserId()
  // });
}

/**
 * Track a page view
 *
 * @param {string} pageName - Page name
 * @param {Object} properties - Page properties (optional)
 * @returns {void}
 */
export function trackPageView(pageName, properties = {}) {
  trackEvent('page_viewed', {
    pageName,
    ...properties
  });
}

/**
 * Track an error
 *
 * @param {string} errorType - Error type
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Additional context
 * @returns {void}
 */
export function trackError(errorType, error, context = {}) {
  trackEvent('error_occurred', {
    errorType,
    errorMessage: error?.message || String(error),
    errorStack: error?.stack,
    ...context
  });
}

/**
 * Track user timing (performance metrics)
 *
 * @param {string} metricName - Metric name
 * @param {number} duration - Duration in milliseconds
 * @param {Object} properties - Additional properties
 * @returns {void}
 */
export function trackTiming(metricName, duration, properties = {}) {
  trackEvent('timing_measured', {
    metricName,
    duration,
    ...properties
  });
}
