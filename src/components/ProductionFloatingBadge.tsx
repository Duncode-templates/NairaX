import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';

interface ProductionFloatingBadgeProps {
  hasBottomDock: boolean;
}

export function ProductionFloatingBadge({
  hasBottomDock,
}: ProductionFloatingBadgeProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-3 right-3 z-30 pointer-events-none transition-[bottom] duration-200 ${
        hasBottomDock ? 'bottom-[78px]' : 'bottom-4'
      }`}
    >
      <div className="max-w-xl mx-auto flex justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.button
              key="prod-badge-collapsed"
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Show production status: Currently in production"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="pointer-events-auto relative h-8 px-3 rounded-full bg-gradient-to-b from-white/85 via-white/70 to-white/55 dark:from-slate-900/85 dark:via-slate-900/70 dark:to-slate-900/60 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/85 dark:border-white/15 shadow-[0_10px_28px_rgba(15,23,42,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.95)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.16)] inline-flex items-center gap-1.5 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1D956E]"
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D956E] opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D956E]" />
              </span>
              <ChevronRight
                className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300"
                aria-hidden="true"
              />
            </motion.button>
          ) : (
            <motion.div
              key="prod-badge-expanded"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="pointer-events-auto relative h-9 pl-3.5 pr-1.5 rounded-full bg-gradient-to-b from-white/85 via-white/70 to-white/55 dark:from-slate-900/85 dark:via-slate-900/70 dark:to-slate-900/60 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/85 dark:border-white/15 shadow-[0_10px_28px_rgba(15,23,42,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.95)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.16)] inline-flex items-center gap-2 overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/95 dark:via-white/30 to-transparent"
              />
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D956E] opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D956E]" />
              </span>
              <span className="text-xs font-semibold tracking-[-0.01em] text-slate-800 dark:text-slate-100 whitespace-nowrap select-none">
                Currently in production
              </span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Minimize production status badge"
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/8 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#1D956E]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
