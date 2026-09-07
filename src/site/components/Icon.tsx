/** Set de iconos lineales propios. Nunca se usan emoji en las templates. */

export type IconName =
  | 'paw'
  | 'bath'
  | 'scissors'
  | 'brush'
  | 'nail'
  | 'ear'
  | 'spa'
  | 'sparkle'
  | 'heart'
  | 'shield'
  | 'award'
  | 'user'
  | 'clock'
  | 'calendar'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'google'
  | 'star'
  | 'play'
  | 'arrowRight'
  | 'arrowLeft'
  | 'chevronDown'
  | 'plus'
  | 'minus'
  | 'close'
  | 'menu'
  | 'check'
  | 'bell'
  | 'notes'
  | 'lock'
  | 'bone'
  | 'dog'
  | 'towel'
  | 'search'
  | 'external'
  /* --- Genéricos de servicio, añadidos con los nichos nuevos --- */
  | 'bug'
  | 'alert'
  | 'home'
  | 'bed'
  | 'building'
  | 'factory'
  | 'briefcase'
  | 'utensils'
  | 'leaf'
  | 'sun'
  | 'spray'
  | 'checkCircle'
  | 'fileText'
  | 'userCheck'
  | 'target'
  | 'map'
  | 'truck'
  | 'droplet'
  | 'ruler'
  | 'hammer'
  | 'grid'
  | 'layers'
  | 'penTool'
  | 'list'
  | 'wood'
  | 'chat'
  | 'book'
  | 'puzzle'
  | 'smile'
  | 'activity'
  | 'stretch'
  | 'image';

