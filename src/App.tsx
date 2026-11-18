import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  CloudSun,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileArchive,
  FileText,
  Flame,
  Gift,
  Globe,
  History,
  Home,
  Image as ImageIcon,
  ImagePlus,
  LogOut,
  Moon,
  Plus,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sun,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import {
  AppleMusicBrandIcon,
  AudiomackBrandIcon,
  DiscordBrandIcon,
  FacebookBrandIcon,
  InstagramBrandIcon,
  LinkedInBrandIcon,
  PinterestBrandIcon,
  RedditBrandIcon,
  SnapchatBrandIcon,
  SpotifyBrandIcon,
  TelegramBrandIcon,
  ThreadsBrandIcon,
  TikTokBrandIcon,
  TwitchBrandIcon,
  WhatsAppBrandIcon,
  XBrandIcon,
  YouTubeBrandIcon,
} from './components/PlatformIcons';
import { ProductionFloatingBadge } from './components/ProductionFloatingBadge';
import {
  DEFAULT_AMOUNT_SUMMARY,
  formatCompactNairaNumber,
  formatNaira,
  formatNairaNumber,
} from './data/amountData';

type BottomTab =
  | 'home'
  | 'tasks'
  | 'store'
  | 'referrals'
  | 'profile'
  | 'notifications'
  | 'settings'
  | 'set-name'
  | 'set-gender'
  | 'set-email'
  | 'set-password'
  | 'set-pin'
  | 'set-bank';

const SETTINGS_SUBPAGES: BottomTab[] = [
  'set-name',
  'set-gender',
  'set-email',
  'set-password',
  'set-pin',
  'set-bank',
];

const isFullScreenTab = (tab: BottomTab) =>
  tab === 'notifications' ||
  tab === 'settings' ||
  SETTINGS_SUBPAGES.includes(tab);

type TaskIconKey =
  | 'users'
  | 'bag'
  | 'wallet'
  | 'check'
  | 'share'
  | 'gift'
  | 'zap'
  | 'award';

type TaskIconValue =
  | { kind: 'preset'; key: TaskIconKey }
  | { kind: 'image'; src: string };

const TASK_ICON_OPTIONS: {
  key: TaskIconKey;
  label: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}[] = [
  { key: 'users', label: 'Referrals', Icon: Users },
  { key: 'bag', label: 'Store', Icon: ShoppingBag },
  { key: 'wallet', label: 'Wallet', Icon: Wallet },
  { key: 'check', label: 'Check-in', Icon: CheckSquare },
  { key: 'share', label: 'Share', Icon: Share2 },
  { key: 'gift', label: 'Bonus', Icon: Gift },
  { key: 'zap', label: 'Fast', Icon: Zap },
  { key: 'award', label: 'Reward', Icon: Award },
];

function TaskIconPreview({
  icon,
  alt,
}: {
  icon?: TaskIconValue;
  alt: string;
}) {
  if (!icon) {
    return <ImagePlus className="w-[18px] h-[18px]" aria-hidden={true} />;
  }
  if (icon.kind === 'image') {
    return (
      <img
        src={icon.src}
        alt={alt}
        className="w-full h-full object-cover rounded-2xl"
      />
    );
  }
  const match = TASK_ICON_OPTIONS.find((item) => item.key === icon.key);
  const IconComp = match ? match.Icon : CheckSquare;
  return <IconComp className="w-5 h-5" aria-hidden={true} />;
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.09c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.13.1-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.93-4.37-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.58.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.69-.17 1.37z" />
    </svg>
  );
}

function NairaAmount({
  amount,
  compact = false,
  symbolClassName = 'text-[0.68em] mr-0.5 opacity-80',
}: {
  amount: number;
  compact?: boolean;
  symbolClassName?: string;
}) {
  return (
    <span className="inline-flex items-baseline">
      <span className={`font-bold select-none leading-none ${symbolClassName}`}>
        ₦
      </span>
      <span>
        {compact ? formatCompactNairaNumber(amount) : formatNairaNumber(amount)}
      </span>
    </span>
  );
}

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  category: 'approved' | 'rejected' | 'settlement' | 'wallet' | 'streak' | 'task';
}

interface TaskItem {
  id: string;
  title: string;
  rewardUsd: number;
  done: boolean;
}

interface StoreItem {
  id: string;
  name: string;
  category: string;
  priceUsd: number;
}

interface WalletHistoryItem {
  id: string;
  type: 'add' | 'withdraw';
  label: string;
  amountUsd: number;
  date: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Task Approved',
    detail:
      "Your submission for 'Join a group on WhatsApp' has been approved. ₦500 has been credited to your wallet.",
    time: 'Today, 2:37pm',
    read: false,
    category: 'approved',
  },
  {
    id: 'n-2',
    title: 'Task Approved',
    detail:
      "Your submission for 'List an item on the marketplace' has been approved. ₦1,500 has been credited to your wallet.",
    time: 'Today, 2:35pm',
    read: false,
    category: 'approved',
  },
  {
    id: 'n-3',
    title: 'Task Approved',
    detail:
      "Your submission for 'Comment and Like this Instagram post' has been approved. ₦600 has been credited to your wallet.",
    time: 'Today, 2:28pm',
    read: true,
    category: 'approved',
  },
  {
    id: 'n-4',
    title: 'Task Rejected',
    detail:
      "Your submission for 'Download App' was not approved. Reason: Screenshot does not show the task being performed.",
    time: 'Today, 2:04pm',
    read: true,
    category: 'rejected',
  },
  {
    id: 'n-5',
    title: 'Task Approved',
    detail:
      "Your submission for 'Like 3 recent posts on X' has been approved. ₦550 has been credited to your wallet.",
    time: 'Today, 1:59pm',
    read: true,
    category: 'approved',
  },
];

interface HotTaskItem {
  id: string;
  title: string;
  rewardNgn: number;
  eta: string;
  action: 'referrals' | 'store' | 'add' | 'tasks';
}

const INITIAL_TASKS: TaskItem[] = [
  { id: 't-1', title: 'Confirm payout account details', rewardUsd: 25, done: true },
  { id: 't-2', title: 'Share referral link with 3 contacts', rewardUsd: 50, done: false },
  { id: 't-3', title: 'Publish first Digital Store item', rewardUsd: 100, done: false },
];

const HOT_TASKS: HotTaskItem[] = [
  {
    id: 'ht-1',
    title: 'Invite 3 contacts to NairaX',
    rewardNgn: 2500,
    eta: '2 min',
    action: 'referrals',
  },
  {
    id: 'ht-2',
    title: 'Publish a Digital Store item',
    rewardNgn: 5000,
    eta: '5 min',
    action: 'store',
  },
  {
    id: 'ht-3',
    title: 'Fund wallet with ₦1,000+',
    rewardNgn: 1000,
    eta: '1 min',
    action: 'add',
  },
  {
    id: 'ht-4',
    title: 'Complete daily check-in task',
    rewardNgn: 750,
    eta: '1 min',
    action: 'tasks',
  },
  {
    id: 'ht-5',
    title: 'Share your referral link today',
    rewardNgn: 3000,
    eta: '3 min',
    action: 'referrals',
  },
];

const STORE_ITEMS: StoreItem[] = [
  { id: 's-1', name: 'Starter Finance Template', category: 'Template', priceUsd: 29 },
  { id: 's-2', name: 'Creator Payout Guide', category: 'Guide', priceUsd: 19 },
  { id: 's-3', name: 'Pro Automation Bundle', category: 'Bundle', priceUsd: 79 },
];

const INITIAL_WALLET_HISTORY: WalletHistoryItem[] = [
  { id: 'h-1', type: 'add', label: 'ACH Deposit', amountUsd: 14820.5, date: 'Nov 16, 2026' },
  { id: 'h-2', type: 'withdraw', label: 'Bank Withdrawal', amountUsd: 4200.0, date: 'Nov 14, 2026' },
  { id: 'h-3', type: 'add', label: 'Store Settlement', amountUsd: 8950.0, date: 'Nov 11, 2026' },
];

const USER_NAME = 'Elena';

type DayPeriod = 'morning' | 'afternoon' | 'evening';

const GREETING_CONFIG: Record<
  DayPeriod,
  { text: string; stickerSrc: string; stickerAlt: string }
> = {
  morning: {
    text: 'Good morning',
    stickerSrc: '/src/assets/images/sticker_greeting_morning_1794912930619.jpg',
    stickerAlt: 'Morning sun sticker',
  },
  afternoon: {
    text: 'Good afternoon',
    stickerSrc:
      '/src/assets/images/sticker_greeting_afternoon_1794912930711.jpg',
    stickerAlt: 'Afternoon sun sticker',
  },
  evening: {
    text: 'Good evening',
    stickerSrc: '/src/assets/images/sticker_greeting_evening_1794912930700.jpg',
    stickerAlt: 'Evening moon sticker',
  },
};

