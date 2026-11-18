import React from 'react';

interface IconProps {
  className?: string;
}

export function WhatsAppBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.09c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.93-4.37-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.58.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.69-.17 1.37z" />
    </svg>
  );
}

export function InstagramBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-brand-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="70%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-brand-grad)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.8" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="3.1" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="16.2" cy="7.8" r="1" fill="#FFFFFF" />
    </svg>
  );
}

export function SpotifyBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path
        d="M7.3 9.7c3.1-.9 6.8-.7 9.6.8"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.1 12.6c2.6-.7 5.6-.5 7.9.7"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8.9 15.3c2-.5 4.2-.4 6 .6"
        stroke="#FFFFFF"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TikTokBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14.7 3h2.7c.2 1.8 1.3 3.2 3.1 3.6v2.7c-1.2 0-2.3-.4-3.2-1v6.2c0 3.2-2.5 5.6-5.7 5.6-3.1 0-5.6-2.5-5.6-5.6 0-3.1 2.4-5.5 5.5-5.6v2.8c-1.5.1-2.7 1.3-2.7 2.8 0 1.6 1.2 2.8 2.8 2.8 1.6 0 2.9-1.2 2.9-3V3z"
        fill="#25F4EE"
        transform="translate(-0.7, -0.5)"
      />
      <path
        d="M14.7 3h2.7c.2 1.8 1.3 3.2 3.1 3.6v2.7c-1.2 0-2.3-.4-3.2-1v6.2c0 3.2-2.5 5.6-5.7 5.6-3.1 0-5.6-2.5-5.6-5.6 0-3.1 2.4-5.5 5.5-5.6v2.8c-1.5.1-2.7 1.3-2.7 2.8 0 1.6 1.2 2.8 2.8 2.8 1.6 0 2.9-1.2 2.9-3V3z"
        fill="#FE2C55"
        transform="translate(0.7, 0.5)"
      />
      <path
        d="M14.7 3h2.7c.2 1.8 1.3 3.2 3.1 3.6v2.7c-1.2 0-2.3-.4-3.2-1v6.2c0 3.2-2.5 5.6-5.7 5.6-3.1 0-5.6-2.5-5.6-5.6 0-3.1 2.4-5.5 5.5-5.6v2.8c-1.5.1-2.7 1.3-2.7 2.8 0 1.6 1.2 2.8 2.8 2.8 1.6 0 2.9-1.2 2.9-3V3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YouTubeBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8z"
        fill="#FF0000"
      />
      <path d="M10 15.2V8.8l5.5 3.2-5.5 3.2z" fill="#FFFFFF" />
    </svg>
  );
}

export function LinkedInBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
      <circle cx="7.5" cy="7.6" r="1.3" fill="#FFFFFF" />
      <rect x="6.4" y="10.2" width="2.2" height="7.3" rx="0.4" fill="#FFFFFF" />
      <path
        d="M11.2 10.2h2.1v1c.5-.8 1.4-1.2 2.4-1.2 2.1 0 3 1.4 3 3.5v4h-2.2v-3.6c0-1.1-.4-1.8-1.4-1.8-1 0-1.7.7-1.7 1.8v3.6h-2.2v-7.3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function FacebookBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M13.5 21.9V13.8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6v3.1h2.7v8.1a10.2 10.2 0 0 0 3.2 0z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function XBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

export function TelegramBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#26A5E4" />
      <path
        d="M17.2 7.6 15 17.3c-.2.8-.6 1-1.3.6l-3.5-2.6-1.7 1.6c-.2.2-.3.3-.7.3l.3-3.6 6.5-5.9c.3-.2-.1-.4-.4-.2l-8 5-3.4-1.1c-.7-.2-.7-.7.2-1.1l13.3-5.1c.6-.2 1.1.1.9 1.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function SnapchatBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#FFFC00" />
      <path
        d="M12 5.7c2.4 0 3.7 1.6 3.7 3.8v1.1c.4 0 .8-.2 1.1-.1.3.1.5.4.3.7-.2.3-.7.5-1.1.7-.2.1-.2.3-.1.5.5 1.1 1.4 1.9 2.5 2.2.3.1.4.4.2.7-.3.4-1.1.6-1.8.8-.2 0-.3.2-.3.4 0 .3-.2.6-.6.6-.4 0-.9-.2-1.4-.2-.7 0-1.3.7-2.5.7s-1.8-.7-2.5-.7c-.5 0-1 .2-1.4.2-.4 0-.6-.3-.6-.6 0-.2-.1-.4-.3-.4-.7-.2-1.5-.4-1.8-.8-.2-.3-.1-.6.2-.7 1.1-.3 2-1.1 2.5-2.2.1-.2.1-.4-.1-.5-.4-.2-.9-.4-1.1-.7-.2-.3 0-.6.3-.7.3-.1.7.1 1.1.1V9.5c0-2.2 1.3-3.8 3.7-3.8z"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThreadsBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.1 11.2c-.1-.1-.3-.2-.4-.2-.2-2.6-1.6-4.1-4.1-4.1-1.5 0-2.7.6-3.4 1.7l1.5 1c.5-.8 1.2-1.1 1.9-1.1 1.2 0 1.9.6 2.1 1.8-.8-.2-1.7-.2-2.6-.1-2.2.2-3.6 1.4-3.5 3.2.1 1.7 1.5 2.9 3.4 2.8 1.4-.1 2.5-.7 3.1-1.7.4-.7.6-1.5.7-2.4.8.4 1.3 1.1 1.3 2 0 1.8-1.5 3.1-3.9 3.1-2.7 0-4.7-1.9-4.7-5.2s2-5.2 4.7-5.2c1.8 0 3.2.7 4 1.9l1.5-1c-1.1-1.6-3-2.6-5.5-2.6-3.9 0-6.6 2.7-6.6 6.9s2.7 6.9 6.6 6.9c3.5 0 5.7-2 5.7-4.8 0-1.6-.8-2.9-2.2-3.8zm-4.5 3.7c-1 .1-1.7-.4-1.7-1.2 0-.8.7-1.3 1.9-1.4.7-.1 1.3 0 1.9.2-.1 1.5-.9 2.3-2.1 2.4z" />
    </svg>
  );
}

