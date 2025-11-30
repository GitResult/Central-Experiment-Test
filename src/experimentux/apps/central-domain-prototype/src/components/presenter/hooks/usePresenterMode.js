/**
 * usePresenterMode Hook
 * Manages presenter mode state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useMarkdownParser } from './useMarkdownParser';

const DEFAULT_MARKDOWN = `---
theme: default
title: My Presentation
author: Your Name
date: ${new Date().toISOString().split('T')[0]}
---

# Welcome
My First Presentation

<!--
Speaker notes: Welcome everyone to the presentation
-->

---

## Agenda

- Introduction
- Main Topics
- Q&A

<!--
Speaker notes: Cover the three main sections
-->

---

# Thank You
Questions?
`;

/**
 * Hook for managing presenter mode
 */
export function usePresenterMode() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presenterView, setPresenterView] = useState({
    enabled: false,
    showNotes: true,
    showTimer: true,
    showNextSlide: true
  });
  const [controls, setControls] = useState({
    laserPointer: false,
    drawing: false,
    blackout: false
  });

  // Parse markdown into slides
  const { frontmatter, slides, totalSlides } = useMarkdownParser(markdown);

  // Navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const firstSlide = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  const lastSlide = useCallback(() => {
    setCurrentSlide(totalSlides - 1);
  }, [totalSlides]);

  // Presentation mode
  const startPresenting = useCallback(() => {
    setIsPresenting(true);
    setCurrentSlide(0);
  }, []);

  const stopPresenting = useCallback(() => {
    setIsPresenting(false);
    setControls({
      laserPointer: false,
      drawing: false,
      blackout: false
    });
  }, []);

  // Presenter view
  const togglePresenterView = useCallback(() => {
    setPresenterView(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const updatePresenterView = useCallback((updates) => {
    setPresenterView(prev => ({ ...prev, ...updates }));
  }, []);

  // Controls
  const toggleLaserPointer = useCallback(() => {
    setControls(prev => ({ ...prev, laserPointer: !prev.laserPointer }));
  }, []);

  const toggleDrawing = useCallback(() => {
    setControls(prev => ({ ...prev, drawing: !prev.drawing }));
  }, []);

  const toggleBlackout = useCallback(() => {
    setControls(prev => ({ ...prev, blackout: !prev.blackout }));
  }, []);

  // Markdown editing
  const updateMarkdown = useCallback((newMarkdown) => {
    setMarkdown(newMarkdown);
  }, []);

  const resetMarkdown = useCallback(() => {
    setMarkdown(DEFAULT_MARKDOWN);
    setCurrentSlide(0);
  }, []);

  // Keyboard shortcuts (when presenting)
  useEffect(() => {
    if (!isPresenting) return;

    const handleKeyPress = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          if (e.shiftKey) {
            previousSlide();
          } else {
            nextSlide();
          }
          break;

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          previousSlide();
          break;

        case 'Home':
          e.preventDefault();
          firstSlide();
          break;

        case 'End':
          e.preventDefault();
          lastSlide();
          break;

        case 'b':
        case 'B':
          e.preventDefault();
          toggleBlackout();
          break;

        case 'l':
        case 'L':
          e.preventDefault();
          toggleLaserPointer();
          break;

        case 'd':
        case 'D':
          e.preventDefault();
          toggleDrawing();
          break;

        case 'Escape':
          e.preventDefault();
          stopPresenting();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPresenting, nextSlide, previousSlide, firstSlide, lastSlide, toggleBlackout, toggleLaserPointer, toggleDrawing, stopPresenting]);

  // Get current slide data
  const currentSlideData = slides[currentSlide] || null;
  const nextSlideData = slides[currentSlide + 1] || null;
  const previousSlideData = slides[currentSlide - 1] || null;

  return {
    // Markdown
    markdown,
    updateMarkdown,
    resetMarkdown,

    // Parsed data
    frontmatter,
    slides,
    totalSlides,

    // Current slide
    currentSlide,
    currentSlideData,
    nextSlideData,
    previousSlideData,

    // Navigation
    nextSlide,
    previousSlide,
    goToSlide,
    firstSlide,
    lastSlide,

    // Presentation mode
    isPresenting,
    startPresenting,
    stopPresenting,

    // Presenter view
    presenterView,
    togglePresenterView,
    updatePresenterView,

    // Controls
    controls,
    toggleLaserPointer,
    toggleDrawing,
    toggleBlackout
  };
}

export default usePresenterMode;