function getDayPeriod(hour: number): DayPeriod {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

interface PostTaskOption {
  id: string;
  label: string;
  defaultTitle: string;
  subtitle: string;
  defaultRewardNgn: number;
  iconKey: TaskIconKey;
  badgeClass: string;
  target?: 'task' | 'store';
  storeCategory?: string;
  renderIcon: () => React.ReactNode;
}

interface PostTaskCategory {
  id: string;
  title: string;
  items: PostTaskOption[];
}

const POST_TASK_CATEGORIES: PostTaskCategory[] = [
  {
    id: 'social',
    title: 'Social Platforms',
    items: [
      {
        id: 'whatsapp',
        label: 'Post a WhatsApp task',
        defaultTitle: 'WhatsApp status or channel engagement',
        subtitle: 'Status views, channel join, or group share',
        defaultRewardNgn: 500,
        iconKey: 'share',
        badgeClass: 'bg-transparent',
        renderIcon: () => <WhatsAppBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'instagram',
        label: 'Post an Instagram task',
        defaultTitle: 'Instagram follow, reel like, or story share',
        subtitle: 'Follow, reel engagement, or story mention',
        defaultRewardNgn: 600,
        iconKey: 'share',
        badgeClass: 'bg-transparent',
        renderIcon: () => <InstagramBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'spotify',
        label: 'Post a Spotify task',
        defaultTitle: 'Spotify track stream or playlist follow',
        subtitle: 'Stream track, save album, or follow artist',
        defaultRewardNgn: 750,
        iconKey: 'zap',
        badgeClass: 'bg-transparent',
        renderIcon: () => <SpotifyBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'tiktok',
        label: 'Post a TikTok task',
        defaultTitle: 'TikTok video watch, like, or repost',
        subtitle: 'Follow creator, like video, or duet clip',
        defaultRewardNgn: 650,
        iconKey: 'zap',
        badgeClass: 'bg-transparent text-slate-900 dark:text-white',
        renderIcon: () => <TikTokBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'youtube',
        label: 'Post a YouTube task',
        defaultTitle: 'YouTube subscribe, watch, or comment',
        subtitle: 'Channel subscribe, watch time, or comment',
        defaultRewardNgn: 800,
        iconKey: 'award',
        badgeClass: 'bg-transparent',
        renderIcon: () => <YouTubeBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'linkedin',
        label: 'Post a LinkedIn task',
        defaultTitle: 'LinkedIn post engagement or page follow',
        subtitle: 'Company page follow or post reaction',
        defaultRewardNgn: 700,
        iconKey: 'users',
        badgeClass: 'bg-transparent',
        renderIcon: () => <LinkedInBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'facebook',
        label: 'Post a Facebook task',
        defaultTitle: 'Facebook page like or post share',
        subtitle: 'Page follow, group join, or post share',
        defaultRewardNgn: 500,
        iconKey: 'users',
        badgeClass: 'bg-transparent',
        renderIcon: () => <FacebookBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'x-twitter',
        label: 'Post an X (Twitter) task',
        defaultTitle: 'X repost, follow, or thread engagement',
        subtitle: 'Follow handle, repost, or reply',
        defaultRewardNgn: 550,
        iconKey: 'share',
        badgeClass: 'bg-transparent text-slate-900 dark:text-slate-100',
        renderIcon: () => <XBrandIcon className="w-[18px] h-[18px]" />,
      },
      {
        id: 'telegram',
        label: 'Post a Telegram task',
        defaultTitle: 'Telegram channel or community join',
        subtitle: 'Join channel, group, or bot verify',
        defaultRewardNgn: 450,
        iconKey: 'share',
        badgeClass: 'bg-transparent',
        renderIcon: () => <TelegramBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'snapchat',
        label: 'Post a Snapchat task',
        defaultTitle: 'Snapchat profile subscribe or spotlight view',
        subtitle: 'Add friend, subscribe, or story view',
        defaultRewardNgn: 500,
        iconKey: 'gift',
        badgeClass: 'bg-transparent',
        renderIcon: () => <SnapchatBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'threads',
        label: 'Post a Threads task',
        defaultTitle: 'Threads profile follow or post reply',
        subtitle: 'Follow profile, like, or repost thread',
        defaultRewardNgn: 500,
        iconKey: 'share',
        badgeClass: 'bg-transparent text-slate-900 dark:text-slate-100',
        renderIcon: () => <ThreadsBrandIcon className="w-[20px] h-[20px]" />,
      },
      {
        id: 'discord',
        label: 'Post a Discord task',
        defaultTitle: 'Discord server join and verification',
        subtitle: 'Join server and complete role check',
        defaultRewardNgn: 600,
        iconKey: 'users',
        badgeClass: 'bg-transparent',
        renderIcon: () => <DiscordBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'pinterest',
        label: 'Post a Pinterest task',
        defaultTitle: 'Pinterest pin save or board follow',
        subtitle: 'Save pin or follow creator board',
        defaultRewardNgn: 450,
        iconKey: 'award',
        badgeClass: 'bg-transparent',
        renderIcon: () => <PinterestBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'reddit',
        label: 'Post a Reddit task',
        defaultTitle: 'Reddit community join or post upvote',
        subtitle: 'Join subreddit or engage with thread',
        defaultRewardNgn: 550,
        iconKey: 'users',
        badgeClass: 'bg-transparent',
        renderIcon: () => <RedditBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'twitch',
        label: 'Post a Twitch task',
        defaultTitle: 'Twitch channel follow or stream watch',
        subtitle: 'Follow streamer or watch live clip',
        defaultRewardNgn: 650,
        iconKey: 'zap',
        badgeClass: 'bg-transparent',
        renderIcon: () => <TwitchBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'audiomack',
        label: 'Post an Audiomack task',
        defaultTitle: 'Audiomack track stream or artist follow',
        subtitle: 'Stream song, favorite, or re-up track',
        defaultRewardNgn: 600,
        iconKey: 'zap',
        badgeClass: 'bg-transparent',
        renderIcon: () => <AudiomackBrandIcon className="w-[22px] h-[22px]" />,
      },
      {
        id: 'apple-music',
        label: 'Post an Apple Music task',
        defaultTitle: 'Apple Music playlist add or track stream',
        subtitle: 'Add to library or stream release',
        defaultRewardNgn: 700,
        iconKey: 'award',
        badgeClass: 'bg-transparent',
        renderIcon: () => <AppleMusicBrandIcon className="w-[22px] h-[22px]" />,
      },
    ],
  },
  {
    id: 'web-commerce',
    title: 'Web & Commerce',
    items: [
      {
        id: 'website-registration',
        label: 'Post a Website Registration task',
        defaultTitle: 'Register and verify account on partner site',
        subtitle: 'Sign up, confirm email, and submit proof',
        defaultRewardNgn: 1200,
        iconKey: 'check',
        badgeClass: 'bg-transparent text-[#1D956E] dark:text-[#34C194]',
        renderIcon: () => <Globe className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
      {
        id: 'purchase',
        label: 'Post a Purchase task',
        defaultTitle: 'Verified product or digital order task',
        subtitle: 'Complete checkout and upload order ID',
        defaultRewardNgn: 2500,
        iconKey: 'bag',
        badgeClass: 'bg-transparent text-amber-600 dark:text-amber-400',
        renderIcon: () => <ShoppingBag className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
    ],
  },
  {
    id: 'apps-feedback',
    title: 'Apps & Feedback',
    items: [
      {
        id: 'download-app',
        label: 'Post a Download App task',
        defaultTitle: 'Download, install, and open mobile app',
        subtitle: 'Install from store and complete onboarding',
        defaultRewardNgn: 1500,
        iconKey: 'wallet',
        badgeClass: 'bg-transparent text-blue-600 dark:text-blue-400',
        renderIcon: () => <Download className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
      {
        id: 'survey',
        label: 'Post a Survey task',
        defaultTitle: 'Complete short user feedback survey',
        subtitle: 'Answer questionnaire and submit review',
        defaultRewardNgn: 900,
        iconKey: 'check',
        badgeClass: 'bg-transparent text-violet-600 dark:text-violet-400',
        renderIcon: () => <ClipboardList className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
    ],
  },
  {
    id: 'progress',
    title: 'Progress & Tracking',
    items: [
      {
        id: 'track-progress',
        label: 'Post a Track a Progress task',
        defaultTitle: 'Milestone check-in and progress tracking',
        subtitle: 'Log daily milestones or campaign reach',
        defaultRewardNgn: 1000,
        iconKey: 'award',
        badgeClass: 'bg-transparent text-teal-600 dark:text-teal-400',
        renderIcon: () => <TrendingUp className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
    ],
  },
  {
    id: 'digital-store',
    title: 'Digital Store',
    items: [
      {
        id: 'sell-code',
        label: 'Sell a Code',
        defaultTitle: 'Reusable source code or script package',
        subtitle: 'Code',
        defaultRewardNgn: 2500,
        iconKey: 'zap',
        badgeClass: 'bg-transparent text-[#1D956E] dark:text-[#34C194]',
        target: 'store',
        storeCategory: 'Code',
        renderIcon: () => <Code2 className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
      {
        id: 'sell-zip',
        label: 'Sell a ZIP File',
        defaultTitle: 'Compressed ZIP resource archive',
        subtitle: 'ZIP File',
        defaultRewardNgn: 3000,
        iconKey: 'bag',
        badgeClass: 'bg-transparent text-amber-600 dark:text-amber-400',
        target: 'store',
        storeCategory: 'ZIP File',
        renderIcon: () => <FileArchive className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
      {
        id: 'sell-txt',
        label: 'Sell a .txt File',
        defaultTitle: 'Plain text guide, notes, or prompt pack',
        subtitle: '.txt File',
        defaultRewardNgn: 1000,
        iconKey: 'check',
        badgeClass: 'bg-transparent text-blue-600 dark:text-blue-400',
        target: 'store',
        storeCategory: '.txt File',
        renderIcon: () => <FileText className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
      {
        id: 'sell-picture',
        label: 'Sell a Picture',
        defaultTitle: 'High-resolution digital picture or artwork',
        subtitle: 'Picture',
        defaultRewardNgn: 1500,
        iconKey: 'award',
        badgeClass: 'bg-transparent text-rose-600 dark:text-rose-400',
        target: 'store',
        storeCategory: 'Picture',
        renderIcon: () => <ImageIcon className="w-[20px] h-[20px]" aria-hidden="true" />,
      },
    ],
  },
];

interface NigerianBankOption {
  name: string;
  code: string;
}

const INITIAL_NIGERIAN_BANKS: NigerianBankOption[] = [
  { name: 'Kuda Microfinance Bank', code: '50211' },
  { name: 'OPay Digital Services', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Moniepoint Microfinance Bank', code: '50515' },
  { name: 'Access Bank', code: '044' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Wema Bank', code: '035' },
];

const TAB_ORDER: Record<BottomTab, number> = {
  home: 0,
  tasks: 1,
  store: 2,
  referrals: 3,
  profile: 4,
  notifications: 5,
  settings: 6,
  'set-name': 7,
  'set-gender': 8,
  'set-bank': 9,
  'set-pin': 10,
  'set-password': 11,
  'set-email': 12,
};

const pageTransitionVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir * 24,
    scale: 0.985,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    transitionEnd: {
      transform: 'none',
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -18,
    scale: 0.99,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1] as const,
    },
  }),
};

function NotificationFilterCapsule({
  value,
  onChange,
}: {
  value: 'all' | 'unread';
  onChange: (next: 'all' | 'unread') => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<
    Partial<Record<'all' | 'unread', HTMLButtonElement | null>>
  >({});
  const [pill, setPill] = useState<{
    left: number;
    width: number;
    visible: boolean;
    animated: boolean;
  }>({ left: 0, width: 0, visible: false, animated: false });

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttonRefs.current[value];
      if (!el) return;
      const nextLeft = el.offsetLeft;
      const nextWidth = el.offsetWidth;
      setPill((prev) => ({
        left: nextLeft,
        width: nextWidth,
        visible: true,
        animated: prev.visible,
      }));
    };

    measure();
    const container = containerRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && container
        ? new ResizeObserver(() => measure())
        : null;
    if (ro && container) {
      ro.observe(container);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [value]);

  return (
    <div
      role="group"
      aria-label="Notification filter"
      className="relative inline-flex items-center h-12 px-1.5 rounded-full bg-gradient-to-b from-white/75 via-white/55 to-white/45 dark:from-slate-900/80 dark:via-slate-900/65 dark:to-slate-900/55 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/80 dark:border-white/15 shadow-[0_12px_36px_rgba(15,23,42,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden"
    >
      {/* Subtle Liquid Specular Top Sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/95 dark:via-white/30 to-transparent"
      />
      <div ref={containerRef} className="relative h-full flex items-center gap-1">
        {/* Persistent Sliding Active Pill */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            x: pill.left,
            width: pill.width,
            opacity: pill.visible ? 1 : 0,
            scale: pill.visible ? 1 : 0.92,
          }}
          transition={
            pill.animated
              ? {
                  x: { type: 'spring', stiffness: 290, damping: 28, mass: 0.85 },
                  width: { type: 'spring', stiffness: 290, damping: 28, mass: 0.85 },
                  opacity: { duration: 0.2, ease: 'easeOut' },
                  scale: { duration: 0.2, ease: 'easeOut' },
                }
              : { duration: 0 }
          }
          className="pointer-events-none absolute left-0 inset-y-0 my-auto h-9 rounded-full bg-slate-900 dark:bg-white shadow-[0_6px_16px_rgba(15,23,42,0.22)]"
        />

        {(
          [
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
          ] as const
        ).map(({ id, label }) => {
          const isActive = value === id;
          return (
            <button
              key={id}
              ref={(el) => {
                buttonRefs.current[id] = el;
              }}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              className={`relative z-10 h-9 px-4 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#1D956E] ${
                isActive
                  ? 'text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MarkAsReadButton({
  hasUnread,
  onMarkAllRead,
}: {
  hasUnread: boolean;
  onMarkAllRead: () => void;
}) {
  const isAllRead = !hasUnread;
  const [pulseKey, setPulseKey] = useState(0);
  const [justMarked, setJustMarked] = useState(false);

  useEffect(() => {
    if (!justMarked) return;
    const timer = window.setTimeout(() => setJustMarked(false), 600);
    return () => window.clearTimeout(timer);
  }, [justMarked]);

  const handleClick = () => {
    if (isAllRead) return;
    setPulseKey((k) => k + 1);
    setJustMarked(true);
    onMarkAllRead();
  };

  return (
    <div className="relative inline-flex shrink-0">
      <AnimatePresence>
        {justMarked && (
          <motion.span
            key={pulseKey}
            aria-hidden="true"
            initial={{ scale: 0.92, opacity: 0.65 }}
            animate={{ scale: 1.24, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0 rounded-full border border-slate-900/35 dark:border-white/55"
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={isAllRead}
        aria-label={isAllRead ? 'All notifications read' : 'Mark all notifications as read'}
        whileTap={isAllRead ? undefined : { scale: 0.93 }}
        animate={justMarked ? { scale: [1, 0.92, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={`relative inline-flex items-center justify-center h-10 rounded-full overflow-hidden border transition-colors duration-300 select-none focus-visible:outline-2 focus-visible:outline-[#1D956E] ${
          isAllRead
            ? 'border-slate-200/90 dark:border-white/25 shadow-[0_4px_14px_rgba(15,23,42,0.08)] cursor-default'
            : 'border-black dark:border-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.22)] cursor-pointer'
        }`}
      >
        {/* Base Layer: Black background, white text (unread state) */}
        <span className="inline-flex items-center justify-center gap-1.5 px-4 h-full bg-black text-white text-xs font-semibold whitespace-nowrap">
          <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span>Mark as read</span>
        </span>

        {/* Radial Wipe Layer: White background, black text (read state) */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            clipPath: isAllRead
              ? 'circle(150% at 50% 50%)'
              : 'circle(0% at 50% 50%)',
          }}
          transition={{
            duration: 0.52,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute inset-0 inline-flex items-center justify-center gap-1.5 px-4 bg-white text-black text-xs font-semibold whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span>Mark as read</span>
        </motion.span>
      </motion.button>
    </div>
  );
}

export default function App() {
  const [{ tab: activeTab, dir: tabDirection }, setTabState] = useState<{
    tab: BottomTab;
    dir: number;
  }>({ tab: 'home', dir: 1 });

  const setActiveTab = (
    nextOrUpdater: BottomTab | ((prev: BottomTab) => BottomTab)
  ) => {
    setTabState((prev) => {
      const next =
        typeof nextOrUpdater === 'function'
          ? nextOrUpdater(prev.tab)
          : nextOrUpdater;
      if (next === prev.tab) return prev;
      return {
        tab: next,
        dir: TAB_ORDER[next] >= TAB_ORDER[prev.tab] ? 1 : -1,
      };
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab]);
  const [currentUsd, setCurrentUsd] = useState(DEFAULT_AMOUNT_SUMMARY.currentNgn);
  const [pendingUsd, setPendingUsd] = useState(DEFAULT_AMOUNT_SUMMARY.pendingNgn);
  const [isHidden, setIsHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [stickerFailed, setStickerFailed] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(STORE_ITEMS);
  const [walletHistory, setWalletHistory] = useState<WalletHistoryItem[]>(
    INITIAL_WALLET_HISTORY
  );
  const [streakDays] = useState(7);
  const [copiedLink, setCopiedLink] = useState(false);
  const [plusSheetOpen, setPlusSheetOpen] = useState(false);
  const [selectedTaskOption, setSelectedTaskOption] = useState<PostTaskOption | null>(null);
  const [taskRewardInput, setTaskRewardInput] = useState('500');
  const [walletSheet, setWalletSheet] = useState<'add' | 'withdraw' | 'history' | null>(null);
  const [depositInput, setDepositInput] = useState('500');
  const [withdrawInput, setWithdrawInput] = useState('250');
  const [withdrawError, setWithdrawError] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [taskIcons, setTaskIcons] = useState<Record<string, TaskIconValue>>({});
  const [newTaskIcon, setNewTaskIcon] = useState<TaskIconValue | null>(null);
  const [iconPickerTaskId, setIconPickerTaskId] = useState<string | null>(null);
  const [bonusSheetOpen, setBonusSheetOpen] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [whatsappSheetOpen, setWhatsappSheetOpen] = useState(false);
  const [copiedWhatsappLink, setCopiedWhatsappLink] = useState(false);
  const [failedQuickIcons, setFailedQuickIcons] = useState<Record<string, boolean>>({});
  const [dayPeriod, setDayPeriod] = useState<DayPeriod>(() =>
    getDayPeriod(new Date().getHours())
  );
  const [profile, setProfile] = useState({
    fullName: 'Elena Vance',
    handle: '@elena.nx',
    gender: '',
    phone: '+234 803 412 8890',
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '2048194821',
    referralCode: 'NXELENA8',
    avatarSrc: '/src/assets/images/avatar_executive_user_1794910916279.jpg',
  });
  const [profileSheet, setProfileSheet] = useState<
    | null
    | 'phone'
    | 'socials'
    | 'display'
    | 'badges'
    | 'support'
    | 'terms'
    | 'privacy'
    | 'about'
    | 'logout'
  >(null);
  const [nameDraft, setNameDraft] = useState('Elena Vance');
  const [pinEnabled, setPinEnabled] = useState(true);
  const [securityPin, setSecurityPin] = useState('1234');
  const [pinDraft, setPinDraft] = useState('');
  const [passwordSet, setPasswordSet] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState('');
  const [confirmPasswordDraft, setConfirmPasswordDraft] = useState('');
  const [showPasswordDraft, setShowPasswordDraft] = useState(false);
  const [nigerianBanks, setNigerianBanks] = useState<NigerianBankOption[]>(
    INITIAL_NIGERIAN_BANKS
  );
  const [bankNameDraft, setBankNameDraft] = useState('Kuda Microfinance Bank');
  const [bankCodeDraft, setBankCodeDraft] = useState('50211');
  const [accountNumberDraft, setAccountNumberDraft] = useState('2048194821');
  const [verifiedAccountName, setVerifiedAccountName] = useState('');
  const [bankCheckError, setBankCheckError] = useState('');
  const [isCheckingBank, setIsCheckingBank] = useState(false);

  useEffect(() => {
    if (activeTab !== 'set-bank') return;
    let cancelled = false;
    fetch('/api/banks')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { banks?: NigerianBankOption[] } | null) => {
        if (cancelled || !data?.banks?.length) return;
        setNigerianBanks(data.banks);
      })
      .catch(() => {
        // Keep curated bank list if network lookup is unavailable
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);
  const [settingsBannerVisible, setSettingsBannerVisible] = useState(true);
  const [settingsEmail, setSettingsEmail] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [darkMode, setDarkMode] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );
  const [accountNotice, setAccountNotice] = useState('');
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const navButtonRefs = useRef<
    Partial<Record<'home' | 'tasks' | 'store' | 'referrals', HTMLButtonElement | null>>
  >({});
  const [navPill, setNavPill] = useState<{
    left: number;
    width: number;
    visible: boolean;
    animated: boolean;
  }>({ left: 0, width: 0, visible: false, animated: false });

  useLayoutEffect(() => {
    if (isFullScreenTab(activeTab)) {
      setNavPill((prev) => ({ ...prev, animated: false }));
      return;
    }

    const measure = () => {
      const isDockTab =
        activeTab === 'home' ||
        activeTab === 'tasks' ||
        activeTab === 'store' ||
        activeTab === 'referrals';
      const el = isDockTab ? navButtonRefs.current[activeTab] : null;
      if (!el) {
        setNavPill((prev) => ({ ...prev, visible: false }));
        return;
      }
      const nextLeft = el.offsetLeft;
      const nextWidth = el.offsetWidth;
      setNavPill((prev) => ({
        left: nextLeft,
        width: nextWidth,
        visible: true,
        animated: prev.visible,
      }));
    };

    measure();
    const container = navContainerRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && container
        ? new ResizeObserver(() => measure())
        : null;
    if (ro && container) {
      ro.observe(container);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [activeTab]);

  useEffect(() => {
    if (
      !plusSheetOpen &&
      !walletSheet &&
      !iconPickerTaskId &&
      !bonusSheetOpen &&
      !whatsappSheetOpen &&
      !profileSheet
    ) {
      return;
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (iconPickerTaskId) {
          setIconPickerTaskId(null);
          return;
        }
        setPlusSheetOpen(false);
        setWalletSheet(null);
        setBonusSheetOpen(false);
        setWhatsappSheetOpen(false);
        setProfileSheet(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [
    plusSheetOpen,
    walletSheet,
    iconPickerTaskId,
    bonusSheetOpen,
    whatsappSheetOpen,
    profileSheet,
  ]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nextDone = !task.done;
        setPendingUsd((p) =>
          nextDone ? p + task.rewardUsd : Math.max(0, p - task.rewardUsd)
        );
        return { ...task, done: nextDone };
      })
    );
  };

  const handleAddDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(depositInput);
    if (!Number.isFinite(val) || val <= 0) return;
    setCurrentUsd((prev) => prev + val);
    setWalletHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        type: 'add',
        label: 'Added Funds',
        amountUsd: val,
        date: 'Today',
      },
      ...prev,
    ]);
    setPlusSheetOpen(false);
    setWalletSheet(null);
    setActiveTab('home');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(withdrawInput);
    if (!Number.isFinite(val) || val <= 0) {
      setWithdrawError('Enter a valid amount greater than ₦0.');
      return;
    }
    if (val > currentUsd) {
      setWithdrawError('Amount exceeds available wallet balance.');
      return;
    }
    setWithdrawError('');
    setCurrentUsd((prev) => prev - val);
    setWalletHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        type: 'withdraw',
        label: 'Bank Withdrawal',
        amountUsd: val,
        date: 'Today',
      },
      ...prev,
    ]);
    setWalletSheet(null);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = taskInput.trim();
    if (!clean) return;
    const parsedReward = Number(taskRewardInput);
    const rewardAmount =
      Number.isFinite(parsedReward) && parsedReward > 0 ? parsedReward : 500;

    if (selectedTaskOption?.target === 'store') {
      const newStoreId = `s-${Date.now()}`;
      setStoreItems((prev) => [
        {
          id: newStoreId,
          name: clean,
          category: selectedTaskOption.storeCategory ?? 'Digital',
          priceUsd: rewardAmount,
        },
        ...prev,
      ]);
      setTaskInput('');
      setTaskRewardInput('500');
      setSelectedTaskOption(null);
      setNewTaskIcon(null);
      setPlusSheetOpen(false);
      setActiveTab('store');
      return;
    }

    const newId = `t-${Date.now()}`;
    setTasks((prev) => [
      { id: newId, title: clean, rewardUsd: rewardAmount, done: false },
      ...prev,
    ]);
    if (newTaskIcon) {
      setTaskIcons((prev) => ({ ...prev, [newId]: newTaskIcon }));
    } else if (selectedTaskOption) {
      setTaskIcons((prev) => ({
        ...prev,
        [newId]: { kind: 'preset', key: selectedTaskOption.iconKey },
      }));
    }
    setTaskInput('');
    setTaskRewardInput('500');
    setSelectedTaskOption(null);
    setNewTaskIcon(null);
    setPlusSheetOpen(false);
    setActiveTab('tasks');
  };

  const handleAssignTaskIcon = (value: TaskIconValue | null) => {
    if (!iconPickerTaskId) return;
    if (iconPickerTaskId === '__new__') {
      setNewTaskIcon(value);
      setIconPickerTaskId(null);
      return;
    }
    setTaskIcons((prev) => {
      if (!value) {
        const next = { ...prev };
        delete next[iconPickerTaskId];
        return next;
      }
      return { ...prev, [iconPickerTaskId]: value };
    });
    setIconPickerTaskId(null);
  };

  const handleUploadTaskIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleAssignTaskIcon({ kind: 'image', src: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRefreshAmount = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setDayPeriod(getDayPeriod(new Date().getHours()));
    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 320);
  };

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://nairax.app/r/elena').catch(() => {});
    }
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 1800);
  };

  const profileFirstName = profile.fullName.trim().split(/\s+/)[0] || USER_NAME;
  const profileInitials =
    profile.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'EL';
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    notificationFilter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const monthlyInNgn = walletHistory
    .filter((item) => item.type === 'add')
    .reduce((sum, item) => sum + item.amountUsd, 0);
  const monthlyOutNgn = walletHistory
    .filter((item) => item.type === 'withdraw')
    .reduce((sum, item) => sum + item.amountUsd, 0);
  const completedTasksEarnedNgn = tasks
    .filter((task) => task.done)
    .reduce((sum, task) => sum + task.rewardUsd, 0);
  const totalEarnedNgn = monthlyInNgn + completedTasksEarnedNgn;
  const spentNgn = 0;
  const todayAddedNgn = walletHistory
    .filter((item) => item.type === 'add' && item.date === 'Today')
    .reduce((sum, item) => sum + item.amountUsd, 0);
  const monthlyActivityBars: {
    id: string;
    heightClass: string;
    barClass: string;
  }[] = [
    { id: 'b-1', heightClass: 'h-1', barClass: 'bg-[#1D956E]/35 dark:bg-[#1D956E]/40 rounded-full' },
    { id: 'b-2', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-3', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-4', heightClass: 'h-1', barClass: 'bg-[#1D956E]/35 dark:bg-[#1D956E]/40 rounded-full' },
    { id: 'b-5', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-6', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-7', heightClass: 'h-1', barClass: 'bg-[#1D956E]/35 dark:bg-[#1D956E]/40 rounded-full' },
    { id: 'b-8', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-9', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-10', heightClass: 'h-1', barClass: 'bg-[#1D956E]/35 dark:bg-[#1D956E]/40 rounded-full' },
    { id: 'b-11', heightClass: 'h-1', barClass: 'bg-slate-200 dark:bg-slate-800 rounded-full' },
    { id: 'b-12', heightClass: 'h-10', barClass: 'bg-[#1D956E] rounded-md' },
    { id: 'b-13', heightClass: 'h-14', barClass: 'bg-[#1D956E] rounded-md' },
    {
      id: 'b-14',
      heightClass: todayAddedNgn > 0 ? 'h-8' : 'h-1',
      barClass:
        todayAddedNgn > 0
          ? 'bg-[#1D956E] rounded-md'
          : 'bg-[#1D956E] rounded-full',
    },
  ];

  const weeklyEarningsPoints = (() => {
    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const todayDow = new Date().getDay();
    const baseValues = [
      4200,
      6800,
      5100,
      9400,
      8200,
      14820,
      7600 + todayAddedNgn + completedTasksEarnedNgn,
    ];
    const minVal = Math.min(...baseValues);
    const maxVal = Math.max(...baseValues);
    const span = Math.max(maxVal - minVal, 1);

    return baseValues.map((amount, index) => {
      const dow = (todayDow - (6 - index) + 7) % 7;
      const x = 10 + index * 20;
      const y = Number((39 - ((amount - minVal) / span) * 30).toFixed(2));
      return {
        key: `wk-${index}`,
        dayLabel: dayLetters[dow],
        amount,
        x,
        y,
        isToday: index === 6,
      };
    });
  })();
  const weeklyPolylinePoints = weeklyEarningsPoints
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  const currentGreeting = GREETING_CONFIG[dayPeriod];

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sticky Mobile-First Top App Bar with Liquid Glass Sculpted Center Notch */}
      {!isFullScreenTab(activeTab) && (
        <header className="sticky top-0 z-30 h-14 pointer-events-none">
          {/* SVG ClipPath Definition for Real Backdrop-Blur Refraction */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <clipPath id="nairax-notch-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0 0 L 1 0 L 1 0.227 C 0.887 0.227, 0.877 0.977, 0.764 0.977 L 0.236 0.977 C 0.123 0.977, 0.113 0.227, 0 0.227 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Continuous Liquid Glass Top Ledge + Sculpted Center Notch */}
          <div className="w-full flex items-start justify-center pointer-events-none">
            <div className="flex-1 h-2.5 bg-gradient-to-b from-white/75 to-white/45 dark:from-slate-900/75 dark:to-slate-900/45 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-white/70 dark:border-white/12 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" />
            <div className="relative w-[196px] sm:w-[212px] h-[44px] shrink-0 pointer-events-auto drop-shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
              <div className="w-full h-full [clip-path:url(#nairax-notch-clip)] bg-gradient-to-b from-white/80 via-white/60 to-white/45 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/45 backdrop-blur-2xl backdrop-saturate-[180%]" />
              <svg
                viewBox="0 0 212 44"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full"
              >
                <path
                  d="M 0 10 C 24 10, 26 43, 50 43 L 162 43 C 186 43, 188 10, 212 10"
                  fill="none"
                  strokeWidth="1.25"
                  className="stroke-white/85 dark:stroke-white/15"
                />
                <path
                  d="M 0 10.75 C 24 10.75, 26 42.25, 50 42.25 L 162 42.25 C 186 42.25, 188 10.75, 212 10.75"
                  fill="none"
                  strokeWidth="0.75"
                  className="stroke-slate-900/8 dark:stroke-white/8"
                />
              </svg>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                aria-label="NairaX Home"
                className="absolute inset-0 pb-0.5 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white rounded-b-2xl"
              >
                <span className="font-logo text-[1.4rem] sm:text-[1.55rem] tracking-[-0.03em] text-black dark:text-white whitespace-nowrap leading-none">
                  <span className="font-semibold">Naira</span>
                  <span className="font-extrabold text-[#1D956E]">X</span>
                </span>
              </button>
            </div>
            <div className="flex-1 h-2.5 bg-gradient-to-b from-white/75 to-white/45 dark:from-slate-900/75 dark:to-slate-900/45 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-white/70 dark:border-white/12 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" />
          </div>

          {/* Left Notifications & Right Profile Liquid Glass Controls */}
          <div className="max-w-xl mx-auto px-4 sm:px-6 -mt-[30px] flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              aria-label={`Notifications (${unreadNotificationsCount} unread)`}
              className="pointer-events-auto relative w-9 h-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-slate-900/55 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/80 dark:border-white/15 shadow-[0_6px_18px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.16)] transition-all cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100 text-slate-700 dark:text-slate-200 hover:bg-white/75 dark:hover:bg-slate-800/70"
            >
              <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
              {unreadNotificationsCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1D956E] ring-2 ring-white/90 dark:ring-slate-900"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab((prev) => (prev === 'profile' ? 'home' : 'profile'))
              }
              aria-label="Open profile"
              aria-pressed={activeTab === 'profile'}
              className={`pointer-events-auto p-0.5 rounded-full bg-white/60 dark:bg-slate-900/55 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/80 dark:border-white/15 shadow-[0_6px_18px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.16)] transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1D956E] ${
                activeTab === 'profile'
                  ? 'ring-2 ring-[#1D956E] ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                  : 'hover:bg-white/75 dark:hover:bg-slate-800/70'
              }`}
            >
              {avatarFailed ? (
                <div className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800/80 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {profileInitials}
                </div>
              ) : (
                <img
                  src={profile.avatarSrc}
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Mobile-First Viewport */}
      <main
        className={`flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 flex flex-col justify-start ${
          activeTab === 'notifications'
            ? 'pt-0 pb-16'
            : activeTab === 'settings' || SETTINGS_SUBPAGES.includes(activeTab)
            ? 'pt-4 sm:pt-6 pb-16'
            : 'pt-3 sm:pt-5 pb-36'
        }`}
      >
        <AnimatePresence mode="wait" initial={false} custom={tabDirection}>
          <motion.div
            key={activeTab}
            custom={tabDirection}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
        {activeTab === 'home' && (
          <>
            {/* Session Greeting & Wallet Header */}
            <div className="flex items-center justify-between gap-3 mb-3 px-0.5">
              <div className="flex items-center gap-3 min-w-0">
                {stickerFailed ? (
                  <div
                    aria-hidden="true"
                    className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400"
                  >
                    {dayPeriod === 'morning' ? (
                      <Sun className="w-6 h-6" />
                    ) : dayPeriod === 'afternoon' ? (
                      <CloudSun className="w-6 h-6" />
                    ) : (
                      <Moon className="w-6 h-6" />
                    )}
                  </div>
                ) : (
                  <img
                    src={currentGreeting.stickerSrc}
                    alt={currentGreeting.stickerAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setStickerFailed(true)}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 dark:border-slate-700 shrink-0"
                  />
                )}

                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-tight truncate">
                    {currentGreeting.text}
                  </p>
                  <h1 className="text-lg sm:text-xl font-display font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mt-0.5 truncate">
                    {profileFirstName}
                  </h1>
                </div>
              </div>

              <span className="font-[family-name:var(--font-script)] text-2xl sm:text-[1.75rem] leading-none text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 pr-0.5">
                Wallet
              </span>
            </div>

            {/* Secured Balance Card */}
            <section
              aria-label="Secured balance summary"
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className="w-[18px] h-[18px] text-[#1D956E] shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Secured Balance
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsHidden((v) => !v)}
                    aria-label={isHidden ? 'Show amount' : 'Hide amount'}
                    className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
                  >
                    {isHidden ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={handleRefreshAmount}
                      disabled={isRefreshing}
                      aria-label="Refresh amount"
                      className="min-h-[48px] -mx-2 px-2 py-1 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
                    >
                      {isRefreshing ? (
                        <div className="h-10 sm:h-11 md:h-12 w-40 sm:w-56 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                      ) : (
                        <div className="font-amount tracking-[0.02em] text-slate-900 dark:text-slate-100 text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] leading-none whitespace-nowrap">
                          {isHidden ? (
                            '••••••••'
                          ) : (
                            <NairaAmount
                              amount={currentUsd}
                              compact
                              symbolClassName="text-[0.46em] mr-1 text-slate-500 dark:text-slate-400"
                            />
                          )}
                        </div>
                      )}
                    </button>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 tabular-nums">
                      <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="font-amount">
                        {isHidden ? (
                          'Pending: ••••'
                        ) : (
                          <>
                            Pending:{' '}
                            <NairaAmount amount={pendingUsd} />
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Minimalist 7-Day Earnings Graph */}
                  <div
                    aria-label="7-day earnings trend"
                    className={`w-[136px] sm:w-[168px] shrink-0 pb-0.5 transition-opacity duration-200 ${
                      isHidden ? 'opacity-25' : 'opacity-100'
                    }`}
                  >
                    <svg
                      viewBox="0 0 140 48"
                      role="img"
                      aria-label="7-day earnings dot and line chart"
                      className="w-full h-auto block overflow-visible"
                    >
                      <polyline
                        points={weeklyPolylinePoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#1D956E]"
                      />
                      {weeklyEarningsPoints.map((point) => (
                        <g key={point.key}>
                          {point.isToday && (
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="5.25"
                              className="fill-[#1D956E]/20"
                            />
                          )}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={point.isToday ? 3 : 2.5}
                            strokeWidth="1.25"
                            className="fill-[#1D956E] stroke-white dark:stroke-slate-900"
                          />
                        </g>
                      ))}
                    </svg>
                    <div className="grid grid-cols-7 mt-1 text-center text-[10px] leading-none">
                      {weeklyEarningsPoints.map((point) => (
                        <span
                          key={`${point.key}-label`}
                          className={
                            point.isToday
                              ? 'font-semibold text-slate-800 dark:text-slate-200'
                              : 'font-medium text-slate-400 dark:text-slate-500'
                          }
                        >
                          {point.dayLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wallet Actions Row */}
            <div className="mt-3 grid grid-cols-3 gap-2.5" aria-label="Wallet actions">
              <button
                type="button"
                onClick={() => {
                  setWithdrawError('');
                  setWalletSheet('add');
                }}
                className="min-h-[48px] px-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Add</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWithdrawError('');
                  setWalletSheet('withdraw');
                }}
                className="min-h-[48px] px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
              >
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Withdraw</span>
              </button>

              <button
                type="button"
                onClick={() => setWalletSheet('history')}
                className="min-h-[48px] px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100"
              >
                <History className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>History</span>
              </button>
            </div>

            {/* Quick Actions Strip */}
            <section aria-label="Quick services" className="mt-5">
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBonusSheetOpen(true)}
                  className="min-h-[44px] py-1.5 flex flex-col items-center justify-start gap-2 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900/60 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                >
                  <span className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.09)] dark:shadow-none dark:border dark:border-slate-800 flex items-center justify-center overflow-hidden text-[#1D956E]">
                    {failedQuickIcons.bonus ? (
                      <Gift className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <img
                        src="/src/assets/images/icon_quick_bonus_1794923027027.jpg"
                        alt="Bonus icon"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedQuickIcons((prev) => ({ ...prev, bonus: true }))
                        }
                        className="w-full h-full object-cover scale-110"
                      />
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight text-center">
                    Bonus
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className="min-h-[44px] py-1.5 flex flex-col items-center justify-start gap-2 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900/60 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                >
                  <span className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.09)] dark:shadow-none dark:border dark:border-slate-800 flex items-center justify-center overflow-hidden text-slate-900">
                    {failedQuickIcons.tasks ? (
                      <CheckSquare className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <img
                        src="/src/assets/images/icon_quick_perform_tasks_1794923010635.jpg"
                        alt="Perform Tasks icon"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedQuickIcons((prev) => ({ ...prev, tasks: true }))
                        }
                        className="w-full h-full object-cover scale-110"
                      />
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight text-center">
                    Perform Tasks
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('store')}
                  className="min-h-[44px] py-1.5 flex flex-col items-center justify-start gap-2 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900/60 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                >
                  <span className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.09)] dark:shadow-none dark:border dark:border-slate-800 flex items-center justify-center overflow-hidden text-slate-900">
                    {failedQuickIcons.buySell ? (
                      <ArrowLeftRight className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <img
                        src="/src/assets/images/icon_quick_buy_sell_1794923010032.jpg"
                        alt="Buy and Sell icon"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedQuickIcons((prev) => ({ ...prev, buySell: true }))
                        }
                        className="w-full h-full object-cover scale-110"
                      />
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight text-center">
                    Buy and Sell
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('referrals')}
                  className="min-h-[44px] py-1.5 flex flex-col items-center justify-start gap-2 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900/60 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                >
                  <span className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.09)] dark:shadow-none dark:border dark:border-slate-800 flex items-center justify-center overflow-hidden text-slate-900">
                    {failedQuickIcons.refer ? (
                      <Users className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <img
                        src="/src/assets/images/icon_quick_refer_1794923009114.jpg"
                        alt="Refer icon"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedQuickIcons((prev) => ({ ...prev, refer: true }))
                        }
                        className="w-full h-full object-cover scale-110"
                      />
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight text-center">
                    Refer
                  </span>
                </button>
              </div>
            </section>

            {/* Streak Progress & Next Range Card */}
            {(() => {
              const nextRangeDays =
                streakDays < 7 ? 7 : streakDays < 14 ? 14 : streakDays < 30 ? 30 : Math.ceil((streakDays + 1) / 30) * 30;
              const nextTierName =
                streakDays < 7 ? 'Gold' : streakDays < 14 ? 'Platinum' : 'Diamond';
              const streakProgressPct = Math.min(
                100,
                Math.round((streakDays / nextRangeDays) * 100)
              );
              const daysToBonus = Math.max(1, nextRangeDays - streakDays);
              const completedTasksCount = tasks.filter((t) => t.done).length;
              const totalTasksCount = tasks.length;
              const tasksToNextRange = Math.max(0, totalTasksCount - completedTasksCount);
              const ringRadius = 21;
              const ringCircumference = 2 * Math.PI * ringRadius;
              const ringOffset =
                ringCircumference - (streakProgressPct / 100) * ringCircumference;

              return (
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  aria-label={`${tasksToNextRange} tasks to ${nextTierName}, ${streakProgressPct}% progress, ${streakDays} day streak`}
                  className="mt-4 w-full text-left bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3.5 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                >
                  {/* Left: Circular Progress Ring */}
                  <div
                    role="progressbar"
                    aria-valuenow={streakProgressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Streak range progress"
                    className="relative w-14 h-14 flex items-center justify-center shrink-0"
                  >
                    <svg
                      viewBox="0 0 56 56"
                      className="w-full h-full -rotate-90"
                      aria-hidden="true"
                    >
                      <circle
                        cx="28"
                        cy="28"
                        r={ringRadius}
                        fill="none"
                        strokeWidth="5"
                        className="stroke-slate-100 dark:stroke-slate-800"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r={ringRadius}
                        fill="none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                        className="stroke-[#1D956E] transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute font-amount text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 leading-none">
                      {streakProgressPct}%
                    </span>
                  </div>

                  {/* Middle: Tasks to Next Tier & Days to Bonus */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-[15px] font-display font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {tasksToNextRange > 0
                        ? `${tasksToNextRange} ${tasksToNextRange === 1 ? 'task' : 'tasks'} to ${nextTierName}`
                        : `${nextTierName} range ready`}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {daysToBonus} {daysToBonus === 1 ? 'day' : 'days'} to your{' '}
                      {nextRangeDays}-day bonus{' '}
                      <span className="font-amount text-[#1D956E] dark:text-[#34C194]">
                        ₦500
                      </span>
                    </p>
                  </div>

                  {/* Right: Red Fire Icon & Streak Count Pill */}
                  <div className="px-2.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/45 border border-red-100 dark:border-red-900/50 inline-flex items-center gap-1.5 shrink-0">
                    <Flame
                      className="w-4 h-4 text-red-500 dark:text-red-400 fill-red-500/20 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-amount text-sm text-red-600 dark:text-red-400 leading-none pr-0.5">
                      {streakDays}
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* Hot Tasks Section */}
            <section aria-label="Hot Tasks" className="mt-6 -mx-1.5 sm:-mx-2">
              <h2 className="font-[family-name:var(--font-section)] text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white leading-none mb-3">
                Hot Tasks
              </h2>

              <div className="divide-y divide-slate-200/75 dark:divide-slate-800">
                {HOT_TASKS.map((task) => {
                  const icon = taskIcons[task.id];
                  return (
                    <div
                      key={task.id}
                      className="py-3.5 first:pt-1 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => setIconPickerTaskId(task.id)}
                          aria-label={
                            icon
                              ? `Change icon for ${task.title}`
                              : `Add icon for ${task.title}`
                          }
                          title="Add task icon"
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100 ${
                            icon
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 overflow-hidden'
                              : 'bg-white/75 dark:bg-slate-900/75 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-900 dark:hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <TaskIconPreview icon={icon} alt={`${task.title} icon`} />
                        </button>

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {task.title}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-amount text-[#1D956E] dark:text-[#34C194]">
                              +<NairaAmount amount={task.rewardNgn} />
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{task.eta}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (task.action === 'add') {
                            setWithdrawError('');
                            setWalletSheet('add');
                          } else {
                            setActiveTab(task.action);
                          }
                        }}
                        className="min-h-[44px] px-4 rounded-xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold inline-flex items-center justify-center gap-1 active:scale-[0.97] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
                      >
                        <span>Go</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Join WhatsApp Community Card */}
            <section
              aria-label="WhatsApp Community"
              className="mt-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="w-11 h-11 rounded-2xl bg-[#25D366]/12 dark:bg-[#25D366]/20 border border-[#25D366]/25 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-6 h-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    Join our WhatsApp Community
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Payout alerts, bonus drops, and member updates
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWhatsappSheetOpen(true)}
                className="min-h-[44px] px-4 rounded-xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>
            </section>

            {/* How NairaX Works Section */}
            <section aria-label="How NairaX Works" className="mt-6">
              <h2 className="font-[family-name:var(--font-section)] text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white leading-none mb-3">
                How NairaX Works
              </h2>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-4 sm:p-5 flex items-start gap-3.5">
                  <span className="relative w-11 h-11 rounded-2xl bg-[#1D956E]/10 dark:bg-[#1D956E]/20 border border-[#1D956E]/15 text-[#1D956E] dark:text-[#34C194] flex items-center justify-center shrink-0">
                    <CheckSquare className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1D956E] text-white font-amount text-[10px] leading-none flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      01
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      Complete Tasks &amp; Invite Friends
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Finish quick Hot Tasks, publish in the Digital Store, or share your referral link to earn Naira rewards.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex items-start gap-3.5">
                  <span className="relative w-11 h-11 rounded-2xl bg-[#1D956E]/10 dark:bg-[#1D956E]/20 border border-[#1D956E]/15 text-[#1D956E] dark:text-[#34C194] flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1D956E] text-white font-amount text-[10px] leading-none flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      02
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      Grow Your Streak &amp; Tier
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Stay active daily to reach Gold, Platinum, and Diamond tiers and unlock extra milestone bonuses.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex items-start gap-3.5">
                  <span className="relative w-11 h-11 rounded-2xl bg-[#1D956E]/10 dark:bg-[#1D956E]/20 border border-[#1D956E]/15 text-[#1D956E] dark:text-[#34C194] flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1D956E] text-white font-amount text-[10px] leading-none flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      03
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      Withdraw From Your Secured Balance
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Pending earnings settle directly into your operating wallet so you can withdraw anytime to your bank.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'tasks' && (
          <section
            aria-label="Tasks"
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
                  Tasks
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                  {tasks.filter((t) => t.done).length} of {tasks.length} completed
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlusSheetOpen(true)}
                className="min-h-[44px] px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                New Task
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map((task) => {
                const icon = taskIcons[task.id];
                return (
                  <div
                    key={task.id}
                    className="min-h-[56px] py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setIconPickerTaskId(task.id)}
                        aria-label={
                          icon
                            ? `Change icon for ${task.title}`
                            : `Add icon for ${task.title}`
                        }
                        title="Add task icon"
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100 ${
                          icon
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 overflow-hidden'
                            : 'bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-900 dark:hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <TaskIconPreview icon={icon} alt={`${task.title} icon`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className="min-h-[44px] flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer group"
                      >
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            task.done
                              ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-500'
                          }`}
                        >
                          {task.done && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <span
                          className={`text-sm truncate ${
                            task.done
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100 font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                      </button>
                    </div>

                    <span className="font-amount text-xs text-[#1D956E] dark:text-[#34C194] whitespace-nowrap shrink-0">
                      +<NairaAmount amount={task.rewardUsd} />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'store' && (
          <section
            aria-label="Digital Store"
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4"
          >
            <div>
              <h1 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
                Digital Store
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Available digital products linked to your wallet
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.category}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentUsd((prev) => prev + item.priceUsd)}
                    className="min-h-[44px] px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-amount text-slate-900 dark:text-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    +<NairaAmount amount={item.priceUsd} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'referrals' && (
          <section
            aria-label="Referrals"
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5"
          >
            <div>
              <h1 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
                Referrals
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Invite contacts and earn payouts directly to your wallet
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="p-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Invited
                </div>
                <div className="text-xl font-amount text-slate-900 dark:text-slate-100 mt-1">
                  14
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Earned
                </div>
                <div className="text-xl font-amount text-[#1D956E] dark:text-[#34C194] mt-1">
                  <NairaAmount
                    amount={700}
                    symbolClassName="text-[0.6em] mr-0.5 opacity-80"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyReferral}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Referral Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy Referral Link</span>
                </>
              )}
            </button>
          </section>
        )}

        {activeTab === 'profile' && (
          <section aria-label="User Profile" className="space-y-4">
            {/* Identity Summary */}
            <div className="px-1 py-2">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {avatarFailed ? (
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg font-display font-semibold text-slate-800 dark:text-slate-100">
                      {profileInitials}
                    </div>
                  ) : (
                    <img
                      src={profile.avatarSrc}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base sm:text-lg font-display font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {profile.fullName}
                    </h2>
                    <ShieldCheck
                      className="w-4 h-4 text-[#1D956E] shrink-0"
                      aria-label="Verified Account"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                      {profile.handle}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/20 dark:bg-amber-400/15 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-[11px] font-semibold leading-tight shrink-0">
                      <Award className="w-3 h-3 text-amber-600 dark:text-amber-300 shrink-0" aria-hidden="true" />
                      <span>Gold Tier Member</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  aria-label="Account settings"
                  className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <Settings className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Monthly Movement & Earnings Overview */}
            <div className="space-y-2.5" aria-label="Monthly earnings overview">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                    November
                  </h3>
                  <p className="text-xs sm:text-sm font-amount tabular-nums whitespace-nowrap">
                    <span className="text-[#1D956E] dark:text-[#34C194] font-semibold">
                      {isHidden ? '••••' : formatNaira(monthlyInNgn)} in
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 mx-1.5">
                      ·
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {isHidden ? '••••' : formatNaira(monthlyOutNgn)} out
                    </span>
                  </p>
                </div>

                <div
                  className="mt-5 h-16 flex items-end gap-1.5"
                  aria-hidden="true"
                >
                  {monthlyActivityBars.map((bar) => (
                    <div
                      key={bar.id}
                      className={`flex-1 transition-all duration-300 ${bar.heightClass} ${bar.barClass}`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  From the movements shown below.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="px-3 py-3 sm:p-4 min-w-0 flex flex-col items-center justify-center text-center">
                  <p className="w-full text-sm sm:text-base font-amount font-semibold tabular-nums text-[#1D956E] dark:text-[#34C194] truncate">
                    {isHidden ? (
                      '••••••'
                    ) : (
                      <NairaAmount
                        amount={totalEarnedNgn}
                        symbolClassName="text-[0.76em] mr-0.5 opacity-85"
                      />
                    )}
                  </p>
                  <p className="mt-1 w-full text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    Total Earned
                  </p>
                </div>

                <div className="px-3 py-3 sm:p-4 min-w-0 flex flex-col items-center justify-center text-center">
                  <p className="w-full text-sm sm:text-base font-amount font-semibold tabular-nums text-slate-900 dark:text-slate-100 truncate">
                    {isHidden ? (
                      '••••••'
                    ) : (
                      <NairaAmount
                        amount={monthlyOutNgn}
                        symbolClassName="text-[0.76em] mr-0.5 text-slate-500 dark:text-slate-400"
                      />
                    )}
                  </p>
                  <p className="mt-1 w-full text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    Withdrawn
                  </p>
                </div>

                <div className="px-3 py-3 sm:p-4 min-w-0 flex flex-col items-center justify-center text-center">
                  <p className="w-full text-sm sm:text-base font-amount font-semibold tabular-nums text-slate-900 dark:text-slate-100 truncate">
                    {isHidden ? (
                      '••••••'
                    ) : (
                      <NairaAmount
                        amount={spentNgn}
                        symbolClassName="text-[0.76em] mr-0.5 text-slate-500 dark:text-slate-400"
                      />
                    )}
                  </p>
                  <p className="mt-1 w-full text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    Spent
                  </p>
                </div>
              </div>
            </div>

            {accountNotice && (
              <div className="px-4 py-2.5 rounded-2xl border border-[#1D956E]/30 text-[#1D956E] dark:text-[#34C194] text-xs font-semibold flex items-center justify-between gap-2">
                <span>{accountNotice}</span>
                <button
                  type="button"
                  onClick={() => setAccountNotice('')}
                  aria-label="Dismiss notice"
                  className="p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Account, Growth, Rewards & Community Section (No Background) */}
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                Account
              </h3>
              <div className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                <button
                  type="button"
                  onClick={() => setProfileSheet('socials')}
                  className="w-full px-1 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    Socials
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="w-full px-1 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    Invite friends
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-amount text-slate-500 dark:text-slate-400">
                      {copiedLink ? 'Copied' : profile.referralCode}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileSheet('badges')}
                  className="w-full px-1 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    Level and badges
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Gold
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setWhatsappSheetOpen(true)}
                  className="w-full px-1 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    WhatsApp Community
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setProfileSheet('support')}
                  className="w-full px-1 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    Help and support
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Log out Action (No Background) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setProfileSheet('logout')}
                className="w-full min-h-[48px] px-4 rounded-2xl border border-rose-500/35 bg-transparent hover:bg-rose-500/8 text-rose-600 dark:text-rose-400 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Log out</span>
              </button>
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section aria-label="Notifications" className="space-y-4">
            {/* Sticky Top Navigation Bar */}
            <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 sm:pt-4 pb-2.5 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-slate-200/70 dark:border-slate-800/70">
              <div className="relative flex items-center justify-center min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  aria-label="Back to Home"
                  className="absolute left-0 min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </button>
                <h1 className="text-base sm:text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </h1>
              </div>
            </div>

            {/* Liquid Glass Filter Capsule & Mark as Read Action */}
            <div className="flex items-center justify-between gap-2">
              <NotificationFilterCapsule
                value={notificationFilter}
                onChange={setNotificationFilter}
              />

              <MarkAsReadButton
                hasUnread={unreadNotificationsCount > 0}
                onMarkAllRead={() =>
                  setNotifications((prev) =>
                    prev.map((item) => ({ ...item, read: true }))
                  )
                }
              />
            </div>

            {/* Individual Notification Cards */}
            {filteredNotifications.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-display font-semibold text-slate-900 dark:text-slate-100">
                    {notificationFilter === 'unread'
                      ? 'No unread notifications'
                      : 'All caught up'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {notificationFilter === 'unread'
                      ? 'Switch to All to review earlier notifications.'
                      : 'Task approvals, rejections, and payout alerts appear here.'}
                  </p>
                </div>
                {notifications.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="min-h-[42px] px-4 rounded-xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Back to Home
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((item) => {
                  const isRejected = item.category === 'rejected';
                  const isSettlement = item.category === 'settlement';
                  const isStreak = item.category === 'streak';

                  const badgeBgClass = isRejected
                    ? 'bg-rose-500'
                    : isSettlement
                    ? 'bg-amber-500'
                    : isStreak
                    ? 'bg-slate-900 dark:bg-slate-100'
                    : 'bg-[#1D956E]';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, read: true } : n
                          )
                        )
                      }
                      className={`w-full text-left bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                        !item.read
                          ? 'border-[#1D956E]/40 dark:border-[#1D956E]/50'
                          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeBgClass}`}
                      >
                        {isRejected ? (
                          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <X
                              className="w-3 h-3 text-rose-500"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          </span>
                        ) : isSettlement ? (
                          <Clock
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                          />
                        ) : isStreak ? (
                          <Flame
                            className="w-5 h-5 text-white dark:text-slate-900"
                            aria-hidden="true"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <Check
                              className="w-3 h-3 text-[#1D956E]"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                            {item.title}
                          </span>
                          {!item.read && (
                            <span
                              aria-label="Unread"
                              className="w-2 h-2 rounded-full bg-[#1D956E] shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed tabular-nums">
                          {item.detail}
                        </p>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2">
                          {item.time}
                        </div>
                      </div>

                      <ChevronRight
                        className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section aria-label="Settings" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            {/* Top Settings Header Bar */}
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                aria-label="Back to Profile"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
                Settings
              </h1>
            </div>

            {/* Dismissible Emerald Alert Banner */}
            {settingsBannerVisible && (
              <div className="bg-[#1D956E]/15 dark:bg-[#1D956E]/22 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmailDraft(settingsEmail);
                    setActiveTab('set-email');
                  }}
                  className="text-left min-w-0 flex-1 cursor-pointer"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {settingsEmail ? settingsEmail : 'Add your email address'}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                    {settingsEmail
                      ? 'Email alerts active for payouts & updates'
                      : 'Get emails about updates and offers'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsBannerVisible(false)}
                  aria-label="Dismiss banner"
                  className="min-h-[36px] min-w-[36px] -mr-2 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {accountNotice && (
              <div className="mx-4 sm:mx-6 mt-3 px-4 py-2.5 rounded-xl border border-[#1D956E]/30 bg-[#1D956E]/8 text-[#1D956E] dark:text-[#34C194] text-xs font-semibold flex items-center justify-between gap-2">
                <span>{accountNotice}</span>
                <button
                  type="button"
                  onClick={() => setAccountNotice('')}
                  aria-label="Dismiss notice"
                  className="p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Flat Edge-to-Edge Stacked Sections */}
            <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {/* ACCOUNT */}
              <div className="px-4 sm:px-6 py-5 space-y-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Account
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(profile.fullName);
                    setActiveTab('set-name');
                  }}
                  className="w-full text-left flex items-center gap-3 cursor-pointer group"
                >
                  {avatarFailed ? (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-800 dark:text-slate-100 shrink-0">
                      {profileInitials}
                    </div>
                  ) : (
                    <img
                      src={profile.avatarSrc}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors truncate">
                    {profile.fullName}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const matchedBank = nigerianBanks.find(
                      (b) => b.name === profile.bankName
                    );
                    setBankNameDraft(profile.bankName);
                    setBankCodeDraft(matchedBank?.code ?? '50211');
                    setAccountNumberDraft(profile.accountNumber);
                    setVerifiedAccountName('');
                    setBankCheckError('');
                    setIsCheckingBank(false);
                    setActiveTab('set-bank');
                  }}
                  className="w-full text-left flex items-center justify-between gap-3 py-1 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Payout bank
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums truncate">
                    {profile.bankName} · •••• {profile.accountNumber.slice(-4)}
                  </span>
                </button>
              </div>

              {/* NAME */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Name
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(profile.fullName);
                    setActiveTab('set-name');
                  }}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    {profile.fullName}
                  </span>
                </button>
              </div>

              {/* GENDER */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Gender
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('set-gender')}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    {profile.gender || 'Not set'}
                  </span>
                </button>
              </div>

              {/* PHONE */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Phone
                </h2>
                <button
                  type="button"
                  onClick={() => setProfileSheet('phone')}
                  className="w-full text-left flex items-center justify-between gap-3 py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums group-hover:text-[#1D956E] transition-colors">
                    {profile.phone}
                  </span>
                  <span className="text-xs font-semibold text-[#1D956E] dark:text-[#34C194] shrink-0">
                    Verified
                  </span>
                </button>
              </div>

              {/* SECURITY AND PIN */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Security and PIN
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setPinDraft('');
                    setActiveTab('set-pin');
                  }}
                  className="w-full text-left flex items-center justify-between gap-3 py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    {pinEnabled
                      ? `PIN Protection Enabled · ${securityPin.replace(/./g, '•')}`
                      : 'Not set'}
                  </span>
                </button>
              </div>

              {/* PASSWORD */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordDraft('');
                    setConfirmPasswordDraft('');
                    setShowPasswordDraft(false);
                    setActiveTab('set-password');
                  }}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    {passwordSet ? 'Password Set' : 'Not set'}
                  </span>
                </button>
              </div>

              {/* EMAIL */}
              <div className="px-4 sm:px-6 py-5 space-y-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEmailDraft(settingsEmail);
                    setActiveTab('set-email');
                  }}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  {settingsEmail ? (
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                      {settingsEmail}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Add your email to get updates and special offers
                    </span>
                  )}
                </button>
              </div>

              {/* OPTIONS / NOTIFICATIONS AND DISPLAY */}
              <div className="px-4 sm:px-6 py-5 space-y-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Options
                </h2>
                <button
                  type="button"
                  onClick={() => setProfileSheet('display')}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Notifications and display
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDarkMode((prev) => {
                      const next = !prev;
                      if (typeof document !== 'undefined') {
                        document.documentElement.classList.toggle('dark', next);
                      }
                      return next;
                    })
                  }
                  className="w-full text-left flex items-center justify-between gap-3 py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Dark Mode
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {darkMode ? 'On' : 'Off'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsHidden((v) => !v)}
                  className="w-full text-left flex items-center justify-between gap-3 py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Hide Wallet Balances
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isHidden ? 'Hidden' : 'Visible'}
                  </span>
                </button>
              </div>

              {/* ABOUT */}
              <div className="px-4 sm:px-6 py-5 space-y-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  About
                </h2>
                <button
                  type="button"
                  onClick={() => setProfileSheet('terms')}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Terms of service
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSheet('privacy')}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    Privacy policy
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSheet('about')}
                  className="w-full text-left py-0.5 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1D956E] transition-colors">
                    About NairaX
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'set-name' && (
          <section aria-label="Set Name" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                NAME
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const clean = nameDraft.trim();
                if (clean.length < 2 || clean === profile.fullName) return;
                setProfile((prev) => ({ ...prev, fullName: clean }));
                setAccountNotice('Name updated');
                setActiveTab('settings');
              }}
              className="px-4 sm:px-6 pt-6 space-y-5"
            >
              <input
                type="text"
                maxLength={30}
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Enter your name"
                className="w-full pb-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={nameDraft.trim().length < 2 || nameDraft.trim() === profile.fullName}
                className={`w-full h-12 rounded-[4px] text-sm font-semibold transition-colors ${
                  nameDraft.trim().length >= 2 && nameDraft.trim() !== profile.fullName
                    ? 'bg-[#1D956E] hover:bg-[#177A5A] text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Save name
              </button>

              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <p>Update your display name for NairaX.</p>
                <p>- You may enter between 2 and 30 characters containing letters, spaces, or symbols.</p>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'set-gender' && (
          <section aria-label="Set Gender" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                GENDER
              </h1>
            </div>

            <div className="pt-1">
              {(['Male', 'Female', 'Other', 'Prefer not to say'] as const).map(
                (option) => {
                  const selected = profile.gender === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, gender: option }));
                        setAccountNotice(`Gender set to ${option}`);
                        setActiveTab('settings');
                      }}
                      className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-200/50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <span className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                        {option}
                      </span>
                      {selected && (
                        <Check
                          className="w-4 h-4 text-[#1D956E] shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </section>
        )}

        {activeTab === 'set-email' && (
          <section aria-label="Set Email" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                EMAIL
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const clean = emailDraft.trim();
                const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
                if (!validEmail || clean === settingsEmail) return;
                setSettingsEmail(clean);
                setAccountNotice('Email address updated');
                setActiveTab('settings');
              }}
              className="px-4 sm:px-6 pt-6 space-y-5"
            >
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="name@example.com"
                className="w-full pb-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors"
              />

              {(() => {
                const clean = emailDraft.trim();
                const isReady =
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) &&
                  clean !== settingsEmail;
                return (
                  <button
                    type="submit"
                    disabled={!isReady}
                    className={`w-full h-12 rounded-[4px] text-sm font-semibold transition-colors ${
                      isReady
                        ? 'bg-[#1D956E] hover:bg-[#177A5A] text-white cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Save email
                  </button>
                );
              })()}

              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <p>Add an email address for your NairaX account.</p>
                <p>- Receive payout receipts, security alerts, and platform updates.</p>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'set-password' && (
          <section aria-label="Set Password" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                PASSWORD
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  passwordDraft.length < 6 ||
                  passwordDraft !== confirmPasswordDraft
                ) {
                  return;
                }
                setPasswordSet(true);
                setPasswordDraft('');
                setConfirmPasswordDraft('');
                setShowPasswordDraft(false);
                setAccountNotice('Account password updated');
                setActiveTab('settings');
              }}
              className="px-4 sm:px-6 pt-6 space-y-5"
            >
              <div className="relative">
                <input
                  type={showPasswordDraft ? 'text' : 'password'}
                  value={passwordDraft}
                  onChange={(e) => setPasswordDraft(e.target.value)}
                  placeholder="New password"
                  className="w-full pb-2.5 pr-9 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordDraft((v) => !v)}
                  aria-label={showPasswordDraft ? 'Hide password' : 'Show password'}
                  className="absolute right-0 bottom-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPasswordDraft ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <input
                type={showPasswordDraft ? 'text' : 'password'}
                value={confirmPasswordDraft}
                onChange={(e) => setConfirmPasswordDraft(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pb-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors"
              />

              {(() => {
                const isReady =
                  passwordDraft.length >= 6 &&
                  passwordDraft === confirmPasswordDraft;
                return (
                  <button
                    type="submit"
                    disabled={!isReady}
                    className={`w-full h-12 rounded-[4px] text-sm font-semibold transition-colors ${
                      isReady
                        ? 'bg-[#1D956E] hover:bg-[#177A5A] text-white cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Save password
                  </button>
                );
              })()}

              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <p>Create a password for your NairaX account.</p>
                <p>- Enter at least 6 characters combining letters, numbers, or symbols.</p>
                <p>- Confirm your new password above before saving.</p>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'set-pin' && (
          <section aria-label="Set Security PIN" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                SECURITY PIN
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\d{4}$/.test(pinDraft)) return;
                setSecurityPin(pinDraft);
                setPinEnabled(true);
                setPinDraft('');
                setAccountNotice('Security PIN updated');
                setActiveTab('settings');
              }}
              className="px-4 sm:px-6 pt-6 space-y-5"
            >
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter new 4-digit PIN"
                className="w-full pb-2.5 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium tracking-[0.25em] text-slate-900 dark:text-slate-100 placeholder:tracking-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!/^\d{4}$/.test(pinDraft)}
                className={`w-full h-12 rounded-[4px] text-sm font-semibold transition-colors ${
                  /^\d{4}$/.test(pinDraft)
                    ? 'bg-[#1D956E] hover:bg-[#177A5A] text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Save security PIN
              </button>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Require PIN for payouts
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Protect withdrawals with your 4-digit PIN
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pinEnabled}
                  onClick={() => setPinEnabled((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    pinEnabled ? 'bg-[#1D956E]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      pinEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <p>Create a 4-digit security PIN for NairaX.</p>
                <p>- Enter exactly 4 numeric digits (0–9).</p>
                <p>- Used to verify bank payouts and sensitive account changes.</p>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'set-bank' && (
          <section aria-label="Set Payout Bank" className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <div className="px-4 sm:px-6 h-14 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                aria-label="Back to Settings"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="text-base font-display font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                PAYOUT BANK
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanBank = bankNameDraft.trim();
                const cleanAcc = accountNumberDraft.trim();
                if (
                  cleanBank.length < 2 ||
                  !/^\d{10}$/.test(cleanAcc) ||
                  !verifiedAccountName
                ) {
                  return;
                }
                setProfile((prev) => ({
                  ...prev,
                  bankName: cleanBank,
                  accountNumber: cleanAcc,
                }));
                setAccountNotice(`Payout bank updated (${verifiedAccountName})`);
                setActiveTab('settings');
              }}
              className="px-4 sm:px-6 pt-6 space-y-5"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="payout-bank-select"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Select Nigerian Bank
                </label>
                <div className="relative">
                  <select
                    id="payout-bank-select"
                    value={bankCodeDraft}
                    onChange={(e) => {
                      const nextCode = e.target.value;
                      const match = nigerianBanks.find((b) => b.code === nextCode);
                      setBankCodeDraft(nextCode);
                      if (match) {
                        setBankNameDraft(match.name);
                      }
                      setVerifiedAccountName('');
                      setBankCheckError('');
                    }}
                    className="w-full appearance-none pb-2.5 pr-7 bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white text-base font-medium text-slate-900 dark:text-slate-100 outline-none transition-colors cursor-pointer"
                  >
                    {nigerianBanks.map((bank) => (
                      <option
                        key={`${bank.code}-${bank.name}`}
                        value={bank.code}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      >
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    className="pointer-events-none w-4 h-4 rotate-90 text-slate-400 absolute right-0 bottom-3"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="payout-account-number"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Account Number
                </label>
                <div className="flex items-end gap-3 border-b border-slate-300 dark:border-slate-700 focus-within:border-slate-900 dark:focus-within:border-white pb-2 transition-colors">
                  <input
                    id="payout-account-number"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={accountNumberDraft}
                    onChange={(e) => {
                      setAccountNumberDraft(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      );
                      setVerifiedAccountName('');
                      setBankCheckError('');
                    }}
                    placeholder="Enter 10-digit account number"
                    className="flex-1 min-w-0 bg-transparent text-base font-medium tabular-nums text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    disabled={!/^\d{10}$/.test(accountNumberDraft) || isCheckingBank}
                    onClick={async () => {
                      if (!/^\d{10}$/.test(accountNumberDraft) || isCheckingBank) return;
                      setIsCheckingBank(true);
                      setBankCheckError('');
                      setVerifiedAccountName('');
                      try {
                        const res = await fetch(
                          `/api/banks/resolve?account_number=${encodeURIComponent(
                            accountNumberDraft
                          )}&bank_code=${encodeURIComponent(bankCodeDraft)}`
                        );
                        const data = (await res.json()) as {
                          verified?: boolean;
                          accountName?: string;
                          error?: string;
                        };
                        if (res.ok && data.verified && data.accountName) {
                          setVerifiedAccountName(data.accountName);
                        } else {
                          setBankCheckError(
                            data.error ||
                              'Could not verify this account. Check the bank and 10-digit number.'
                          );
                        }
                      } catch {
                        setBankCheckError(
                          'Unable to reach the live verification server. Please try again.'
                        );
                      } finally {
                        setIsCheckingBank(false);
                      }
                    }}
                    className={`px-3.5 h-8 rounded-[4px] text-xs font-semibold shrink-0 transition-colors ${
                      /^\d{10}$/.test(accountNumberDraft) && !isCheckingBank
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isCheckingBank ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>

              {verifiedAccountName && (
                <div className="px-3.5 py-3 rounded-xl bg-[#1D956E]/10 dark:bg-[#1D956E]/18 border border-[#1D956E]/25 flex items-center gap-2.5">
                  <Check
                    className="w-4 h-4 text-[#1D956E] shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1D956E] dark:text-[#34C194]">
                      Account Verified
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {verifiedAccountName}
                    </div>
                  </div>
                </div>
              )}

              {bankCheckError && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  {bankCheckError}
                </p>
              )}

              {(() => {
                const cleanBank = bankNameDraft.trim();
                const cleanAcc = accountNumberDraft.trim();
                const isReady =
                  cleanBank.length >= 2 &&
                  /^\d{10}$/.test(cleanAcc) &&
                  Boolean(verifiedAccountName);
                return (
                  <button
                    type="submit"
                    disabled={!isReady}
                    className={`w-full h-12 rounded-[4px] text-sm font-semibold transition-colors ${
                      isReady
                        ? 'bg-[#1D956E] hover:bg-[#177A5A] text-white cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Save payout bank
                  </button>
                );
              })()}

              <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <p>Link your primary Nigerian payout bank account for NairaX.</p>
                <p>- Select your bank, enter the 10-digit NUBAN number, and tap Check to confirm the account holder name.</p>
              </div>
            </form>
          </section>
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Production Status Badge */}
      <ProductionFloatingBadge hasBottomDock={!isFullScreenTab(activeTab)} />

      {/* Floating Liquid Glass Capsule Bottom Navigation */}
      {!isFullScreenTab(activeTab) && (
        <div className="fixed bottom-3.5 left-3 right-3 z-40 pointer-events-none">
          <nav
            aria-label="Bottom Navigation"
            className="pointer-events-auto relative max-w-md mx-auto h-14 px-2 rounded-full bg-gradient-to-b from-white/75 via-white/55 to-white/45 dark:from-slate-900/80 dark:via-slate-900/65 dark:to-slate-900/55 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/80 dark:border-white/15 shadow-[0_12px_36px_rgba(15,23,42,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden"
          >
            {/* Subtle Liquid Specular Top Sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/95 dark:via-white/30 to-transparent"
            />
            <div
              ref={navContainerRef}
              className="relative h-full flex items-center justify-between gap-1"
            >
              {/* Persistent Sliding Active Pill */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  x: navPill.left,
                  width: navPill.width,
                  opacity: navPill.visible ? 1 : 0,
                  scale: navPill.visible ? 1 : 0.92,
                }}
                transition={
                  navPill.animated
                    ? {
                        x: { type: 'spring', stiffness: 290, damping: 28, mass: 0.85 },
                        width: { type: 'spring', stiffness: 290, damping: 28, mass: 0.85 },
                        opacity: { duration: 0.2, ease: 'easeOut' },
                        scale: { duration: 0.2, ease: 'easeOut' },
                      }
                    : { duration: 0 }
                }
                className="pointer-events-none absolute left-0 inset-y-0 my-auto h-10 rounded-full bg-slate-900 dark:bg-white shadow-[0_6px_16px_rgba(15,23,42,0.22)]"
              />

              {(
                [
                  { id: 'home', label: 'Home', Icon: Home },
                  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
                  { id: 'store', label: 'Digital Store', Icon: ShoppingBag },
                  { id: 'referrals', label: 'Referrals', Icon: Users },
                ] as const
              ).map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <motion.button
                    key={id}
                    ref={(el) => {
                      navButtonRefs.current[id] = el;
                    }}
                    layout="position"
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-label={label}
                    aria-current={isActive ? 'page' : undefined}
                    transition={{ type: 'spring', stiffness: 290, damping: 28, mass: 0.85 }}
                    className={`relative z-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#1D956E] ${
                      isActive
                        ? 'px-3.5 gap-2 text-white dark:text-slate-950 font-semibold'
                        : 'w-10 shrink-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className="w-[18px] h-[18px] shrink-0"
                      aria-hidden="true"
                    />
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.24,
                          delay: 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="text-xs font-semibold leading-none whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}

              {/* Plus Button Last on the Right Side */}
              <motion.button
                layout="position"
                type="button"
                onClick={() => setPlusSheetOpen(true)}
                aria-label="Quick add"
                transition={{ type: 'spring', stiffness: 290, damping: 28, mass: 0.85 }}
                className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-gradient-to-b from-[#23ad80] to-[#177A5A] hover:from-[#1f9e75] hover:to-[#146b4e] text-white border border-white/35 flex items-center justify-center shadow-[0_6px_16px_rgba(29,149,110,0.36),inset_0_1px_1px_rgba(255,255,255,0.45)] active:scale-95 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1D956E]"
              >
                <Plus className="w-[18px] h-[18px]" aria-hidden="true" />
              </motion.button>
            </div>
          </nav>
        </div>
      )}

      {/* Smooth Slide-Up Categorized Post-Task Drawer for the Plus Action */}
      <AnimatePresence>
        {plusSheetOpen && (
          <motion.div
            key="plus-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Post a task"
            onClick={() => {
              setPlusSheetOpen(false);
              setSelectedTaskOption(null);
            }}
          >
            <motion.div
              key="plus-sheet-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 360, mass: 0.9 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl flex flex-col max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 sm:px-3 pt-3 pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2.5" />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {selectedTaskOption && (
                      <button
                        type="button"
                        onClick={() => setSelectedTaskOption(null)}
                        aria-label="Back to task categories"
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="min-w-0 pl-1">
                      <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                        {selectedTaskOption
                          ? selectedTaskOption.label
                          : 'Post a New Task'}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPlusSheetOpen(false);
                      setSelectedTaskOption(null);
                    }}
                    aria-label="Close post task drawer"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-900 dark:text-slate-100 rounded-xl cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-3.5 pb-8">
                {!selectedTaskOption ? (
                  <div className="space-y-5">
                    {POST_TASK_CATEGORIES.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5 px-1.5">
                          {category.title}
                        </h3>
                        <div className="bg-transparent divide-y divide-slate-100 dark:divide-slate-800">
                          {category.items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedTaskOption(item);
                                setTaskInput(item.defaultTitle);
                                setTaskRewardInput(String(item.defaultRewardNgn));
                              }}
                              className="w-full px-1.5 py-3 flex items-center justify-between gap-2.5 text-left bg-transparent active:scale-[0.99] transition-transform cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span
                                  className={`w-9 h-9 flex items-center justify-center shrink-0 ${item.badgeClass}`}
                                >
                                  {item.renderIcon()}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight
                                className="w-4 h-4 text-slate-900 dark:text-slate-100 shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleAddTask} className="space-y-4 px-1">
                    <div className="py-2 flex items-center gap-2.5">
                      <span
                        className={`w-9 h-9 flex items-center justify-center shrink-0 ${selectedTaskOption.badgeClass}`}
                      >
                        {selectedTaskOption.renderIcon()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {selectedTaskOption.label}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="quick-task-input"
                        className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
                      >
                        {selectedTaskOption.target === 'store' ? 'Item Name' : 'Task Title'}
                      </label>
                      <div className="flex gap-2">
                        {selectedTaskOption.target !== 'store' && (
                          <button
                            type="button"
                            onClick={() => setIconPickerTaskId('__new__')}
                            aria-label={newTaskIcon ? 'Change task icon' : 'Add task icon'}
                            title="Add task icon"
                            className={`w-12 min-h-[48px] rounded-2xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              newTaskIcon
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 overflow-hidden'
                                : 'bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-900 dark:hover:border-slate-300'
                            }`}
                          >
                            <TaskIconPreview icon={newTaskIcon ?? undefined} alt="New task icon" />
                          </button>
                        )}
                        <input
                          id="quick-task-input"
                          type="text"
                          required
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                          placeholder={
                            selectedTaskOption.target === 'store'
                              ? 'Enter digital item name...'
                              : 'Enter task title...'
                          }
                          className="flex-1 min-h-[48px] px-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="quick-task-reward"
                        className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
                      >
                        {selectedTaskOption.target === 'store'
                          ? 'Price (NGN)'
                          : 'Reward Amount (NGN)'}
                      </label>
                      <input
                        id="quick-task-reward"
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={taskRewardInput}
                        onChange={(e) => setTaskRewardInput(e.target.value)}
                        className="w-full min-h-[48px] px-4 text-base font-amount bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all"
                    >
                      {selectedTaskOption.target === 'store' ? 'Publish Item' : 'Publish Task'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Action Bottom Sheets (Add, Withdraw, History) */}
      {walletSheet && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={
            walletSheet === 'add'
              ? 'Add Funds'
              : walletSheet === 'withdraw'
              ? 'Withdraw Funds'
              : 'Wallet History'
          }
          onClick={() => setWalletSheet(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                {walletSheet === 'add'
                  ? 'Add Funds'
                  : walletSheet === 'withdraw'
                  ? 'Withdraw Funds'
                  : 'Transaction History'}
              </h2>
              <button
                type="button"
                onClick={() => setWalletSheet(null)}
                aria-label="Close sheet"
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {walletSheet === 'add' && (
              <form onSubmit={handleAddDeposit} className="space-y-4">
                <div>
                  <label
                    htmlFor="wallet-add-input"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
                  >
                    Amount to Add (NGN)
                  </label>
                  <input
                    id="wallet-add-input"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={depositInput}
                    onChange={(e) => setDepositInput(e.target.value)}
                    className="w-full min-h-[48px] px-4 text-base font-amount bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Confirm Deposit
                </button>
              </form>
            )}

            {walletSheet === 'withdraw' && (
              <form onSubmit={handleWithdraw} className="space-y-4">
                {withdrawError && (
                  <div className="px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
                    {withdrawError}
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                    <label htmlFor="wallet-withdraw-input" className="font-medium">
                      Withdraw Amount (NGN)
                    </label>
                    <span className="font-amount">
                      Available: <NairaAmount amount={currentUsd} />
                    </span>
                  </div>
                  <input
                    id="wallet-withdraw-input"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                    className="w-full min-h-[48px] px-4 text-base font-amount bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Confirm Withdrawal
                </button>
              </form>
            )}

            {walletSheet === 'history' && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {walletHistory.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        {item.date}
                      </div>
                    </div>
                    <div
                      className={`font-amount text-sm whitespace-nowrap shrink-0 ${
                        item.type === 'add'
                          ? 'text-[#1D956E] dark:text-[#34C194]'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {item.type === 'add' ? '+' : '-'}
                      <NairaAmount amount={item.amountUsd} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Task Icon Picker / Upload Bottom Sheet */}
      {iconPickerTaskId && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Choose task icon"
          onClick={() => setIconPickerTaskId(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                Add Task Icon
              </h2>
              <button
                type="button"
                onClick={() => setIconPickerTaskId(null)}
                aria-label="Close task icon picker"
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-white cursor-pointer">
              <ImagePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Upload Custom Icon</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadTaskIcon}
                className="sr-only"
              />
            </label>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
                Or pick an icon
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {TASK_ICON_OPTIONS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleAssignTaskIcon({ kind: 'preset', key })}
                    className="min-h-[56px] p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
                  >
                    <Icon className="w-5 h-5" aria-hidden={true} />
                    <span className="text-[11px] font-medium whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {((iconPickerTaskId === '__new__' && newTaskIcon) ||
              (iconPickerTaskId !== '__new__' && taskIcons[iconPickerTaskId])) && (
              <button
                type="button"
                onClick={() => handleAssignTaskIcon(null)}
                className="w-full min-h-[44px] rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                Remove Icon
              </button>
            )}
          </div>
        </div>
      )}
      {/* Daily Bonus Bottom Sheet */}
      {bonusSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Daily Bonus"
          onClick={() => setBonusSheetOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift
                  className="w-5 h-5 text-[#1D956E]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                  Daily Bonus
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBonusSheetOpen(false)}
                aria-label="Close daily bonus"
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Today&apos;s NairaX Reward
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {bonusClaimed
                    ? 'Credited to your secured balance'
                    : 'Ready to claim directly into your wallet'}
                </div>
              </div>
              <span className="font-amount text-lg text-[#1D956E] dark:text-[#34C194] whitespace-nowrap shrink-0">
                +<NairaAmount amount={500} />
              </span>
            </div>

            <button
              type="button"
              disabled={bonusClaimed}
              onClick={() => {
                if (bonusClaimed) return;
                setBonusClaimed(true);
                setCurrentUsd((prev) => prev + 500);
                setWalletHistory((prev) => [
                  {
                    id: `h-${Date.now()}`,
                    type: 'add',
                    label: 'Daily Bonus',
                    amountUsd: 500,
                    date: 'Today',
                  },
                  ...prev,
                ]);
                setBonusSheetOpen(false);
              }}
              className={`w-full min-h-[48px] px-4 rounded-2xl text-xs font-semibold transition-all ${
                bonusClaimed
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 cursor-pointer active:scale-[0.98]'
              }`}
            >
              {bonusClaimed ? 'Bonus Claimed Today' : 'Claim ₦500.00 Bonus'}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Community Bottom Sheet */}
      {whatsappSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Join WhatsApp Community"
          onClick={() => setWhatsappSheetOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#25D366]/15 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
                <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                  WhatsApp Community
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappSheetOpen(false)}
                aria-label="Close WhatsApp community sheet"
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                NairaX Official Channel
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect with verified members for instant payout updates, new Hot Tasks, and priority announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://chat.whatsapp.com/NairaXCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard
                      .writeText('https://chat.whatsapp.com/NairaXCommunity')
                      .catch(() => {});
                  }
                  setCopiedWhatsappLink(true);
                  window.setTimeout(() => setCopiedWhatsappLink(false), 1800);
                }}
                className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                {copiedWhatsappLink ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Invite Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy Invite Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Action Bottom Sheet */}
      {profileSheet && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Account details"
          onClick={() => setProfileSheet(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                {profileSheet === 'phone' && 'Phone Verification'}
                {profileSheet === 'socials' && 'Connected Socials'}
                {profileSheet === 'display' && 'Notifications and Display'}
                {profileSheet === 'badges' && 'Level and Badges'}
                {profileSheet === 'support' && 'Help and Support'}
                {profileSheet === 'terms' && 'Terms of Service'}
                {profileSheet === 'privacy' && 'Privacy Policy'}
                {profileSheet === 'about' && 'About NairaX'}
                {profileSheet === 'logout' && 'Log out'}
              </h2>
              <button
                type="button"
                onClick={() => setProfileSheet(null)}
                aria-label="Close"
                className="min-h-[40px] min-w-[40px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSheet === 'phone' && (
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {profile.phone}
                </div>
                <div className="text-xs text-[#1D956E] dark:text-[#34C194] font-medium">
                  Verified for SMS alerts and withdrawals
                </div>
              </div>
            )}

            {profileSheet === 'socials' && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {['WhatsApp · Connected', 'Instagram · Connected', 'X (Twitter) · Connected'].map(
                  (row) => (
                    <div
                      key={row}
                      className="py-3 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
                    >
                      <span>{row.split(' · ')[0]}</span>
                      <span className="text-[#1D956E] dark:text-[#34C194] font-semibold">
                        Connected
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            {profileSheet === 'display' && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Dark Mode
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    onClick={() =>
                      setDarkMode((prev) => {
                        const next = !prev;
                        if (typeof document !== 'undefined') {
                          document.documentElement.classList.toggle('dark', next);
                        }
                        return next;
                      })
                    }
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      darkMode ? 'bg-[#1D956E]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Hide Wallet Balances
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isHidden}
                    onClick={() => setIsHidden((v) => !v)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      isHidden ? 'bg-[#1D956E]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        isHidden ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileSheet(null);
                    setActiveTab('notifications');
                  }}
                  className="w-full py-3 text-left text-xs font-semibold text-[#1D956E] dark:text-[#34C194] cursor-pointer"
                >
                  Open Notifications Feed
                </button>
              </div>
            )}

            {profileSheet === 'badges' && (
              <div className="p-4 rounded-2xl border border-amber-500/30 space-y-1.5">
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Gold Tier Member · {streakDays}-Day Streak
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Complete 46 more verified tasks to unlock Platinum Tier rewards on NairaX.
                </p>
              </div>
            )}

            {profileSheet === 'support' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Reach NairaX support anytime via our verified WhatsApp community channel or support desk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setProfileSheet(null);
                    setWhatsappSheetOpen(true);
                  }}
                  className="w-full min-h-[46px] rounded-2xl bg-[#1D956E] hover:bg-[#177A5A] text-white text-xs font-semibold cursor-pointer"
                >
                  Open WhatsApp Support
                </button>
              </div>
            )}

            {profileSheet === 'terms' && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                All tasks posted and completed on NairaX must provide authentic engagement and valid verification proof. Fraudulent submissions are rejected automatically.
              </p>
            )}

            {profileSheet === 'privacy' && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                NairaX encrypts your account credentials, payout bank details, and verification records. Your personal data is never sold to third parties.
              </p>
            )}

            {profileSheet === 'about' && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                NairaX v2.4 — Complete social & digital tasks, sell digital products, and withdraw earnings directly to your Nigerian bank account.
              </p>
            )}

            {profileSheet === 'logout' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to log out of your NairaX session on this device?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setProfileSheet(null)}
                    className="min-h-[44px] rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileSheet(null);
                      setAccountNotice('Session logged out');
                    }}
                    className="min-h-[44px] rounded-2xl text-white text-xs font-semibold cursor-pointer bg-rose-600 hover:bg-rose-700"
                  >
                    Confirm Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
