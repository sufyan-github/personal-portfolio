import React from "react";

/**
 * Lightweight, GPU-accelerated, professional background.
 * - Pure CSS (no rAF, no canvas, no listeners) -> zero JS overhead
 * - Subtle aurora orbs + faint grid + radial vignette
 * - Honors prefers-reduced-motion
 */
const ProfessionalBackground: React.FC = () => {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden -z-0"
    >
      {/* Base radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.12),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--accent)/0.08),_transparent_60%)]" />

      {/* Faint professional grid */}
      <div
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />

      {/* Soft aurora orbs (CSS animated, reduced-motion aware) */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
    </div>
  );
};

export default ProfessionalBackground;
