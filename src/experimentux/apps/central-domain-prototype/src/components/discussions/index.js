/**
 * Discussions Module
 * Thread-based discussions with Help5 integration
 */

// Main Components
export { DiscussionPanel } from './DiscussionPanel';
export { DiscussionThread } from './DiscussionThread';
export { DiscussionMessage } from './DiscussionMessage';
export { ResolutionActions } from './ResolutionActions';
export { Help5ContextCard } from './Help5ContextCard';

// Hooks
export { useDiscussions } from './hooks/useDiscussions';

// Default exports
export { default as DiscussionPanelDefault } from './DiscussionPanel';
export { default as DiscussionThreadDefault } from './DiscussionThread';
export { default as DiscussionMessageDefault } from './DiscussionMessage';
export { default as ResolutionActionsDefault } from './ResolutionActions';
export { default as Help5ContextCardDefault } from './Help5ContextCard';
export { default as useDiscussionsDefault } from './hooks/useDiscussions';