export function DiscordBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#5865F2" />
      <path
        d="M16.4 8.2a9.2 9.2 0 0 0-2.3-.7l-.3.6a8.6 8.6 0 0 0-3.6 0l-.3-.6a9.2 9.2 0 0 0-2.3.7C6.1 10.4 5.7 12.6 5.9 14.8a9.4 9.4 0 0 0 2.8 1.4l.6-.9c-.4-.1-.7-.3-1-.5l.2-.2c1.9.9 4.1.9 6 0l.2.2c-.3.2-.6.4-1 .5l.6.9a9.4 9.4 0 0 0 2.8-1.4c.3-2.5-.4-4.7-1.7-6.6zM9.9 13.5c-.5 0-1-.5-1-1.1 0-.6.4-1.1 1-1.1s1 .5 1 1.1c0 .6-.4 1.1-1 1.1zm4.2 0c-.5 0-1-.5-1-1.1 0-.6.4-1.1 1-1.1s1 .5 1 1.1c0 .6-.4 1.1-1 1.1z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function PinterestBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#E60023" />
      <path
        d="M12.2 6.3c-3.1 0-4.9 2.1-4.9 4.2 0 1 .5 2 1.4 2.4.1.1.3 0 .3-.2l.2-.8c0-.1 0-.2-.1-.3-.3-.3-.4-.8-.4-1.3 0-1.5 1.1-2.8 3-2.8 1.7 0 2.6 1 2.6 2.4 0 1.8-.8 3.2-2 3.2-.7 0-1.2-.5-1-1.2.2-.8.6-1.7.6-2.3 0-.5-.3-1-.9-1-.7 0-1.3.7-1.3 1.7 0 .6.2 1 .2 1l-.9 3.6c-.2.9 0 2 .1 2.1 0 .1.1.1.2 0 .1-.1 1-1.2 1.3-2.3l.4-1.5c.3.5 1 .9 1.8.9 2.4 0 4-2.2 4-5.1 0-2.4-2-4.7-4.6-4.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function RedditBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FF4500" />
      <path
        d="M18.2 12c0-.8-.6-1.4-1.4-1.4-.4 0-.7.2-1 .4-1-.7-2.3-1.1-3.8-1.2l.7-3 2.1.5a1 1 0 1 0 .2-.8l-2.5-.6c-.2 0-.4.1-.5.3l-.8 3.5c-1.5.1-2.9.5-3.9 1.2-.3-.2-.6-.4-1-.4-.8 0-1.4.6-1.4 1.4 0 .6.3 1.1.8 1.3v.4c0 2.3 2.6 4.1 5.9 4.1s5.9-1.8 5.9-4.1v-.4c.5-.2.8-.7.8-1.2zm-8.5.7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4.8 2.4c-.6.6-1.7.7-2.5.7s-1.9-.1-2.5-.7a.4.4 0 0 1 .6-.6c.4.4 1.2.5 1.9.5s1.5-.1 1.9-.5a.4.4 0 1 1 .6.6zm-.2-2.4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TwitchBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4.5 3 3 6.6v12.9h4.6V22l2.6-2.5h3.9l5.9-5.9V3H4.5z" fill="#9146FF" />
      <path d="M18.3 12.8l-2.9 2.9h-3.9l-2.4 2.4v-2.4H6.2V4.7h12.1v8.1z" fill="#FFFFFF" />
      <rect x="14" y="7.5" width="1.6" height="4.4" fill="#9146FF" />
      <rect x="10.2" y="7.5" width="1.6" height="4.4" fill="#9146FF" />
    </svg>
  );
}

export function AudiomackBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#FFA200" />
      <path
        d="M5 14.5h1.5v-3H8v5h1.5V9H11v8h1.5V7H14v10h1.5v-5.5H17v3h2"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppleMusicBrandIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="apple-music-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FA57C1" />
          <stop offset="100%" stopColor="#FA233B" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#apple-music-grad)" />
      <path
        d="M16.2 6.8v7.6a2.1 2.1 0 1 1-1.5-2V9.3l-5 1.1v5.1a2.1 2.1 0 1 1-1.5-2V8.5c0-.5.3-.9.8-1l6.2-1.4c.5-.1 1 .2 1 .7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