const PATHS: Record<IconName, string> = {
  paw: 'M7.2 10.4a2.2 2.4 0 1 0 0-4.8 2.2 2.4 0 0 0 0 4.8Zm9.6 0a2.2 2.4 0 1 0 0-4.8 2.2 2.4 0 0 0 0 4.8ZM4 15.6a1.9 2.1 0 1 0 0-4.2 1.9 2.1 0 0 0 0 4.2Zm16 0a1.9 2.1 0 1 0 0-4.2 1.9 2.1 0 0 0 0 4.2ZM12 12.6c-2.7 0-5 2.1-5 4.4 0 1.6 1.3 2.6 3 2.6.8 0 1.4-.2 2-.4.6.2 1.2.4 2 .4 1.7 0 3-1 3-2.6 0-2.3-2.3-4.4-5-4.4Z',
  bath: 'M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Zm3-7a2.5 2.5 0 0 1 5 0v7M6.5 21l-1 1.5M17.5 21l1 1.5M9.6 5.2h.01',
  scissors: 'M6.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.7 7.2 19 19M8.7 16.8 19 5',
  brush: 'M6 3h4v9a2 2 0 0 1-2 2 2 2 0 0 1-2-2V3Zm2 13v5m6-18v7m3-7v7m-6-7v7m-3 0h12v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2Z',
  nail: 'M12 3c2.5 0 4 1.8 4 4v7a4 4 0 0 1-8 0V7c0-2.2 1.5-4 4-4Zm-4 8h8m-8 4h8',
  ear: 'M9 21c0-3 1.5-4 1.5-6.5A3.5 3.5 0 0 0 7 11a4 4 0 0 1 0-8 6 6 0 0 1 6 6c0 3-2 4-2 6m4-6a2 2 0 1 1 4 0c0 3-2 4-2 7',
  spa: 'M12 21c0-5 2.5-8 6-9-1 4-3 7-6 9Zm0 0c0-5-2.5-8-6-9 1 4 3 7 6 9Zm0-9c1.7-1.4 2.5-3.2 2.5-5A2.5 2.5 0 0 0 12 4a2.5 2.5 0 0 0-2.5 3c0 1.8.8 3.6 2.5 5Z',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 9.5.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4Z',
  heart: 'M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 8.2 4.5c1.6 0 3 .8 3.8 2.1a4.4 4.4 0 0 1 3.8-2.1 4.7 4.7 0 0 1 4.7 4.7c0 5.8-8.5 11.3-8.5 11.3Z',
  shield: 'M12 3l7.5 3v5.5c0 4.5-3.1 8.4-7.5 9.5-4.4-1.1-7.5-5-7.5-9.5V6L12 3Zm-3 8.6 2.2 2.2L15.4 10',
  award: 'M12 14.5a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4ZM8.6 13.6 7 21.5l5-2.4 5 2.4-1.6-7.9',
  user: 'M12 12.4a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4ZM4.5 21a7.5 7.5 0 0 1 15 0',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5.2l3.4 2',
  calendar: 'M4.5 6.5h15v13.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V6.5Zm3-3.5v4m9-4v4m-12 6h15',
  phone: 'M6.6 3.5h3l1.6 4-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z',
  mail: 'M3.5 6h17v12h-17V6Zm0 .8 8.5 6.4 8.5-6.4',
  pin: 'M12 21.5s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.3a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8Z',
  whatsapp:
    'M3.5 20.5 4.9 16A8.4 8.4 0 1 1 8 19.1l-4.5 1.4Zm5.9-5.8c1.4 2 3.1 2.7 4 2.9.8.2 1.6 0 2-.5.3-.4.4-1 .3-1.2l-1.9-.9-.9 1a6.2 6.2 0 0 1-2.6-2.6l1-.9-.9-1.9c-.2-.1-.8 0-1.2.3-.5.4-.7 1.2-.5 2 .2.9.8 1.9 1.7 3Z',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Zm4.5 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm4.9-1.4h.01',
  facebook: 'M13.6 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.7V13h2.7v8h3.2Z',
  tiktok: 'M15 3.5c.4 2 1.7 3.4 3.8 3.6v2.7c-1.4.1-2.7-.3-3.8-1.1v5.6a5.4 5.4 0 1 1-4.6-5.3v2.9a2.5 2.5 0 1 0 1.8 2.4V3.5H15Z',
  google:
    'M20.8 12.2c0-.7-.06-1.3-.18-1.9H12v3.6h5a4.2 4.2 0 0 1-1.85 2.8v2.3h3c1.76-1.6 2.65-4 2.65-6.8ZM12 21c2.4 0 4.4-.8 5.9-2.2l-3-2.3c-.8.55-1.9.9-2.9.9-2.3 0-4.2-1.5-4.9-3.6H4v2.3A9 9 0 0 0 12 21ZM7.1 13.8a5.4 5.4 0 0 1 0-3.5V8H4a9 9 0 0 0 0 8.1l3.1-2.3ZM12 6.6c1.3 0 2.5.45 3.4 1.3l2.6-2.6A9 9 0 0 0 4 8l3.1 2.3C7.8 8.1 9.7 6.6 12 6.6Z',
  star: 'M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.5Z',
  play: 'M8.5 5.5 18 12l-9.5 6.5v-13Z',
  arrowRight: 'M4 12h16m-6-6 6 6-6 6',
  arrowLeft: 'M20 12H4m6-6-6 6 6 6',
  chevronDown: 'm6 9.5 6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  bell: 'M6 17V11a6 6 0 1 1 12 0v6l1.5 2.5h-15L6 17Zm4 2.5a2 2 0 0 0 4 0',
  notes: 'M6 3.5h9L19 7.5v13h-13v-17Zm8 0v4h4M9 12h6m-6 4h6',
  lock: 'M6.5 10.5h11v9h-11v-9Zm2-1V7a3.5 3.5 0 1 1 7 0v2.5M12 14v2',
  bone: 'M7.5 8.5a2.2 2.2 0 1 1 1.8 2.2l5.4 2.6a2.2 2.2 0 1 1-.7 1.9l-5.4-2.6A2.2 2.2 0 1 1 7 11.3',
  dog: 'M5 9.5 4 5l3.5 2h9L20 5l-1 4.5v4A6.5 6.5 0 0 1 12.5 20h-1A6.5 6.5 0 0 1 5 13.5v-4Zm4 2h.01m6 0h.01M10.5 15.5h3',
  towel: 'M5 4.5h11a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3v-12Zm3 0v12h11M8 8h5m-5 3h5',
  search: 'M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.6-2 4 4',
  external: 'M14 4.5h5.5V10M19 5l-8 8M18 14v5.5H4.5V6H10',

  /* --- Genéricos de servicio --- */
  bug: 'M12 7.5a4 4 0 0 1 4 4v3a4 4 0 0 1-8 0v-3a4 4 0 0 1 4-4Zm-2.6-.6L8 5m6.6 1.9L16 5M8 11H4.5M16 11h3.5M8 15H4.5M16 15h3.5M9.5 19 8 21m6.5-2 1.5 2M12 7.5V5',
  alert: 'M12 3.8 21 19.5H3L12 3.8Zm0 5.2v5m0 3h.01',
  home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z',
  bed: 'M3 19v-9m0 4h18v5M3 14V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6m0 0h9a1 1 0 0 0-1-4h-8M6.5 11h.01M21 19v-4',
  building: 'M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M16 9h3a1 1 0 0 1 1 1v11M8 7h5M8 11h5M8 15h5m-2 6v-4h2v4',
  factory: 'M3 21V11l5 3V11l5 3V7l6 3v11H3Zm0 0h18M7 17h.01M12 17h.01M17 17h.01',
  briefcase: 'M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5 0V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V8M3 13h18',
  utensils: 'M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-1.5 1.5-2 3.5-2 5.5S15 12 16.5 12H17v9',
  leaf: 'M4.5 19.5C4.5 11 10 5.5 20 4.5c1 10-4.5 15.5-13 15.5H4.5Zm3.5-3.5L18 6',
  sun: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8',
  spray: 'M9 8h5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm1-4h3v4h-3V4Zm7 1h.01M19.5 3h.01M19.5 7h.01M17 9.5h.01M9 13h5',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.6-9.2 2.4 2.4 4.8-4.8',
  fileText: 'M13.5 3H6.5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M8.5 13h7M8.5 17h5',
  userCheck: 'M10 12.4a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4ZM3 21a7 7 0 0 1 12.2-4.7M16 18.5l2 2 4-4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  map: 'm3 6.5 6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5V6.5Zm6-2.5v13.5m6-11v13.5',
  truck: 'M3 6.5h11v10H3v-10Zm11 4h4l3 3v3.5h-7v-6.5ZM7 20a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 7 20Zm10 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z',
  droplet: 'M12 3.5c3 3.8 5.5 6.8 5.5 9.8a5.5 5.5 0 0 1-11 0c0-3 2.5-6 5.5-9.8Z',
  ruler: 'M3.5 15.5 15.5 3.5l5 5-12 12-5-5Zm3-3 2 2m1.5-5 2 2m1.5-5 2 2',
  hammer: 'm13 8-8.5 8.5a2.1 2.1 0 0 0 3 3L16 11M11 6l4-3 6 6-3 4-7-7Z',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5',
  penTool: 'm12 3 7 7-9 9-7 2 2-7 7-11Zm0 0 2.5 6.5L19 10M5 14l5 5M8.5 17.5l3-3',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  wood: 'M4 7.5c0-1.4 3.6-2.5 8-2.5s8 1.1 8 2.5v9c0 1.4-3.6 2.5-8 2.5s-8-1.1-8-2.5v-9Zm0 0c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5M9 10.2v8.4',
  chat: 'M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm4 5h.01M12 10.5h.01M16 10.5h.01',
  book: 'M4 4.5h6a3 3 0 0 1 2 3v12a2.5 2.5 0 0 0-2-2H4v-13Zm16 0h-6a3 3 0 0 0-2 3v12a2.5 2.5 0 0 1 2-2h6v-13Z',
  puzzle: 'M10 4.5h4v2a1.8 1.8 0 1 0 3.6 0v-2h2v4h2a1.8 1.8 0 1 1 0 3.6h-2v4h-4v-2a1.8 1.8 0 1 0-3.6 0v2h-4v-4H6a1.8 1.8 0 1 1 0-3.6h2v-4h2Z',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-11h.01M15.5 10h.01M8 14.5a5 5 0 0 0 8 0',
  activity: 'M3 12.5h4L10 5l4 14 3-6.5h4',
  stretch: 'M12 5.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM12 7v6m0 0-3.5 7M12 13l3.5 7M6 9.5 12 8l6 1.5',
  image: 'M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm4.5 5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM3 15l5-4 4 3 3.5-2.5L21 16',
};

const FILLED: Partial<Record<IconName, boolean>> = {
  paw: true,
  heart: true,
  star: true,
  play: true,
  whatsapp: true,
  facebook: true,
  tiktok: true,
  google: true,
};

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, className, strokeWidth = 1.7 }: IconProps) {
  const filled = FILLED[name] ?? false;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[name]}
        stroke={filled ? 'none' : 'currentColor'}
        fill={filled ? 'currentColor' : 'none'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function isIconName(value: string): value is IconName {
  return value in PATHS;
}

export const ICON_NAMES = Object.keys(PATHS) as IconName[];
