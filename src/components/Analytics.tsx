import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const Analytics = () => {
  useEffect(() => {
    const sessionId = uuidv4();

    // Track page view
    const trackPageView = async () => {
      try {
        await (supabase.from as any)("analytics").insert([
          {
            session_id: sessionId,
            event_type: "page_view",
            page_path: window.location.pathname,
            user_agent: navigator.userAgent,
            metadata: {
              referrer: document.referrer,
              timestamp: new Date().toISOString(),
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
              },
            },
          },
        ]);
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    };

    trackPageView();

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        (supabase.from as any)("analytics").insert([
          {
            session_id: sessionId,
            event_type: "scroll_depth",
            page_path: window.location.pathname,
            metadata: { depth: scrollPercent },
          },
        ]);
      }
    };

    window.addEventListener("scroll", trackScrollDepth);

    // Track time on page with sendBeacon
    const startTime = Date.now();
    const trackTimeOnPage = async () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 30) {
        try {
          await (supabase.from as any)("analytics").insert([
            {
              session_id: sessionId,
              event_type: "time_on_page",
              page_path: window.location.pathname,
              metadata: { seconds: timeSpent },
            },
          ]);
        } catch (error) {
          console.error("Time tracking error:", error);
        }
      }
    };

    window.addEventListener("beforeunload", trackTimeOnPage);

    return () => {
      window.removeEventListener("scroll", trackScrollDepth);
      window.removeEventListener("beforeunload", trackTimeOnPage);
    };
  }, []);

  return null;
};

export default Analytics;
