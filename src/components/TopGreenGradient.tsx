import React from 'react';

export function TopGreenGradient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-[210px] z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/30 via-transparent to-transparent dark:from-emerald-900/20 dark:via-transparent dark:to-transparent" />
      <div className="absolute -top-28 right-[-10%] w-72 h-52 rounded-full bg-[#2EE068]/14 dark:bg-[#1D956E]/16 blur-3xl" />
      <div className="absolute -top-32 left-[-10%] w-64 h-48 rounded-full bg-emerald-300/16 dark:bg-emerald-800/14 blur-3xl" />
    </div>
  );
}
