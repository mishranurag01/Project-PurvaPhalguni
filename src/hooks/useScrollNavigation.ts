import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for smooth scrolling to sections and tracking the currently visible section in the viewport
 */
export function useScrollNavigation(sectionIds: string[], offset = 140) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }

      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  const scrollToSection = useCallback((sectionId: string, smooth = true) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  }, []);

  const scrollToTop = useCallback((smooth = true) => {
    setActiveSection('');
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  return {
    activeSection,
    scrollToSection,
    scrollToTop
  };
}
