/**
 * useDiscussions Hook
 * Manages discussion threads and Help5 integration
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing discussion threads
 * @param {Array} threads - Discussion threads
 * @param {Array} help5Records - Help5 records
 * @returns {Object} Discussion state and methods
 */
export function useDiscussions(initialThreads = [], help5Records = []) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(null);

  /**
   * Get Help5 context for an element
   */
  const getHelp5Context = useCallback((elementId) => {
    return help5Records.find(h5 => h5.parent_id === elementId) || null;
  }, [help5Records]);

  /**
   * Create a new thread
   */
  const createThread = useCallback((elementId, elementName, initialMessage, userId, userName) => {
    const newThread = {
      id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      elementId,
      elementName,
      status: 'open',
      messages: [
        {
          id: `msg_${Date.now()}`,
          userId,
          userName,
          content: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    return newThread;
  }, []);

  /**
   * Add message to thread
   */
  const addMessage = useCallback((threadId, content, userId, userName) => {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content,
      timestamp: new Date().toISOString()
    };

    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, message],
              updatedAt: new Date().toISOString()
            }
          : thread
      )
    );

    return message;
  }, []);

  /**
   * Resolve thread and optionally update Help5
   */
  const resolveThread = useCallback((threadId, help5Update = null) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              status: 'resolved',
              help5Update,
              resolvedAt: new Date().toISOString()
            }
          : thread
      )
    );
  }, []);

  /**
   * Reopen a resolved thread
   */
  const reopenThread = useCallback((threadId) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              status: 'open',
              resolvedAt: null
            }
          : thread
      )
    );
  }, []);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback((threadId, messageId) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              messages: thread.messages.filter(msg => msg.id !== messageId),
              updatedAt: new Date().toISOString()
            }
          : thread
      )
    );
  }, []);

  /**
   * Edit a message
   */
  const editMessage = useCallback((threadId, messageId, newContent) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              messages: thread.messages.map(msg =>
                msg.id === messageId
                  ? { ...msg, content: newContent, edited: true, editedAt: new Date().toISOString() }
                  : msg
              ),
              updatedAt: new Date().toISOString()
            }
          : thread
      )
    );
  }, []);

  /**
   * Generate Help5 suggestion from discussion
   */
  const generateHelp5Suggestion = useCallback((threadId) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return null;

    // Simple heuristic: extract key points from messages
    const allContent = thread.messages.map(m => m.content).join(' ');

    // This is a placeholder - in production, this would use NLP/AI
    return {
      why: allContent.length > 100
        ? allContent.substring(0, 200) + '...'
        : allContent,
      confidence: 'medium'
    };
  }, [threads]);

  // Get active thread
  const activeThread = useMemo(() =>
    threads.find(t => t.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  // Get Help5 context for active thread
  const activeThreadHelp5 = useMemo(() =>
    activeThread ? getHelp5Context(activeThread.elementId) : null,
    [activeThread, getHelp5Context]
  );

  // Statistics
  const stats = useMemo(() => ({
    total: threads.length,
    open: threads.filter(t => t.status === 'open').length,
    resolved: threads.filter(t => t.status === 'resolved').length,
    withHelp5Update: threads.filter(t => t.help5Update).length
  }), [threads]);

  return {
    // State
    threads,
    activeThreadId,
    activeThread,
    activeThreadHelp5,
    stats,

    // Actions
    createThread,
    addMessage,
    resolveThread,
    reopenThread,
    deleteMessage,
    editMessage,
    setActiveThreadId,
    getHelp5Context,
    generateHelp5Suggestion
  };
}

export default useDiscussions;
