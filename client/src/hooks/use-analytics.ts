import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window === 'undefined') return;
    
    console.log('[Analytics]', event);
    
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
    
    if (window.dataLayer) {
      window.dataLayer.push({
        event: event.action,
        eventCategory: event.category,
        eventLabel: event.label,
        eventValue: event.value,
      });
    }
  }, []);

  const trackWhatsAppClick = useCallback((source: string) => {
    trackEvent({
      action: 'whatsapp_click',
      category: 'engagement',
      label: source,
    });
  }, [trackEvent]);

  const trackFormSubmission = useCallback((category: string) => {
    trackEvent({
      action: 'form_submission',
      category: 'conversion',
      label: category,
    });
  }, [trackEvent]);

  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent({
      action: 'scroll',
      category: 'engagement',
      label: `${depth}%`,
      value: depth,
    });
  }, [trackEvent]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const scrollDepths = [25, 50, 75, 100];
    const reachedDepths = new Set<number>();

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = Math.round(
          ((scrollTop + windowHeight) / documentHeight) * 100
        );

        scrollDepths.forEach((depth) => {
          if (scrollPercent >= depth && !reachedDepths.has(depth)) {
            reachedDepths.add(depth);
            trackScrollDepth(depth);
          }
        });
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackScrollDepth]);

  return {
    trackEvent,
    trackWhatsAppClick,
    trackFormSubmission,
    trackScrollDepth,
  };
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
